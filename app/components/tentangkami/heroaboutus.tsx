"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroAboutUs() {
  const t = useTranslations("About");

  return (
    <section className="relative w-full overflow-hidden bg-white">

      {/* =====================================================
          DESKTOP
          Aktif pada layar lg ke atas
      ===================================================== */}
      <div className="relative hidden h-[1200px] overflow-hidden lg:block">

        {/* -------------------------------------------------
            BACKGROUND DESKTOP
        ------------------------------------------------- */}
        <Image
          src="/images/GGyups.png"
          alt="Solutions Hero"
          fill
          priority
          className="
            object-cover
            select-none
          "
        />

        {/* -------------------------------------------------
            CONTENT DESKTOP
        ------------------------------------------------- */}
        <div
          className="
            relative
            z-20

            mx-auto
            flex
            h-full
            max-w-[1440px]

            items-center

            px-[100px]
          "
        >
          <div
            className="
              relative

              -mt-[435px]
              ml-[-30px]

              max-w-[640px]
            "
          >

            {/* -------------------------------------------------
                TITLE
            ------------------------------------------------- */}
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

            {/* -------------------------------------------------
                DESCRIPTION
            ------------------------------------------------- */}
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

            {/* -------------------------------------------------
                DECORATION LINE
            ------------------------------------------------- */}
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
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET
          Aktif di bawah lg
      ===================================================== */}
      <div
        className="
          relative
          block

          min-h-[970px]

          overflow-hidden

          lg:hidden
        "
      >

        {/* -------------------------------------------------
            BACKGROUND MOBILE
        ------------------------------------------------- */}
        <Image
          src="/images/herohp.png"
          alt="About Permana Solutions"
          fill
          priority
          className="
            object-cover
            object-top

            select-none
          "
        />

        {/* -------------------------------------------------
            CONTENT MOBILE
        ------------------------------------------------- */}
        <div
          className="
            absolute

            left-[6%]
            top-[13%]

            z-20

            w-[400px]
          "
        >

          {/* -------------------------------------------------
              TITLE
          ------------------------------------------------- */}
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

          {/* -------------------------------------------------
              DESCRIPTION
          ------------------------------------------------- */}
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

          {/* -------------------------------------------------
              DECORATION LINE
          ------------------------------------------------- */}
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

              sm:w-[330px]

              select-none
              pointer-events-none
            "
          />
        </div>
      </div>
    </section>
  );
}
