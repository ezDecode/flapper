import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <section style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <SignUp routing="path" path="/register" signInUrl="/login" />
    </section>
  );
}

