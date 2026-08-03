import HeroAbout from "@/app/components/tentangkami/heroaboutus";
import CompanySection from "@/app/components/tentangkami/companysection";
import BackgroundCanvas from "@/app/components/tentangkami/BackgroundCanvas";
import OurProfile from "@/app/components/tentangkami/OurProfile"

export default function AboutPage() {
  return (
    <>
      <HeroAbout />
      <CompanySection />
      <BackgroundCanvas/>
      <OurProfile />
    </>
  );
}