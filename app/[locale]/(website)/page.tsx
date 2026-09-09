import WhoWeAreSection from "@/app/components/beranda/WhoWeAreSection";
import WhyChooseUsSection from "@/app/components/beranda/WhyChooseUsSection";
import SmartSystemShowcaseSection from "@/app/components/beranda/SmartSystemShowcaseSection";
import HomeServiceAndClient from "@/app/components/beranda/ServiceAndClientsSection";
import { ContactFormSection } from "@/app/components/beranda/ContactFormSection";
import HeroBannerSection from "@/app/components/beranda/HeroBannerSection";
import ClientSection from "@/app/components/beranda/ClientSection";
import FloatingLanguage from "@/app/components/FloatingLanguage";
import PageTransition from "@/app/components/PageTransition";

import {
  getCmsClients,
  getCmsPage,
} from "@/app/services/cms";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [page, clients] = await Promise.all([
    getCmsPage("home", locale),
    getCmsClients(locale),
  ]);

  const sections = page?.sections ?? {};

  return (
    <PageTransition>
      <HeroBannerSection content={sections.Hero} />
      <WhoWeAreSection content={sections.WhoWeAre} />
      <WhyChooseUsSection content={sections.WhyChooseUs} />
      <SmartSystemShowcaseSection
        content={sections.SmartSystemShowcase}
      />
      <HomeServiceAndClient content={sections.SmartSystem} />
      <ContactFormSection content={sections.Service} />
      <ClientSection
        content={sections.Client}
        clients={clients}
      />

      <FloatingLanguage />
    </PageTransition>
  );
}
