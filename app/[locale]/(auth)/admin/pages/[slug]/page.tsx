import { notFound } from "next/navigation";
import PageEditor from "@/app/components/admin/PageEditor";
import { pageDefinitions } from "@/app/components/admin/admin-pages";

export default async function Page({ params }:{ params:Promise<{slug:string}> }) {
  const { slug } = await params;
  const definition = pageDefinitions[slug];
  if (!definition) notFound();
  return <PageEditor definition={definition} />;
}
