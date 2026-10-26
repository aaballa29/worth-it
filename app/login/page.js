import { redirect } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { logIn } from "../actions/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Log in — worth it?" };

export default async function LogInPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="login" action={logIn} />;
}
