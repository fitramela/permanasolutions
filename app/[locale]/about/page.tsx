import HeroAbout from "@/app/components/tentangkami/heroaboutus";
import OurProfile from "@/app/components/tentangkami/ourprofile";
import Company from "@/app/components/tentangkami/company";
import VisionMission from "@/app/components/tentangkami/visionmission";
import Team from "@/app/components/tentangkami/team";

export default function AboutPage() {
  return (
    <>
      <HeroAbout />
      <OurProfile />
      <Company />
      <VisionMission />
      <Team />
    </>
  );
}