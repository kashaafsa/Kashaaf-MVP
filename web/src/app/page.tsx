import LandingHero from "@/components/landing/LandingHero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gaming-dark text-white font-sans">
      <main className="flex-grow">
        <LandingHero />
        {/* Placeholder for future sections */}
        <section className="bg-gaming-dark py-20 px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Trending on Kashaaf</h2>
          <p className="text-gray-400">Join the community to see the latest highlights.</p>
        </section>
      </main>
    </div>
  );
}
