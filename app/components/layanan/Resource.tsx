"use client";

import {
  useRef,
  useState,
} from "react";

import Image from "next/image";

import type {
  CmsClient,
  CmsSectionContent,
  CmsTechnology,
} from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
  technologies?: CmsTechnology[];
  clients?: CmsClient[];
};

type StandOutCard = {
  image: string;
  title: string;
  desc: string;
};

function text(
  source:
    | Record<string, unknown>
    | undefined,
  key: string
): string {
  const value =
    source?.[key];

  return typeof value ===
    "string"
    ? value
    : "";
}

function objectValue(
  source:
    | Record<string, unknown>
    | undefined,
  key: string
): Record<
  string,
  unknown
> {
  const value =
    source?.[key];

  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as Record<
    string,
    unknown
  >;
}

function getStandOutCards(
  standOut:
    | Record<string, unknown>
    | undefined
): StandOutCard[] {
  const raw =
    standOut?.cards;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter(
      (
        item
      ): item is Record<
        string,
        unknown
      > =>
        !!item &&
        typeof item ===
          "object" &&
        !Array.isArray(item)
    )
    .map(
      (item) => ({
        image:
          typeof item.image ===
          "string"
            ? item.image
            : "",

        title:
          typeof item.title ===
          "string"
            ? item.title
            : "",

        desc:
          typeof item.desc ===
          "string"
            ? item.desc
            : "",
      })
    );
}

/**
 * CMS description Resource sekarang berbentuk:
 *
 * Mitra Tepercaya Anda dalam
 * <managed>Layanan Terkelola</managed> &
 * <outsourcing>Alih Daya</outsourcing>
 *
 * Function ini menjaga styling lama
 * tanpa dangerouslySetInnerHTML.
 */
function ResourceDescription({
  value,
}: {
  value: string;
}) {
  const managedMatch =
    value.match(
      /<managed>(.*?)<\/managed>/
    );

  const outsourcingMatch =
    value.match(
      /<outsourcing>(.*?)<\/outsourcing>/
    );

  if (
    !managedMatch &&
    !outsourcingMatch
  ) {
    return (
      <>
        {value}
      </>
    );
  }

  let remaining =
    value;

  const parts: React.ReactNode[] =
    [];

  let key =
    0;

  const regex =
    /<(managed|outsourcing)>(.*?)<\/\1>/g;

  let lastIndex =
    0;

  let match:
    RegExpExecArray | null;

  while (
    (match =
      regex.exec(
        remaining
      )) !== null
  ) {
    if (
      match.index >
      lastIndex
    ) {
      parts.push(
        <span
          key={
            `text-${key++}`
          }
        >
          {remaining.slice(
            lastIndex,
            match.index
          )}
        </span>
      );
    }

    parts.push(
      <span
        key={
          `highlight-${key++}`
        }
        className="font-regular text-[#05638B]"
      >
        {match[2]}
      </span>
    );

    lastIndex =
      regex.lastIndex;
  }

  if (
    lastIndex <
    remaining.length
  ) {
    parts.push(
      <span
        key={
          `text-${key++}`
        }
      >
        {remaining.slice(
          lastIndex
        )}
      </span>
    );
  }

  return (
    <>
      {parts}
    </>
  );
}

