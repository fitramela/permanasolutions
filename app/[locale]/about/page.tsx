import HeroAbout from "@/app/components/tentangkami/heroaboutus";
import OurProfile from "@/app/components/tentangkami/ourprofile";
import CompanyProfile from "@/app/components/tentangkami/companyprofile";
import VisionMission from "@/app/components/tentangkami/visionmission";
import TeamSection from "@/app/components/tentangkami/teamsection";

export default function AboutPage() {
  return (
    <>
      <HeroAbout />
      <OurProfile />
      <CompanyProfile />
      <VisionMission />
      <TeamSection />
    </>
  );
}