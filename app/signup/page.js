import Link from "next/link";
import AuthPlaceholder from "../components/AuthPlaceholder";

export const metadata = { title: "Sign up — worth it?" };

export default function SignUp() {
  return (
    <AuthPlaceholder
      title="Sign-ups open soon."
      message="We're putting the finishing touches on accounts. Check back shortly to start scanning your finds for free."
      alt={<>Already have an account? <Link href="/login">Log in</Link></>}
    />
  );
}
