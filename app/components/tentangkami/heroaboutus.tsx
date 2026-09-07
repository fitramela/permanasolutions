"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroAboutUs() {
  const t = useTranslations("About");

  return (
    <main className="w-full overflow-x-hidden bg-white">

      {/* =====================================================
          HERO DESKTOP
      ===================================================== */}
      <section
        className="
          relative
          hidden
          w-screen
          max-w-none
          overflow-hidden
          lg:block
        "
      >
        {/* BACKGROUND DESKTOP */}
        <img
          src="/images/about-us.png"
          alt="About Permana Solutions"
          className="
            block
            h-auto
            w-full
            max-w-none
            select-none
            pointer-events-none
          "
          draggable={false}
        />

        {/* =================================================
            CONTENT DESKTOP
        ================================================= */}
        <div className="absolute inset-0 z-20">

          {/* ABOUT US + DESCRIPTION + LINE */}
          <div
            className="
              absolute
              left-[5.5%]

              top-[31%]
              -translate-y-1/2

              w-[52%]
              max-w-[900px]
            "
          >
            {/* TITLE */}
            <h1
              className="
                text-[42px]
                font-bold
                leading-none
                text-white

                xl:text-[48px]
                2xl:text-[52px]
              "
            >
              {t("hero.title")}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-6
                max-w-[850px]

                text-[14px]
                leading-[1.5]
                text-white/95

                xl:text-[15px]
                2xl:text-[16px]
              "
            >
              {t("hero.description")}
            </p>

            {/* DECORATION LINE */}
            <Image
              src="/images/Decore.png"
              alt=""
              width={750}
              height={8}
              priority
              className="
                mt-3
                block
                h-auto
                w-[90%]
                max-w-[750px]
                select-none
                pointer-events-none
              "
            />
          </div>

        </div>
      </section>


      {/* =====================================================
          HERO MOBILE / TABLET
      ===================================================== */}
      <section
        className="
          relative
          block
          w-full
          overflow-hidden
          lg:hidden
        "
      >
        {/* BACKGROUND MOBILE */}
        <img
          src="/images/herohp.png"
          alt="About Permana Solutions Mobile"
          className="
            block
            h-auto
            w-full
            max-w-none
            select-none
            pointer-events-none
          "
          draggable={false}
        />

        {/* =================================================
            CONTENT MOBILE / TABLET
        ================================================= */}
        <div
          className="
            absolute
            left-[6%]
            top-[13%]
            z-20
            w-[88%]
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

              sm:max-w-[300px]
              sm:text-[42px]

              md:max-w-[380px]
              md:text-[50px]
            "
          >
            {t("hero.title")}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-2
              max-w-[280px]

              text-[11px]
              leading-[1.5]
              text-white/95

              sm:max-w-[370px]
              sm:text-[13px]

              md:max-w-[470px]
              md:text-[15px]
            "
          >
            {t("hero.description")}
          </p>

          {/* DECORATION LINE */}
          <Image
            src="/images/Decore.png"
            alt=""
            width={500}
            height={8}
            priority
            className="
              mt-4
              h-auto
              w-[280px]

              sm:w-[360px]
              md:w-[460px]

              select-none
              pointer-events-none
            "
          />
        </div>

      </section>

    </main>
  );
}