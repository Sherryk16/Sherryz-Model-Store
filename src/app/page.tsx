import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeatureProduct";
import { StreetWear } from "@/components/StreetWear";
import { UrduCalligraphy } from "@/components/UrduCalligraphy";
import { CustomDesignHero } from "@/components/CustomDesignHero";

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col gap-0">
        <Hero />
        <FeaturedProducts />
        <StreetWear />
        <UrduCalligraphy />
        <CustomDesignHero />
      </main>
    </div>
  );
}
