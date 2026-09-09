import Resource from "@/app/components/layanan/Resource";

import {
  getCmsClients,
  getCmsPage,
  getCmsTechnologies,
} from "@/app/services/cms";

export default async function ResourcePage({
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
    technologies,
    clients,
  ] = await Promise.all([
    getCmsPage(
      "resource",
      locale
    ),

    getCmsTechnologies(
      locale
    ),

    getCmsClients(
      locale
    ),
  ]);

  const sections =
    page?.sections ?? {};

  return (
    <Resource
      content={
        sections.Resource
      }
      technologies={
        technologies
      }
      clients={
        clients
      }
    />
  );
}