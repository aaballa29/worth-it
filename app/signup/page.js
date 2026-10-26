import { redirect } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { signUp } from "../actions/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Sign up — worth it?" };

export default async function SignUpPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="signup" action={signUp} />;
}
