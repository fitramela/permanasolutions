import WhoWeAreSection from "@/app/components/beranda/WhoWeAreSection";
import WhyChooseUsSection from "@/app/components/beranda/WhyChooseUsSection";
import SmartSystemShowcaseSection from "@/app/components/beranda/SmartSystemShowcaseSection";
import HomeServiceAndClient from "@/app/components/beranda/ServiceAndClientsSection";
import { ContactFormSection } from "@/app/components/beranda/ContactFormSection";
import HeroBannerSection from "@/app/components/beranda/HeroBannerSection";
import ClientSection from "@/app/components/beranda/ClientSection";
import FloatingLanguage from "@/app/components/FloatingLanguage";


export default function Home() {
  return (
    <>
      <HeroBannerSection />
      <WhoWeAreSection />
      <WhyChooseUsSection />
      <SmartSystemShowcaseSection />
      <HomeServiceAndClient />
      <ContactFormSection />
      <ClientSection />


      <FloatingLanguage />
    </>
  );
}