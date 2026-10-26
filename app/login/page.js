import Link from "next/link";
import AuthPlaceholder from "../components/AuthPlaceholder";

export const metadata = { title: "Log in — worth it?" };

export default function LogIn() {
  return (
    <AuthPlaceholder
      title="Log in is coming soon."
      message="Accounts aren't open just yet. We'll be ready for you shortly."
      alt={<>New here? <Link href="/signup">Sign up</Link></>}
    />
  );
}
