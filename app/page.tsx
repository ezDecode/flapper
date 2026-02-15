import Link from "next/link";

const pricing = [
  { name: "Free", price: "$0", points: ["10 posts/mo", "5 auto-plugs/mo", "2 connected platforms"] },
  { name: "Pro", price: "$19/mo", points: ["100 posts/mo", "50 auto-plugs/mo", "All 3 platforms"] },
  { name: "Agency", price: "$49/mo", points: ["Unlimited posts", "Unlimited auto-plugs", "1-year analytics"] }
];

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-[var(--line)] bg-white p-8">
        <p className="mb-2 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Auto-plug engine for creators
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight">Post it. Set it. Flapr does the rest.</h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">
          Schedule to Twitter, LinkedIn and Bluesky. Set a like threshold. Flapr auto-replies with your CTA the moment your post
          blows up.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/register" className="rounded bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-dark)]">
            Get started free
          </Link>
          <Link href="/login" className="rounded border border-[var(--line)] px-5 py-2.5 text-sm font-medium hover:bg-slate-50">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-[var(--line)] bg-white p-8 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600">Step 1</p>
          <h2 className="mt-1 text-lg font-semibold">Schedule your post</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Queue once, publish across all selected platforms.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600">Step 2</p>
          <h2 className="mt-1 text-lg font-semibold">Set trigger threshold</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Choose likes, comments, or reposts and trigger value.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-600">Step 3</p>
          <h2 className="mt-1 text-lg font-semibold">Auto-plug fires</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">When metrics hit your threshold, your CTA reply posts automatically.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-white p-8">
        <blockquote className="text-xl font-medium">"Got 4 sales from one scheduled post. Zero effort."</blockquote>
        <p className="mt-2 text-sm text-[var(--muted)]">Founder</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {pricing.map((plan) => (
          <article key={plan.name} className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-2xl">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {plan.points.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
