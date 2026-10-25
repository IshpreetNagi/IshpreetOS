import { loadSiteContent } from "@/server/content/site.loader";

export default async function Home() {
  const site = await loadSiteContent();

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 p-6 sm:p-12">
      <h1 className="text-4xl font-bold tracking-tight">{site.title}</h1>
      <p className="text-xl leading-relaxed">{site.description}</p>
      <p className="leading-relaxed">Under construction. Come back soon.</p>
    </main>
  );
}
