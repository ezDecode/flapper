import { DesignSystemProvider } from "@/components/DesignSystemProvider";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <DesignSystemProvider>{children}</DesignSystemProvider>;
}
