"use client";

import PageTransition from "@/app/components/PageTransition";
import { Contact } from "@/app/components/layanan/contact";
import { Client } from "@/app/components/layanan/client";

export default function ServicesPage() {
  return (
    <PageTransition>
      <Contact />
      <Client />
    </PageTransition>
  );
}