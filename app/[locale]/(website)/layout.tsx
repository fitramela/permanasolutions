'use client';

import Navbar from "@/app/components/layout/NavbarSection";
import { FooterSection } from "@/app/components/layout/FooterSection";
import FloatingLanguageButton from "@/app/components/FloatingLanguage";
import TrackingProvider from "@/app/components/TrackingProvider";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <TrackingProvider />  
      <main className="pt-[70px]">
        {children}
      </main>

      <FloatingLanguageButton />

      <FooterSection />
    </>
  );
}