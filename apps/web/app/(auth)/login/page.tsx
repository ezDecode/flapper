import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <section style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </section>
  );
}

