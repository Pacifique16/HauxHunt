import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ExploreCategories } from "@/components/sections/explore-categories/explore-categories";
import { FeaturedListings } from "@/components/sections/featured-listings/featured-listings";
import { Hero } from "@/components/sections/hero/hero";
import { HowItWorks } from "@/components/sections/how-it-works/how-it-works";
import { TrendingLocations } from "@/components/sections/trending-locations/trending-locations";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExploreCategories />
        <TrendingLocations />
        <FeaturedListings />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
