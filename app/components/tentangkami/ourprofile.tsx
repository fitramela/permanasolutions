"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function OurProfile() {
  const t = useTranslations("About.profile");

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-16 px-6 lg:flex-row lg:items-end lg:px-20">

        {/* LEFT */}
        <div className="flex-1">

          {/* Badge */}
          <div className="relative inline-flex">

            {/* kotak */}
            <div className="rounded-r-[90px] bg-[#0B618A] px-10 py-8 lg:px-14 lg:py-10">
              <h2 className="font-serif text-4xl font-bold text-white lg:text-6xl">
                {t("title")}
              </h2>
            </div>

            {/* bulatan */}
            <div className="absolute -right-12 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#0B618A] lg:h-36 lg:w-36" />
          </div>

          {/* Deskripsi */}
          <p className="mt-12 max-w-[760px] text-base leading-8 text-[#5F6368] lg:text-lg">
            {t("description")}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center lg:justify-end">

          <div className="rounded-full bg-white px-12 py-7 shadow-[0_12px_35px_rgba(0,0,0,0.15)]">

            <Image
              src="/images/logo-permana.png"
              alt="Permana"
              width={280}
              height={90}
              className="h-auto w-[190px] lg:w-[280px]"
            />

          </div>

        </div>

      </div>
    </section>
  );
}