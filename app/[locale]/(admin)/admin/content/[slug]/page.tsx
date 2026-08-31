import { notFound } from "next/navigation";
import ContentEditor from "../../../../../components/admin/ContentEditor";

const valid = ["home", "solutions", "about", "service", "portfolio", "testimonial", "faq", "team", "partners", "contact"];

export default async function Page({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (!valid.includes(slug)) notFound();
  return <ContentEditor slug={slug} adminLocale={locale} />;
}
