import HeroContact from "@/app/components/contactus/HeroContact";
import MapSection from "@/app/components/contactus/MapSection";

import {
  getCmsPage,
} from "@/app/services/cms";

export default async function ContactPage({
  params,
}: {
  params: Promise<{
    locale: string;
  }>;
}) {
  const { locale } =
    await params;

  const page =
    await getCmsPage(
      "contact",
      locale
    );

  const sections =
    page?.sections ?? {};

  return (
    <>
      <HeroContact
        content={
          sections.ContactHero
        }
        locale={
          locale
        }
      />

      <MapSection
        content={
          sections.ContactHero
        }
      />
    </>
  );
}