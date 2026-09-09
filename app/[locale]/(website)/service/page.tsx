import PageTransition from "@/app/components/PageTransition";
import { Contact } from "@/app/components/layanan/contact";
import { Client } from "@/app/components/layanan/client";
import {
  getCmsClients,
  getCmsPage,
} from "@/app/services/cms";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [homePage, clients] = await Promise.all([
    getCmsPage("home", locale),
    getCmsClients(locale),
  ]);

  const serviceContent = homePage?.sections?.Service;

  return (
    <PageTransition>
      <Contact content={serviceContent} locale={locale} />
      <Client content={serviceContent} clients={clients} />
    </PageTransition>
  );
}
