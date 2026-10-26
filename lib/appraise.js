import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-5-5";

let client;

// The SDK reads ANTHROPIC_API_KEY from the environment. Never put the key in code.
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AppraisalError("not_configured", "ANTHROPIC_API_KEY is not set.");
  }
  client ??= new Anthropic();
  return client;
}

export class AppraisalError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const SCHEMA = {
  type: "object",
  properties: {
    item: {
      type: "string",
      description: "Short name of the item, e.g. 'Vintage 90s denim chore jacket'.",
    },
    brand: {
      type: "string",
      description: "Brand if a logo, tag, or label is visible in the photo. Empty string if not visible.",
    },
    resale_low: { type: "number", description: "Low end of the likely resale price in USD." },
    resale_high: { type: "number", description: "High end of the likely resale price in USD." },
    verdict: { type: "string", enum: ["worth_it", "skip_it"] },
    reason: {
      type: "string",
      description: "One or two plain sentences explaining the verdict.",
    },
  },
  required: ["item", "brand", "resale_low", "resale_high", "verdict", "reason"],
  additionalProperties: false,
};

const SYSTEM = `You are the appraiser inside Worth It?, an app for thrift resellers who sell on Depop, Poshmark, and eBay. A reseller is standing in a thrift store and has sent you a photo of an item they are thinking about buying to resell.

Identify the item as specifically as the photo allows: category, style, era, material. Name the brand only if a logo, tag, or label is actually visible; never guess a brand from style alone, and return an empty string when none is visible.

Estimate a realistic resale price range in US dollars, based on what comparable used items actually sell for on those platforms, not asking prices. Account for visible condition. Keep the range honest and reasonably tight.

Then give a verdict:
- "worth_it" if the reseller would likely make a meaningful profit after paying for the item, platform fees (roughly 10 to 20 percent of the sale), and shipping supplies, and the item is likely to sell within a few months.
- "skip_it" otherwise, including when demand is low, the profit is thin, or the item is hard to identify from the photo.
If the user tells you what they paid, base the verdict on that price. If not, assume a typical thrift store price for this kind of item and say so in the reason.

The reason should be one or two short, friendly sentences a reseller can act on, mentioning the main factor behind the verdict.

If the photo does not show a sellable item, or is too blurry to judge, return verdict "skip_it", a resale range of 0 to 0, and use the reason to ask for a clearer photo.`;

// imageBase64: base64 string without a data: prefix. paid: number in USD or null.
export async function appraiseItem({ imageBase64, mediaType, paid }) {
  const anthropic = getClient();

  const priceLine =
    paid == null
      ? "I didn't say what it costs. Assume a typical thrift store price."
      : `It costs $${paid.toFixed(2)} at the thrift store.`;

  const response = await anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    // Fast, cheap verdicts: this is a quick judgment, not a long analysis.
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema: SCHEMA },
    },
    // If a safety classifier declines, retry server-side on Anthropic's recommended fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          { type: "text", text: `Is this worth buying to resell? ${priceLine}` },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new AppraisalError("refused", `Request declined (${response.stop_details?.category ?? "unknown"}).`);
  }
  if (response.stop_reason === "max_tokens") {
    throw new AppraisalError("bad_output", "Response was cut off.");
  }

  const text = response.content.find((b) => b.type === "text")?.text;
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AppraisalError("bad_output", "Response was not valid JSON.");
  }

  const low = Math.max(0, Math.round(Number(data.resale_low)));
  const high = Math.max(low, Math.round(Number(data.resale_high)));
  if (!data.item || !Number.isFinite(low) || !["worth_it", "skip_it"].includes(data.verdict)) {
    throw new AppraisalError("bad_output", "Response was missing fields.");
  }

  return {
    item: String(data.item),
    brand: String(data.brand ?? "").trim(),
    resaleLow: low,
    resaleHigh: high,
    verdict: data.verdict,
    reason: String(data.reason ?? ""),
  };
}
