"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroAboutUs() {
  const t = useTranslations("About");

  return (
    <main className="overflow-x-hidden bg-white">

      {/* ================= HERO ================= */}
      <section
        className="
          relative
          h-[600px]
          overflow-hidden
          sm:h-[650px]
          md:h-[720px]
          lg:h-[1200px]
        "
      >

        {/* ================= BACKGROUND DESKTOP ================= */}
        <Image
          src="/images/cchero.png"
          alt="Solutions Hero Desktop"
          fill
          priority
          className="
            hidden
            object-cover
            object-center
            lg:block
            lg:scale-[1.22]
            select-none
          "
        />

        {/* ================= BACKGROUND MOBILE ================= */}
        <Image
          src="/images/herohp.png"
          alt="About Permana Solutions Mobile"
          fill
          priority
          className="
            object-cover
            object-top
            lg:hidden
            select-none
          "
        />

        {/* ================= CONTENT ================= */}
        <div
          className="
            relative
            z-20
            mx-auto
            flex
            h-full
            w-full
            max-w-[1440px]
            items-center
            px-5
            sm:px-6
            lg:px-[100px]
          "
        >

          {/* ================= DESKTOP CONTENT ================= */}
          <div
            className="
              hidden
              max-w-[640px]
              lg:block
              lg:-mt-[435px]
              lg:ml-[-30px]
            "
          >

            {/* TITLE */}
            <h1
              className="
                text-[58px]
                font-bold
                leading-none
                text-white
              "
            >
              {t("hero.title")}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-8
                max-w-[900px]
                text-[15px]
                leading-[20px]
                text-white/95
              "
            >
              {t("hero.description")}
            </p>

            {/* DECORATION */}
            <Image
              src="/images/Decore.png"
              alt="Line Decoration"
              width={750}
              height={8}
              priority
              className="
                mt-3
                h-auto
                w-[750px]
                select-none
                pointer-events-none
              "
            />
          </div>

          {/* ================= MOBILE / TABLET CONTENT ================= */}
          <div
            className="
              absolute
              left-[6%]
              top-[13%]
              z-20
              w-[400px]
              lg:hidden
            "
          >

            {/* TITLE */}
            <h1
              className="
                max-w-[240px]
                text-[34px]
                font-bold
                leading-[1.05]
                tracking-[-0.02em]
                text-white
                sm:max-w-[280px]
                sm:text-[40px]
              "
            >
              {t("hero.title")}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-1
                max-w-[280px]
                text-[11px]
                leading-[1.5]
                text-white/95
                sm:max-w-[350px]
                sm:text-[13px]
              "
            >
              {t("hero.description")}
            </p>

            {/* DECORATION */}
            <Image
              src="/images/Decore.png"
              alt="Line Decoration"
              width={330}
              height={8}
              priority
              className="
                mt-4
                h-auto
                w-[280px]
                select-none
                pointer-events-none
                sm:w-[330px]
              "
            />
          </div>

        </div>
      </section>
    </main>
  );
}
