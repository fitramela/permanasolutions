"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { teamData, TeamMember } from "./teamdata";

/* =========================================================
   ABOUT CONTENT
========================================================= */

export default function AboutContent() {
  const t = useTranslations("About");

  /* =========================================================
     EMBLA
  ========================================================= */

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "keepSnaps",
    dragFree: false,
    loop: false,
    skipSnaps: false,
    duration: 25,
  });

  /* =========================================================
     CAROUSEL STATE
  ========================================================= */

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /* =========================================================
     UPDATE CAROUSEL
  ========================================================= */

  const updateCarouselState = useCallback(() => {
    if (!emblaApi) return;

    const progress = emblaApi.scrollProgress();
    const EDGE_THRESHOLD = 0.01;

    const isAtStart = progress <= EDGE_THRESHOLD;
    const isAtEnd = progress >= 1 - EDGE_THRESHOLD;

    setCanScrollPrev(!isAtStart);
    setCanScrollNext(!isAtEnd);

    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  /* =========================================================
     EMBLA EVENTS
  ========================================================= */

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      requestAnimationFrame(updateCarouselState);
    };

    update();

    emblaApi.on("scroll", update);
    emblaApi.on("select", update);
    emblaApi.on("settle", update);
    emblaApi.on("reInit", update);
    emblaApi.on("pointerUp", update);

    return () => {
      emblaApi.off("scroll", update);
      emblaApi.off("select", update);
      emblaApi.off("settle", update);
      emblaApi.off("reInit", update);
      emblaApi.off("pointerUp", update);
    };
  }, [emblaApi, updateCarouselState]);

  /* =========================================================
     MISSIONS
  ========================================================= */

  const missions = t.raw(
    "visionMission.missions"
  ) as string[];

  return (
    <section
      id="company"
      className="
        relative
        z-30
        overflow-hidden

        -mt-[120px]

        sm:-mt-[180px]
        md:-mt-[250px]
        lg:-mt-[310px]
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <Image
          src="/images/bgkiri2permana.png"
          alt=""
          width={920}
          height={1200}
          className="
            absolute

            left-[-70px]
            top-[290px]
            w-[360px]

            sm:left-[-120px]
            sm:top-[80px]
            sm:w-[330px]

            md:left-[-90px]
            md:w-[350px]

            lg:left-0
            lg:top-[110px]
            lg:w-[370px]

            h-auto
            select-none
          "
        />

        <Image
          src="/images/imageg.png"
          alt=""
          width={380}
          height={380}
          className="
            absolute

            left-[-120px]
            top-[1350px]
            w-[330px]

            sm:left-[-100px]
            sm:top-[1150px]
            sm:w-[380px]

            md:left-[-80px]
            md:w-[410px]

            lg:left-[-50px]
            lg:top-[850px]
            lg:w-[450px]

            h-auto
            opacity-70
            select-none
          "
        />

        <div
          className="
            absolute

            right-[-180px]
            bottom-[180px]

            h-[280px]
            w-[280px]

            rounded-full
            bg-cyan-200/20
            blur-[130px]

            sm:right-[-170px]
            sm:h-[330px]
            sm:w-[330px]

            lg:right-[-150px]
            lg:bottom-[220px]
            lg:h-[420px]
            lg:w-[420px]
            lg:blur-[170px]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1440px]

          px-5

          sm:px-7

          md:px-[40px]

          lg:px-[70px]

          xl:px-[100px]
        "
      >
        {/* ===================================================
            OUR PROFILE
        =================================================== */}

        <section
          className="
            relative

            pt-[200px]
            pb-[70px]

            sm:pt-[100px]
            sm:pb-[90px]

            md:pt-[110px]
            md:pb-[110px]

            lg:pt-[120px]
            lg:pb-[140px]
          "
        >
          <div
            className="
              relative

              h-[60px]

              sm:h-[95px]

              md:h-[105px]

              lg:h-[120px]
            "
          >
            <Image
              src="/images/ourteks.png"
              alt=""
              width={850}
              height={160}
              priority
              className="
                absolute

                left-[-180px]
                top-[-40px]
                w-[500px]

                sm:left-[-230px]
                sm:top-[-50px]
                sm:w-[590px]

                md:left-[-320px]
                md:w-[680px]

                lg:left-[-580px]
                lg:top-[-90px]
                lg:w-[840px]

                h-auto

                select-none
                pointer-events-none
              "
            />

            <h2
              className="
                absolute

                left-[7px]
                top-[-18px]

                text-white
                font-bold
                font-serif
                leading-none

                text-[17px]

                sm:text-[30px]
                md:text-[32px]

                lg:left-[-25px]
                lg:top-[-25px]
                lg:text-[32px]
              "
            >
              {t("ourProfile.title")}
            </h2>
          </div>

          <div
            className="
              mt-[5px]

              lg:mt-[-30px]

              flex
              justify-center
            "
          >
            <p
              className="
                relative
                left-0

                w-full
                max-w-[100%]

                text-left

                text-[14px]
                leading-[1.7]

                text-[#555555]

                sm:text-[15px]
                sm:leading-[1.65]

                md:max-w-[850px]
                md:text-[17px]

                lg:left-[-39px]
                lg:max-w-[1120px]
                lg:text-[19px]
                lg:leading-[1.35]
                lg:tracking-[0.01em]
              "
            >
              {t("ourProfile.description")}
            </p>
          </div>
        </section>

        {/* ===================================================
            COMPANY
        =================================================== */}

        <section
          className="
            relative

            py-[65px]

            sm:py-[80px]

            md:py-[95px]

            lg:py-[100px]
          "
        >
          <div
            className="
              relative

              lg:-mt-[60px]
            "
          >
            <Image
              src="/images/pErmana.png"
              alt="Permana Solutions"
              width={520}
              height={220}
              priority
              className="
                absolute

                right-[-20px]
                top-[-120px]
                w-[170px]

                sm:right-[-55px]
                sm:top-[-75px]
                sm:w-[210px]

                md:right-[-65px]
                md:top-[-85px]
                md:w-[260px]

                lg:right-[-120px]
                lg:top-[-139px]
                lg:w-[330px]

                h-auto
                select-none
              "
            />

            <div
              className="
                ml-0

                lg:ml-[-25px]
              "
            >
              <h2
                className="
                  max-w-[330px]

                  text-[27px]
                  leading-[1.15]

                  text-[#005D86]
                  font-bold

                  sm:max-w-[450px]
                  sm:text-[30px]

                  md:max-w-[550px]
                  md:text-[33px]

                  lg:max-w-[620px]
                  lg:text-[35px]
                  lg:leading-[1.05]
                "
              >
                {t("company.title")}
              </h2>

              <p
                className="
                  mt-[15px]

                  max-w-full

                  text-[14px]
                  leading-[1.7]

                  tracking-[0.01em]

                  text-[#5C5C5C]

                  sm:text-[15px]

                  md:text-[17px]

                  lg:mt-[14px]
                  lg:max-w-[1300px]
                  lg:text-[18px]
                  lg:leading-[27px]
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

            py-[85px]

            sm:py-[105px]

            md:py-[125px]

            lg:py-[170px]
          "
        >
          <Image
            src="/images/visimisits.png"
            alt=""
            width={1800}
            height={450}
            priority
            className="
              absolute

              left-[-43px]
              top-[50px]
              w-[290px]

              sm:left-[-205px]
              sm:w-[480px]

              md:left-[-235px]
              md:w-[550px]

              lg:left-[-270px]
              lg:top-[5px]
              lg:w-[630px]

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
              w-full

              lg:max-w-[1320px]

              lg:grid
              lg:grid-cols-[330px_1fr]
              lg:gap-x-[90px]
              lg:items-start
            "
          >
            <div
              className="
                relative

                mb-[50px]

                lg:h-[170px]
                lg:mb-0
              "
            >
              <h2
                className="
                  relative

                  left-[10px]
                  -top-[15px]

                  text-[25px]
                  leading-[1.1]

                  text-[#005D86]
                  font-bold

                  sm:text-[34px]

                  md:text-[38px]

                  lg:absolute
                  lg:left-[-40px]
                  lg:top-[-110px]
                  lg:text-[40px]
                  lg:leading-[1.05]
                "
              >
                {t("visionMission.title")}
              </h2>
            </div>

            <div
              className="
                mt-0

                lg:mt-[-140px]
              "
            >
              <h2
                className="
                  text-[25px]
                  leading-none

                  text-[#005D86]
                  font-bold

                  sm:text-[32px]

                  md:text-[36px]

                  lg:text-[40px]
                "
              >
                {t("visionMission.visionTitle")}
              </h2>

              <p
                className="
                  mt-4

                  max-w-full

                  text-[14px]
                  leading-[1.75]

                  text-[#5C5C5C]

                  sm:text-[15px]

                  md:text-[17px]

                  lg:mt-5
                  lg:max-w-[760px]
                  lg:text-[17px]
                  lg:leading-[28px]
                "
              >
                {t("visionMission.visionDescription")}
              </p>

              <h2
                className="
                  mt-[35px]

                  text-[25px]
                  leading-none

                  text-[#005D86]
                  font-bold

                  sm:mt-[40px]
                  sm:text-[32px]

                  md:text-[36px]

                  lg:text-[40px]
                "
              >
                {t("visionMission.missionTitle")}
              </h2>

              <ol
                className="
                  mt-5

                  pl-6

                  max-w-full

                  list-decimal

                  space-y-4

                  text-[14px]
                  leading-[1.7]

                  text-[#5C5C5C]

                  sm:text-[15px]

                  md:text-[17px]
                  md:leading-[28px]

                  lg:mt-6
                  lg:max-w-[820px]
                  lg:space-y-5
                  lg:pl-7
                  lg:text-[17px]
                  lg:leading-[28px]
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

            mt-0

            pb-8

            sm:pb-10

            md:pb-12

            lg:-mt-24
          "
        >
          <div
            className="
              mx-auto
              w-full

              px-0

              sm:px-4

              md:px-10

              flex
              flex-col
              items-center
              text-center
            "
          >
            <h2
              className="
                font-bold
                text-[#005D86]

                text-[16px]

                sm:text-[30px]

                md:text-[34px]

                lg:text-[40px]

                leading-tight
              "
            >
              {t("team.title")}
            </h2>

            <h3
              className="
                mt-2

                font-bold
                text-[#005D86]

                text-[16px]

                sm:text-[32px]

                md:text-[38px]

                lg:text-[44px]

                leading-tight
              "
            >
              {t("team.subtitle")}
            </h3>

            <p
              className="
                mt-1

                w-full
                max-w-[640px]

                text-[#666666]

                text-[9px]
                leading-[1]

                sm:max-w-[500px]
                sm:text-[14px]

                md:max-w-[800px]
                md:text-[15px]

                lg:mt-[-5px]
                lg:max-w-none
                lg:text-[15px]
                lg:leading-7
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
      ===================================================== */}

      <section
        className="
          relative
          w-full

          mt-[-20px]

          sm:mt-[25px]

          md:mt-[30px]

          lg:mt-[-40px]

          overflow-visible
        "
      >
        <div
          className="
            relative
            w-full

            h-[510px]

            sm:h-[560px]

            md:h-[580px]

            lg:h-[591px]

            bg-[#F3F3F3]

            overflow-hidden
          "
        >
          {/* DOT LEFT */}

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

          {/* DOT RIGHT */}

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

          <div className="relative z-10 h-full w-full">

            {/* =================================================
                LEFT ARROW
            ================================================= */}

            {canScrollPrev && (
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Scroll left"
                className="
                  absolute

                  left-[8px]
                  top-[300px]

                  z-30

                  flex
                  h-10
                  w-10

                  -translate-y-1/2

                  items-center
                  justify-center

                  rounded-full

                  bg-white/90

                  shadow-xl

                  backdrop-blur-sm

                  transition-all
                  duration-200

                  hover:scale-110
                  active:scale-95

                  sm:left-[-5px]
                  sm:top-[330px]
                  sm:h-12
                  sm:w-12

                  md:left-[-10px]
                  md:top-[345px]

                  lg:left-6
                  lg:top-[360px]
                "
              >
                <ChevronLeft
                  size={24}
                  strokeWidth={2.5}
                  className="
                    text-[#04BCBC]/70

                    sm:size-[28px]
                  "
                />
              </button>
            )}

            {/* =================================================
                RIGHT ARROW
            ================================================= */}

            {canScrollNext && (
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Scroll right"
                className="
                  absolute

                  right-[8px]
                  top-[300px]

                  z-30

                  flex
                  h-10
                  w-10

                  -translate-y-1/2

                  items-center
                  justify-center

                  rounded-full

                  bg-white/90

                  shadow-xl

                  backdrop-blur-sm

                  transition-all
                  duration-200

                  hover:scale-110
                  active:scale-95

                  sm:right-[-5px]
                  sm:top-[330px]
                  sm:h-12
                  sm:w-12

                  md:right-[-10px]
                  md:top-[345px]

                  lg:right-6
                  lg:top-[360px]
                "
              >
                <ChevronRight
                  size={24}
                  strokeWidth={2.5}
                  className="
                    text-[#04BCBC]/70

                    sm:size-[28px]
                  "
                />
              </button>
            )}

            {/* =================================================
                EMBLA VIEWPORT
            ================================================= */}

            <div
              ref={emblaRef}
              className="
                h-full
                w-full

                overflow-hidden

                cursor-grab
                active:cursor-grabbing

                touch-pan-y

                select-none

                will-change-transform
              "
            >
              <div
                className="
                  flex
                  items-start

                  h-full

                  gap-0

                  sm:gap-[15px]

                  pt-[110px]

                  sm:pt-[105px]

                  md:pt-[110px]

                  lg:pt-[120px]

                  lg:pl-[50px]

                  xl:pl-[25px]
                "
              >
                {/* =================================================
                    TEAM CARDS
                ================================================= */}

                {teamData.map((member, index) => (
                  <div
                    key={member.id}
                    className="
                      flex
                      flex-[0_0_100%]

                      justify-center

                      select-none
                      translate-y-[15px]

                      sm:flex-[0_0_300px]

                      lg:translate-y-[25px]
                    "
                  >
                    <TeamCard
                      member={member}
                      index={index}
                      isActive={index === activeIndex}
                    />
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
  index: number;
  isActive: boolean;
}

function TeamCard({
  member,
  index,
  isActive,
}: TeamCardProps) {
  const t = useTranslations("Team");

  const CARD_CONFIG = {
    width: 300,
    height: 340,

    photoSize: 200,
    photoTop: -98,

    positionTop: 93,
    positionHeight: 22,
    positionMinWidth: 105,
    positionMaxWidth: 190,
    positionFontSize: 11,

    nameTop: 10,
    nameWidth: 250,
    nameFontSize: 15,
    nameLineHeight: 22,

    descriptionTop: 200,
    descriptionWidth: 255,
    descriptionFontSize: 14,
    descriptionLineHeight: 19,
  };

  const cardRadius =
    index === 0
      ? `
        rounded-tl-[32px]
        rounded-tr-[8px]
        rounded-bl-[8px]
        rounded-br-[50px]
      `
      : `
        rounded-tl-[28px]
        rounded-tr-[8px]
        rounded-bl-[8px]
        rounded-br-[50px]
      `;

  return (
    <article
      className={`
        group
        relative

        flex
        flex-col
        items-center

        overflow-visible

        border
        border-white/70

        backdrop-blur-[2px]

        transition-all
        duration-500
        ease-out

        ${
          isActive
            ? `
              bg-white
              border-white

              shadow-[0_12px_35px_rgba(255,255,255,0.90)]

              -translate-y-[8px]

              sm:bg-white/35
              sm:border-white/70
              sm:shadow-[0_4px_20px_rgba(255,255,255,0.30)]
              sm:translate-y-0
            `
            : `
              bg-white/35
              shadow-[0_4px_20px_rgba(255,255,255,0.30)]
            `
        }

        hover:bg-white
        hover:border-white
        hover:shadow-[0_10px_35px_rgba(255,255,255,0.85)]
        hover:-translate-y-1

        ${cardRadius}
      `}
      style={{
        width: `${CARD_CONFIG.width}px`,
        height: `${CARD_CONFIG.height}px`,
      }}
    >
      {/* FOTO */}

      <div
        className="
          absolute
          left-1/2
          -translate-x-1/2

          rounded-full
          overflow-hidden

          bg-white

          border-[2px]
          border-white

          shadow-[0_7px_20px_rgba(255,255,255,0.55)]

          z-20
        "
        style={{
          width: `${CARD_CONFIG.photoSize}px`,
          height: `${CARD_CONFIG.photoSize}px`,
          top: `${CARD_CONFIG.photoTop}px`,
        }}
      >
        <Image
          src={member.image}
          alt={t(member.nameKey)}
          fill
          className="object-cover"
          sizes={`${CARD_CONFIG.photoSize}px`}
          draggable={false}
        />
      </div>

      {/* JABATAN */}

      <div
        className="
          relative
          z-30

          px-4

          rounded-full

          bg-[#04BCBC]

          flex
          items-center
          justify-center

          shadow-[0_5px_14px_rgba(4,188,188,0.25)]
        "
        style={{
          marginTop: `${CARD_CONFIG.positionTop}px`,
          height: `${CARD_CONFIG.positionHeight}px`,
          minWidth: `${CARD_CONFIG.positionMinWidth}px`,
          maxWidth: `${CARD_CONFIG.positionMaxWidth}px`,
        }}
      >
        <span
          className="
            whitespace-nowrap

            text-white
            font-semibold
            leading-none
          "
          style={{
            fontSize: `${CARD_CONFIG.positionFontSize}px`,
          }}
        >
          {t(member.positionKey)}
        </span>
      </div>

      {/* NAMA */}

      <h3
        className="
          text-center

          text-[#101A24]

          font-bold
          font-['David_Libre']
        "
        style={{
          marginTop: `${CARD_CONFIG.nameTop}px`,
          width: `${CARD_CONFIG.nameWidth}px`,
          fontSize: `${CARD_CONFIG.nameFontSize}px`,
          lineHeight: `${CARD_CONFIG.nameLineHeight}px`,
        }}
      >
        {t(member.nameKey)}
      </h3>

      {/* DESKRIPSI */}

      <p
        className="
          absolute

          left-1/2
          -translate-x-1/2

          text-center

          text-[#5C6574]

          font-normal
        "
        style={{
          top: `${CARD_CONFIG.descriptionTop}px`,
          width: `${CARD_CONFIG.descriptionWidth}px`,
          fontSize: `${CARD_CONFIG.descriptionFontSize}px`,
          lineHeight: `${CARD_CONFIG.descriptionLineHeight}px`,
        }}
      >
        {t(member.descriptionKey)}
      </p>
    </article>
  );
}

/* =========================================================
   DOT PATTERN
========================================================= */

interface DotPatternProps {
  className?: string;
}

function DotPattern({
  className = "",
}: DotPatternProps) {
  const dots = Array.from({
    length: 100,
  });

  return (
    <div
      className={`
        grid
        grid-cols-10
        gap-[14px]

        opacity-20

        pointer-events-none
        select-none

        ${className}
      `}
    >
      {dots.map((_, index) => (
        <span
          key={index}
          className="
            h-[4px]
            w-[4px]

            rounded-full

            bg-[#AFC6D4]
          "
        />
      ))}
    </div>
  );
}
