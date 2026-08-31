import HeroAbout from "@/app/components/tentangkami/heroaboutus";
import BackgroundCanvas from "@/app/components/tentangkami/BackgroundCanvas";

import {
  getCmsPage,
  getCmsTeam,
} from "@/app/services/cms";

export default async function AboutPage({
  params,
}: {
  params: Promise<{
    locale: string;
  }>;
}) {
  const { locale } =
    await params;

  const [
    page,
    team,
  ] = await Promise.all([
    getCmsPage(
      "about",
      locale
    ),

    getCmsTeam(
      locale
    ),
  ]);

  const sections =
    page?.sections ?? {};

  const content =
    sections.About;

  return (
    <>
      <HeroAbout
        content={content}
      />

      <BackgroundCanvas
        content={content}
        team={team}
      />
    </>
  );
}