import { PostComposer } from "@/components/PostComposer";

export default function ComposePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Compose</h1>
      <PostComposer />
    </div>
  );
}
