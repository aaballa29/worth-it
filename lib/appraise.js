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

export const VERDICTS = ["buy_it", "maybe", "skip_it"];
export const CONFIDENCE = ["high", "medium", "low"];
const BRAND_STATUS = ["identified", "user_provided", "unclear"];

// Field order matters: the model fills in the evidence (type, brand, material, condition)
// before it commits to a price and a verdict.
const SCHEMA = {
  type: "object",
  properties: {
    item: {
      type: "string",
      description: "Short, specific name, e.g. 'Vintage 90s Levi's 550 relaxed jeans'.",
    },
    item_type: { type: "string", description: "Category, e.g. 'denim jeans', 'wool coat', 'ceramic mug'." },
    brand: {
      type: "string",
      description: "Brand from a visible logo, tag, or label, or the one the user provided. Empty string if unclear.",
    },
    brand_status: { type: "string", enum: BRAND_STATUS },
    material: { type: "string", description: "Main material if visible or inferable, otherwise 'Unknown'." },
    condition: { type: "string", description: "Short condition note, e.g. 'Good: light fading, no visible damage'." },
    resale_low: { type: "number", description: "Low end of the likely sold price in USD." },
    resale_high: { type: "number", description: "High end of the likely sold price in USD." },
    verdict: { type: "string", enum: VERDICTS },
    confidence: { type: "string", enum: CONFIDENCE },
    reason: { type: "string", description: "One or two plain sentences explaining the verdict." },
  },
  required: [
    "item",
    "item_type",
    "brand",
    "brand_status",
    "material",
    "condition",
    "resale_low",
    "resale_high",
    "verdict",
    "confidence",
    "reason",
  ],
  additionalProperties: false,
};

export const SYSTEM_PROMPT = `You are the appraiser inside Worth It?, an app for thrift shoppers and resellers who sell on Depop, Poshmark, and eBay. Someone is standing in a thrift store and has sent you a photo of an item they're thinking about buying. Your job is to tell them, honestly and usefully, whether it's worth buying to resell.

Look at four things before you decide:
1. Item type: what it is, and how much demand that category has on resale apps (for example, vintage denim, workwear, outdoor gear, designer bags, and quality knitwear sell well; plain fast-fashion basics sell slowly).
2. Brand: name a brand only if you can see a logo, tag, or label, or if the user told you the brand. Never guess a brand from style alone. If the user gave a brand, use it unless the photo clearly contradicts it.
3. Condition: visible wear, stains, pilling, fading, damage, or signs it's new or barely used.
4. Material and construction: fabric, leather, wool, solid wood, heavy hardware, quality stitching, and so on. Good materials can make an unbranded item worth flipping.

Then estimate a realistic resale range in US dollars, based on what comparable used items actually sell for on those apps (sold prices, not asking prices). Keep the range reasonably tight and adjust it for the condition you can see.

Then choose a verdict:
- "buy_it": the reseller would likely clear a worthwhile profit after paying for the item and platform fees (roughly 10 to 20 percent of the sale), and the item should sell within a few months. As a rough guide, that's a profit of $10 or more and at least about double what they paid.
- "maybe": the profit could be good but depends on something you can't confirm from the photo (the brand, size, authenticity, or hidden flaws), or the margin is real but modest.
- "skip_it": you have a clear reason it won't pay off, such as the price being too close to the resale value, visible damage that kills the value, or a category with little resale demand.
Don't default to "skip_it." Uncertainty alone is a reason for "maybe," not "skip_it." Plenty of thrift finds are worth buying, so use all three verdicts when the evidence supports them.

If the user tells you what it costs, judge profit against that price. If they don't, assume a typical US thrift store price for this kind of item and mention that assumption briefly in the reason.

Set confidence to:
- "high" when you can clearly identify the item, its brand, and its condition, and comparable items sell at consistent prices.
- "medium" when one important detail is uncertain.
- "low" when several details are uncertain or the photo is hard to read.

If the brand isn't identifiable, set brand to an empty string and brand_status to "unclear", estimate the price for a comparable item without a known brand, and say in the reason that a photo of the tag or the brand name would sharpen the estimate. If the user gave you the brand, set brand_status to "user_provided". If you read it from the item, set it to "identified".

The reason should be one or two short, friendly sentences that name the main factor behind the verdict.

If the photo doesn't show a sellable item or is too blurry to judge, set the resale range to 0 to 0, the verdict to "maybe", confidence to "low", and use the reason to ask for a clearer photo.`;

function userText({ paid, brandHint, hasTagPhoto }) {
  const lines = ["Is this worth buying to resell?"];
  lines.push(
    paid == null
      ? "I didn't say what it costs, so assume a typical thrift store price."
      : `It costs $${paid.toFixed(2)} at the thrift store.`,
  );
  if (brandHint) lines.push(`I think the brand is: ${brandHint}`);
  if (hasTagPhoto) lines.push("The second photo shows the item's tag or label.");
  return lines.join("\n");
}

// images: [{ base64, mediaType }] (first is the item, optional second is the tag).
// paid: number in USD or null. brandHint: string or "".
export async function appraiseItem({ images, paid, brandHint = "" }) {
  const anthropic = getClient();

  const response = await anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: {
      // Medium gives the model room to weigh brand, condition, material, and type before deciding.
      effort: "medium",
      format: { type: "json_schema", schema: SCHEMA },
    },
    // If a safety classifier declines, retry server-side on Anthropic's recommended fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          ...images.map((img) => ({
            type: "image",
            source: { type: "base64", media_type: img.mediaType, data: img.base64 },
          })),
          { type: "text", text: userText({ paid, brandHint, hasTagPhoto: images.length > 1 }) },
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
  if (!data.item || !Number.isFinite(low) || !VERDICTS.includes(data.verdict)) {
    throw new AppraisalError("bad_output", "Response was missing fields.");
  }

  const brand = String(data.brand ?? "").trim();
  return {
    item: String(data.item),
    itemType: String(data.item_type ?? ""),
    brand,
    brandStatus: brand ? (BRAND_STATUS.includes(data.brand_status) ? data.brand_status : "identified") : "unclear",
    material: String(data.material ?? ""),
    condition: String(data.condition ?? ""),
    resaleLow: low,
    resaleHigh: high,
    verdict: data.verdict,
    confidence: CONFIDENCE.includes(data.confidence) ? data.confidence : "medium",
    reason: String(data.reason ?? ""),
  };
}
