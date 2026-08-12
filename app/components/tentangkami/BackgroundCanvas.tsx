"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { teamData, TeamMember } from "./aboutData";

/* =========================================================
   ABOUT CONTENT
   Our Profile
   Company
   Vision & Mission
   Meet Team
   Team Section
========================================================= */

export default function AboutContent() {
  const t = useTranslations("About");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    dragFree: true,
    loop: false,
  });

  const missions = t.raw("visionMission.missions") as string[];

  return (
    <section
      id="company"
      className="
        relative
        overflow-hidden
        -mt-[310px]
        z-30
      "
    >
      {/* =====================================================
          BACKGROUND CANVAS
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          overflow-hidden
          pointer-events-none
        "
      >
        {/* Background kiri */}

        <Image
          src="/images/bgkiri2permana.png"
          alt=""
          width={320}
          height={1200}
          className="
            absolute
            left-0
            top-[110px]
            w-[370px]
            h-auto
            select-none
          "
        />

        {/* Dot Pattern background */}

        <Image
          src="/images/imageg.png"
          alt=""
          width={380}
          height={380}
          className="
            absolute
            left-[-50px]
            top-[850px]
            w-[450px]
            h-auto
            opacity-70
          "
        />

        {/* Glow bawah */}

        <div
          className="
            absolute
            right-[-150px]
            bottom-[220px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-cyan-200/20
            blur-[170px]
          "
        />
      </div>

      {/* =====================================================
          CONTENT CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1440px]
          px-[100px]
          xl:px-[100px]
          lg:px-[70px]
          md:px-[40px]
          sm:px-6
        "
      >
        {/* ===================================================
            OUR PROFILE
        =================================================== */}

        <section
          className="
            relative
            pt-[120px]
            pb-[140px]
          "
        >
          {/* Ribbon */}

          <div className="relative h-[120px]">
            <Image
              src="/images/ourteks.png"
              alt=""
              width={850}
              height={160}
              priority
              className="
                absolute
                left-[-580px]
                top-[-90px]
                w-[840px]
                h-auto
                select-none
                pointer-events-none
              "
            />

            <h2
              className="
                absolute
                left-[-25px]
                top-[-25px]
                text-white
                text-[32px]
                font-bold
                font-serif
                leading-none
              "
            >
              {t("ourProfile.title")}
            </h2>
          </div>

          {/* Description */}

          <div
            className="
              mt-[-30px]
              flex
              justify-center
            "
          >
            <p
              className="
                relative
                left-[-39px]
                w-full
                max-w-[1120px]
                text-left
                text-[19px]
                font-normal
                leading-[1.35]
                tracking-[0.01em]
                text-[#555555]
              "
            >
              {t("ourProfile.description")}
            </p>
          </div>
        </section>

        {/* ===================================================
            COMPANY / PERMANA SOLUTIONS
        =================================================== */}

        <section
          className="
            relative
            py-[100px]
          "
        >
          <div className="relative -mt-[60px]">
            {/* Logo kanan */}

            <Image
              src="/images/pErmana.png"
              alt="Permana Solutions"
              width={520}
              height={220}
              priority
              className="
                absolute
                right-[-120px]
                top-[-139px]
                w-[330px]
                h-auto
                select-none
              "
            />

            <div className="ml-[-25px]">
              {/* Title */}

              <h2
                className="
                  max-w-[620px]
                  text-[35px]
                  font-bold
                  leading-[1.05]
                  text-[#005D86]
                "
              >
                {t("company.title")}
              </h2>

              {/* Description */}

              <p
                className="
                  mt-[14px]
                  max-w-[1300px]
                  text-[18px]
                  leading-[27px]
                  tracking-[0.01em]
                  text-[#5C5C5C]
                "
              >
                {t("company.description")}
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            VISION & MISSION
        =================================================== */}

        <section
          className="
            relative
            overflow-visible
            py-[170px]
          "
        >
          {/* Background Ribbon */}

          <Image
            src="/images/visimisits.png"
            alt=""
            width={1800}
            height={450}
            priority
            className="
              absolute
              left-[-270px]
              top-[5px]
              w-[630px]
              h-auto
              pointer-events-none
              select-none
            "
          />

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-[1320px]
              grid
              grid-cols-[330px_1fr]
              gap-x-[90px]
              items-start
            "
          >
            {/* LEFT */}

            <div className="relative h-[170px]">
              <h2
                className="
                  absolute
                  left-[-40px]
                  top-[-110px]
                  text-[40px]
                  font-bold
                  leading-[1.05]
                  text-[#005D86]
                "
              >
                {t("visionMission.title")}
              </h2>
            </div>

            {/* RIGHT */}

            <div className="mt-[-140px]">
              {/* Vision */}

              <h2
                className="
                  text-[40px]
                  font-bold
                  leading-none
                  text-[#005D86]
                "
              >
                {t("visionMission.visionTitle")}
              </h2>

              <p
                className="
                  mt-5
                  max-w-[760px]
                  text-[17px]
                  leading-[28px]
                  text-[#5C5C5C]
                "
              >
                {t("visionMission.visionDescription")}
              </p>

              {/* Mission */}

              <h2
                className="
                  mt-[40px]
                  text-[40px]
                  font-bold
                  leading-none
                  text-[#005D86]
                "
              >
                {t("visionMission.missionTitle")}
              </h2>

              <ol
                className="
                  mt-6
                  pl-7
                  max-w-[820px]
                  list-decimal
                  space-y-5
                  text-[17px]
                  leading-[28px]
                  text-[#5C5C5C]
                "
              >
                {missions.map((mission, index) => (
                  <li key={index}>{mission}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ===================================================
            MEET TEAM
        =================================================== */}

        <section
          className="
            relative
            z-20
            w-full
            -mt-10
            md:-mt-16
            lg:-mt-24
            pb-8
            md:pb-12
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1200px]
              px-6
              md:px-10
              flex
              flex-col
              items-center
              text-center
            "
          >
            {/* Title */}

            <h2
              className="
                font-bold
                text-[#005D86]
                text-[28px]
                sm:text-[34px]
                lg:text-[40px]
                leading-tight
              "
            >
              {t("team.title")}
            </h2>

            {/* Subtitle */}

            <h3
              className="
                mt-2
                font-bold
                text-[#005D86]
                text-[30px]
                sm:text-[38px]
                lg:text-[44px]
                leading-tight
              "
            >
              {t("team.subtitle")}
            </h3>

      <p
  className="
    mt-[-5px]
    w-full
    max-w-none
    text-[#666666]
    text-[14px]
    md:text-[15px]
    lg:text-[15px]
    leading-7
    lg:whitespace-nowrap
  "
>
  {t("team.description")}
</p>
          </div>
        </section>
      </div>

      {/* =====================================================
          TEAM CAROUSEL
          Tetap full width seperti sebelumnya
      ===================================================== */}

      <section
        className="
          relative
          w-full
          -top-[35px]
          overflow-hidden
        "
      >
        <div
          className="
            relative
            max-w-full
            h-[591px]
            bg-[#F3F3F3]
            overflow-hidden
          "
        >
          {/* Pattern kiri */}

          <DotPattern
            className="
              absolute
              hidden
              lg:block
              left-10
              top-40
              z-0
            "
          />

          {/* Pattern kanan */}

          <DotPattern
            className="
              absolute
              hidden
              lg:block
              right-10
              bottom-20
              rotate-180
              z-0
            "
          />

          <div className="relative w-full z-10">
            {/* Arrow kiri */}

            <ArrowButton
              direction="left"
              onClick={() => emblaApi?.scrollPrev()}
              className="
                absolute
                left-2
                md:left-4
                lg:left-6
                top-[320px]
                lg:top-[360px]
                -translate-y-1/2
                z-30
              "
            />

            {/* Arrow kanan */}

            <ArrowButton
              direction="right"
              onClick={() => emblaApi?.scrollNext()}
              className="
                absolute
                right-2
                md:right-4
                lg:right-6
                top-[320px]
                lg:top-[360px]
                -translate-y-1/2
                z-30
              "
            />

            {/* Embla */}

            <div
              ref={emblaRef}
              className="
                overflow-hidden
                cursor-grab
                active:cursor-grabbing
              "
            >
              <div
                className="
                  flex
                  gap-6
                  lg:gap-[20px]
                  items-start
                  pt-[110px]
                  pb-5
                "
              >
                {teamData.map((member) => (
                  <div
                    key={member.id}
                    className="
                      flex-[0_0_320px]
                      select-none
                      translate-y-[10px]
                    "
                  >
                    <TeamCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

/* =========================================================
   TEAM CARD
========================================================= */

interface TeamCardProps {
  member: TeamMember;
}

function TeamCard({ member }: TeamCardProps) {
  const t = useTranslations("Team");

  return (
    <article
      className="
        relative
        w-[320px]
        h-[400px]
        rounded-[26px]
        bg-white
        border
        border-white/80
        shadow-[0_12px_45px_rgba(0,0,0,0.08)]
        flex
        flex-col
        items-center
        overflow-visible
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-[0_22px_60px_rgba(0,0,0,.12)]
      "
    >
      {/* FOTO */}

      <div
        className="
          absolute
          left-1/2
          -translate-x-1/2
          -top-[100px]
          w-[200px]
          h-[200px]
          rounded-full
          overflow-hidden
          bg-white
          border-[3px]
          border-[#F4F4F4]
          shadow-[0_12px_35px_rgba(0,0,0,.16)]
        "
      >
        <Image
          src={member.image}
          alt={t(member.nameKey)}
          fill
          className="object-cover"
          sizes="200px"
        />
      </div>

      {/* BADGE */}

      <div
        className="
          mt-[122px]
          w-[160px]
          h-[32px]
          rounded-full
          bg-[#04BCBC]
          flex
          items-center
          justify-center
          shadow-[0_6px_15px_rgba(4,188,188,.28)]
        "
      >
        <span
          className="
            text-white
            text-[11px]
            font-semibold
            tracking-[0.2px]
          "
        >
          {t(member.positionKey)}
        </span>
      </div>

      {/* NAMA */}

      <h3
        className="
          mt-[16px]
          w-[250px]
          text-center
          text-[#101A24]
          text-[20px]
          leading-[26px]
          font-bold
          font-['David_Libre']
        "
      >
        {t(member.nameKey)}
      </h3>

      {/* DESKRIPSI */}

      <p
        className="
          mt-[28px]
          w-[250px]
          text-center
          text-[#5C6574]
          text-[15px]
          leading-[26px]
          font-normal
        "
      >
        {t(member.descriptionKey)}
      </p>
    </article>
  );
}

/* =========================================================
   ARROW BUTTON
========================================================= */

interface ArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}

function ArrowButton({
  direction,
  onClick,
  className = "",
}: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`
        flex
        items-center
        justify-center
        w-[64px]
        h-[64px]
        rounded-full
        bg-white
        shadow-[0_15px_35px_rgba(0,0,0,.12)]
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-[0_20px_40px_rgba(0,0,0,.18)]
        ${className}
      `}
    >
      {direction === "left" ? (
        <ChevronLeft
          size={26}
          strokeWidth={2.5}
          className="text-[#0F172A]"
        />
      ) : (
        <ChevronRight
          size={26}
          strokeWidth={2.5}
          className="text-[#0F172A]"
        />
      )}
    </button>
  );
}

/* =========================================================
   DOT PATTERN
========================================================= */

interface DotPatternProps {
  className?: string;
}

function DotPattern({ className = "" }: DotPatternProps) {
  const dots = Array.from({ length: 100 });

  return (
    <>
      {/* LEFT */}

      <div
        className={`
          absolute
          left-[-60px]
          top-[150px]
          grid
          grid-cols-10
          gap-[14px]
          opacity-20
          pointer-events-none
          select-none
          ${className}
        `}
      >
        {dots.map((_, i) => (
          <span
            key={i}
            className="
              h-[4px]
              w-[4px]
              rounded-full
              bg-[#AFC6D4]
            "
          />
        ))}
      </div>

      {/* RIGHT */}

      <div
        className={`
          absolute
          right-[-60px]
          bottom-[120px]
          grid
          grid-cols-10
          gap-[14px]
          opacity-20
          pointer-events-none
          select-none
          ${className}
        `}
      >
        {dots.map((_, i) => (
          <span
            key={i}
            className="
              h-[4px]
              w-[4px]
              rounded-full
              bg-[#AFC6D4]
            "
          />
        ))}
      </div>
    </>
  );
}
