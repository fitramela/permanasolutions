import "../globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Poppins } from "next/font/google";
import { locales } from "@/i18n";

import Navbar from "@/app/components/layout/NavbarSection";
import { FooterSection } from "@/app/components/layout/FooterSection";
import FloatingLanguageButton from "@/app/components/FloatingLanguage"; // tambah ini

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />

          <main>{children}</main>

          <FloatingLanguageButton /> {/* Tambahkan di sini */}

          <FooterSection />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}