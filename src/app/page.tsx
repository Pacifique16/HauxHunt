import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero/hero";

export default function Home() {
  return (
    <>
      <Navbar waitlistOnly />
      <main>
        <Hero />
      </main>
    </>
  );
}
