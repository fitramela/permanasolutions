import Navbar from "@/app/components/layout/NavbarSection";
import { FooterSection } from "@/app/components/layout/FooterSection";
import FloatingLanguageButton from "@/app/components/FloatingLanguage";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="pt-[70px]">
        {children}
      </main>

      <FloatingLanguageButton />

      <FooterSection />
    </>
  );
}