export default function Resource({
  content,
  technologies = [],
  clients = [],
}: Props) {
  /**
   * =========================================================
   * CMS DATA
   * =========================================================
   */

  const standOut =
    objectValue(
      content,
      "standOut"
    );

  const powering =
    objectValue(
      content,
      "powering"
    );

  const cards =
    getStandOutCards(
      standOut
    );

  const heroDesktopImage =
    text(
      content,
      "hero_desktop_image"
    );

  const heroMobileImage =
    text(
      content,
      "hero_mobile_image"
    );

  /**
   * Hanya tampilkan row
   * yang punya logo.
   */
  const validTechnologies =
    technologies.filter(
      (technology) =>
        Boolean(
          technology.logo_url
        )
    );

  const validClients =
    clients.filter(
      (client) =>
        Boolean(
          client.logo_url
        )
    );

  /**
   * =========================================================
   * WHY STAND OUT - CAROUSEL
   * =========================================================
   */

  const scrollRef =
    useRef<HTMLDivElement>(
      null
    );

  const [
    showLeftArrow,
    setShowLeftArrow,
  ] =
    useState(false);

  const [
    showRightArrow,
    setShowRightArrow,
  ] =
    useState(true);

  const [
    isDragging,
    setIsDragging,
  ] =
    useState(false);

  const [
    startX,
    setStartX,
  ] =
    useState(0);

  const [
    startScrollLeft,
    setStartScrollLeft,
  ] =
    useState(0);

  const handleScroll =
    () => {
      if (
        !scrollRef.current
      ) {
        return;
      }

      const {
        scrollLeft,
        scrollWidth,
        clientWidth,
      } =
        scrollRef.current;

      setShowLeftArrow(
        scrollLeft > 10
      );

      setShowRightArrow(
        scrollLeft +
          clientWidth <
          scrollWidth -
            10
      );
    };

  /**
   * MOUSE DOWN
   */
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (
      !scrollRef.current
    ) {
      return;
    }

    setIsDragging(
      true
    );

    setStartX(
      e.pageX -
        scrollRef.current
          .offsetLeft
    );

    setStartScrollLeft(
      scrollRef.current
        .scrollLeft
    );
  };

  /**
   * MOUSE MOVE
   */
  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (
      !isDragging ||
      !scrollRef.current
    ) {
      return;
    }

    e.preventDefault();

    const x =
      e.pageX -
      scrollRef.current
        .offsetLeft;

    const walk =
      (x -
        startX) *
      1.5;

    scrollRef.current.scrollLeft =
      startScrollLeft -
      walk;
  };

  /**
   * MOUSE UP
   */
  const handleMouseUp =
    () => {
      setIsDragging(
        false
      );
    };

  /**
   * ARROWS
   */
  const scrollRight =
    () => {
      scrollRef.current?.scrollBy(
        {
          left:
            320,

          behavior:
            "smooth",
        }
      );
    };

  const scrollLeft =
    () => {
      scrollRef.current?.scrollBy(
        {
          left:
            -320,

          behavior:
            "smooth",
        }
      );
    };

  if (!content) {
    return null;
  }

  return (
    <main className="overflow-hidden bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          resource-hero
          relative
          h-[calc(100vw*2.222)]
          overflow-hidden
          md:h-[600px]
          lg:h-[680px]
          xl:h-[760px]
          2xl:h-[860px]
        "
      >

        {/* ================= MOBILE BACKGROUND ================= */}

        {heroMobileImage && (
          <Image
            src={
              heroMobileImage
            }
            alt=""
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              md:hidden
            "
          />
        )}

        {/* ================= DESKTOP BACKGROUND ================= */}

        {heroDesktopImage && (
          <Image
            src={
              heroDesktopImage
            }
            alt=""
            fill
            priority
            sizes="100vw"
            className="
              hidden
              object-cover
              md:block
            "
          />
        )}

        {/* ================= HERO CONTENT ================= */}

        <div className="absolute inset-0">

          <div
            className="
              mx-auto
              flex
              h-full
              w-full
              max-w-[1440px]
              items-start
              px-5
              pt-[85px]
              sm:items-center
              sm:px-8
              sm:pt-0
              md:px-10
              lg:px-16
              xl:px-20
              2xl:px-24
            "
          >

            <div
              className="
                max-w-[320px]
                translate-y-16
                sm:max-w-[480px]
                sm:translate-y-0
                md:max-w-[560px]
                lg:max-w-[600px]
                lg:-translate-y-8
                xl:max-w-[640px]
              "
            >

              {/* TITLE */}

              <h1
                className="
                  text-[28px]
                  font-extrabold
                  leading-[1.1]
                  text-[#04BCBC]

                  sm:whitespace-nowrap
                  sm:text-[36px]
                  md:text-[40px]
                  lg:text-[40px]
                  xl:text-[40px]
                "
              >
                {text(
                  content,
                  "title"
                )}
              </h1>

              {/* SUBTITLE */}

              <h2
                className="
                  mt-3
                  text-[18px]
                  font-bold
                  leading-tight
                  text-[#111827]
                  sm:text-[20px]
                  md:text-[26px]
                  lg:text-[34px]
                  xl:text-[30px]
                "
              >
                {text(
                  content,
                  "subtitle"
                )}
              </h2>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-3
                  max-w-[520px]
                  text-[13px]
                  leading-relaxed
                  text-[#4B5563]
                  sm:text-[14px]
                  md:text-[10px]
                  lg:text-[16px]
                "
              >
                <ResourceDescription
                  value={text(
                    content,
                    "description"
                  )}
                />
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHY WE STAND OUT
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-white
          py-12
          sm:py-16
          lg:py-20
        "
      >

        {/* LEFT DECORATION */}

        <div
          className="
            absolute
            -left-40
            top-0
            h-[260px]
            w-[260px]
            rounded-full
            bg-[#04BCBC]/15
            sm:-left-52
            sm:h-[420px]
            sm:w-[420px]
          "
        />

        {/* RIGHT DECORATION */}

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-[260px]
            w-[260px]
            rounded-full
            bg-[#04BCBC]/15
            sm:-right-52
            sm:h-[420px]
            sm:w-[420px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-[1440px]
            px-5
            sm:px-6
            md:px-8
            lg:px-12
            xl:px-16
            2xl:px-20
          "
        >

          {/* TITLE */}

          <div className="mb-8 text-center sm:mb-10">

            <h2
              className="
                text-2xl
                font-bold
                text-[#111827]
                sm:text-4xl
              "
            >
              {text(
                standOut,
                "title"
              )}
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
                sm:text-base
              "
            >
              {text(
                standOut,
                "subtitle"
              )}
            </p>

          </div>

          {/* =================================================
              CAROUSEL
          ================================================= */}

          <div className="relative">

            <div
              ref={
                scrollRef
              }
              onScroll={
                handleScroll
              }
              onMouseDown={
                handleMouseDown
              }
              onMouseMove={
                handleMouseMove
              }
              onMouseUp={
                handleMouseUp
              }
              onMouseLeave={
                handleMouseUp
              }
              className={`
                flex
                gap-9
                overflow-x-auto
                pb-4
                scrollbar-hide

                ${
                  isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                }
              `}
            >

              {cards.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      `${item.title}-${index}`
                    }
                    className="
                      group
                      relative
                      h-[320px]
                      w-[240px]
                      flex-shrink-0
                      overflow-hidden
                      rounded-[24px]
                      sm:h-[380px]
                      sm:w-[290px]
                    "
                  >

                    {/* IMAGE */}

                    {item.image && (
                      <Image
                        src={
                          item.image
                        }
                        alt={
                          item.title
                        }
                        fill
                        draggable={
                          false
                        }
                        className="
                          object-cover
                          transition
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    )}

                    {/* GRADIENT */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#05638B]
                        via-[#05638B]/40
                        to-transparent
                      "
                    />

                    {/* TEXT */}

                    <div
                      className="
                        absolute
                        bottom-5
                        left-5
                        right-5
                        text-white
                        sm:bottom-6
                        sm:left-6
                        sm:right-6
                      "
                    >

                      <h3
                        className="
                          select-text
                          text-xl
                          font-light
                          sm:text-2xl
                        "
                      >
                        {
                          item.title
                        }
                      </h3>

                      <div
                        className="
                          mt-0
                          max-h-0
                          overflow-hidden
                          opacity-0
                          transition-all
                          duration-500
                          group-hover:mt-3
                          group-hover:max-h-40
                          group-hover:opacity-100
                        "
                      >

                        <p
                          className="
                            select-text
                            text-sm
                            leading-6
                          "
                        >
                          {
                            item.desc
                          }
                        </p>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* =================================================
                LEFT ARROW
            ================================================= */}

            {showLeftArrow && (
              <button
                type="button"
                onClick={
                  scrollLeft
                }
                aria-label="Scroll left"
                className="
                  absolute
                  left-[-12px]
                  top-1/2
                  z-10
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
                  transition
                  duration-300
                  hover:scale-110
                  md:left-[-24px]
                  md:h-12
                  md:w-12
                "
              >

                <span
                  className="
                    text-2xl
                    leading-none
                    text-[#04BCBC]/70
                    md:text-3xl
                  "
                >
                  ❮
                </span>

              </button>
            )}

            {/* =================================================
                RIGHT ARROW
            ================================================= */}

            {showRightArrow && (
              <button
                type="button"
                onClick={
                  scrollRight
                }
                aria-label="Scroll right"
                className="
                  absolute
                  right-[-12px]
                  top-1/2
                  z-10
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
                  transition
                  duration-300
                  hover:scale-110
                  md:right-[-24px]
                  md:h-12
                  md:w-12
                "
              >

                <span
                  className="
                    text-2xl
                    leading-none
                    text-[#04BCBC]/70
                    md:text-3xl
                  "
                >
                  ❯
                </span>

              </button>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          POWERING
      ===================================================== */}

      <section className="relative overflow-hidden py-16">

        <div className="bg-[#05BDBD] py-4">

          <h2 className="text-center text-2xl font-bold text-white">
            {text(
              powering,
              "title"
            )}
          </h2>

        </div>

        {validTechnologies.length >
          0 && (
          <div className="overflow-hidden py-10">

            <div className="marquee flex w-max gap-8">

              {[
                ...validTechnologies,
                ...validTechnologies,
              ].map(
                (
                  technology,
                  index
                ) => (
                  <div
                    key={
                      `${technology.id}-${index}`
                    }
                    className="
                      flex
                      h-24
                      w-24
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      shadow-lg
                    "
                  >

                    <Image
                      src={
                        technology.logo_url!
                      }
                      alt={
                        technology.name
                      }
                      width={
                        100
                      }
                      height={
                        100
                      }
                      className="
                        h-auto
                        max-h-[80px]
                        w-auto
                        max-w-[80px]
                        object-contain
                      "
                    />

                  </div>
                )
              )}

            </div>

          </div>
        )}

      </section>

      {/* =====================================================
          CLIENT
      ===================================================== */}

      {validClients.length >
        0 && (
        <section className="relative overflow-hidden py-3">

          <div className="overflow-hidden py-10">

            <div
              className="animate-scroll flex w-max gap-8"
              style={{
                animationDuration:
                  "15s",

                animationTimingFunction:
                  "linear",

                animationIterationCount:
                  "infinite",
              }}
            >

              {[
                ...validClients,
                ...validClients,
              ].map(
                (
                  client,
                  index
                ) => (
                  <div
                    key={
                      `${client.id}-${index}`
                    }
                    className="
                      flex
                      h-24
                      w-24
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      shadow-lg
                    "
                  >

                    <Image
                      src={
                        client.logo_url!
                      }
                      alt={
                        client.name
                      }
                      width={
                        100
                      }
                      height={
                        100
                      }
                      className="
                        h-auto
                        max-h-[80px]
                        w-auto
                        max-w-[80px]
                        object-contain
                      "
                    />

                  </div>
                )
              )}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}