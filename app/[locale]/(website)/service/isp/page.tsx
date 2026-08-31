import ISP from "@/app/components/layanan/ISP";

import { getCmsPage } from "@/app/services/cms";

export default async function ISPPage({
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
      "isp",
      locale
    );

  const sections =
    page?.sections ?? {};

  return (
    <ISP
      content={
        sections.ISP
      }
    />
  );
}