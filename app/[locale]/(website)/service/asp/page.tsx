import ASP from "@/app/components/layanan/ASP";

import {
  getCmsPage,
  getCmsProducts,
} from "@/app/services/cms";

export default async function ASPPage({
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
    products,
  ] = await Promise.all([
    getCmsPage(
      "asp",
      locale
    ),

    getCmsProducts(
      locale
    ),
  ]);

  const sections =
    page?.sections ?? {};

  const aspProducts =
    products.filter(
      (product) =>
        product.service ===
        "asp"
    );

  return (
    <ASP
      content={
        sections.Asp
      }
      products={
        aspProducts
      }
    />
  );
}