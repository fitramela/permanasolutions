"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Asp() {
  const t = useTranslations("Asp");

 const [activeIndex, setActiveIndex] = useState<string | null>("primebiz-0");
 const [currentProduct, setCurrentProduct] = useState(0);

 const products = [
  {
    key: "primebiz",
    title: "PrimeBiz",
    description: t("primeDescription"),
    image: "/images/products/biz.png",
    items: t.raw("primebiz.items"),
  },
  {
    key: "primeteams",
    title: "PrimeTeams",
    description: t("primeTeamsDescription"),
    image: "/images/products/teams.png",
    items: t.raw("primeteams.items"),
  },
  {
    key: "primeresto",
    title: "PrimeResto",
    description: t("primeRestoDescription"),
    image: "/images/products/resto.png",
    items: t.raw("primeresto.items"),
  },
  {
    key: "primecafe",
    title: "PrimeCafe",
    description: t("primeCafeDescription"),
    image: "/images/products/cafe.png",
    items: t.raw("primecafe.items"),
  },
  {
    key: "primecare",
    title: "PrimeCare",
    description: t("primeCareDescription"),
    image: "/images/products/care.png",
    items: t.raw("primecare.items"),
  },
  {
    key: "primeedu",
    title: "PrimeEdu",
    description: t("primeEduDescription"),
    image: "/images/products/edu.png",
    items: t.raw("primeedu.items"),
  },
  {
    key: "primecourse",
    title: "PrimeCourse",
    description: t("primeCourseDescription"),
    image: "/images/products/course.png",
    items: t.raw("primecourse.items"),
  },
  {
    key: "petpuffy",
    title: "PetPuffy",
    description: t("petPuffyDescription"),
    image: "/images/products/puffy.png",
    items: t.raw("petpuffy.items"),
  },
];

  return (
  <main className="overflow-hidden bg-white">
    {/* ================= HERO ================= */}
    <section className="bg-[#F5FBFD] pb-14 pt-[100px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-[44px] font-extrabold leading-none text-[#05638B] sm:text-[56px] lg:text-[64px]">
            {t("title")}
          </h1>

          <h2 className="mt-2 text-[26px] font-medium leading-tight text-black sm:text-[36px] lg:text-[54px]">
            {t("subtitle")}
          </h2>

          <p className="mt-2 text-sm text-gray-700 sm:text-base lg:text-xl">
            {t("description")}{" "}
            <span className="text-[#05638B]">
              {t("technology")}
            </span>
          </p>
        </div>

        {/* ASP CARDS */}
        <div className="mt-12 flex items-end justify-center gap-4 overflow-x-auto pb-4 lg:gap-6">
          {/* IMAGE */}
          <div className="relative h-[240px] w-[145px] flex-shrink-0 overflow-hidden rounded-[30px] lg:h-[320px] lg:w-[190px]">
            <Image
              src="/images/image 44.png"
              alt="ASP"
              fill
              className="object-cover"
            />
          </div>

          {/* CARD 1 */}
          <div className="flex h-[240px] w-[190px] items-center justify-center rounded-[30px] bg-[linear-gradient(180deg,#0D668A_0%,#0A5F7E_45%,#062F44_100%)] px-6 text-center text-white">
            <p className="max-w-[145px] text-[16px] leading-8">
              {t("card1")}
            </p>
          </div>

          {/* CARD 2 */}
          <div className="flex h-[155px] w-[150px] flex-shrink-0 items-center justify-center lg:h-[190px] lg:w-[190px]">
            <p className="max-w-[145px] text-center text-[16px] leading-8 text-[#1F3A5F]">
              {t("card2")}
            </p>
          </div>

          {/* CARD 3 */}
          <div className="flex h-[185px] w-[150px] flex-shrink-0 flex-col items-center justify-center rounded-[30px] bg-[#9FC8DC] text-white lg:h-[240px] lg:w-[190px]">
            <h3 className="text-4xl lg:text-5xl">5+</h3>

            <p className="mt-3 w-28 text-center text-[16px] leading-5 lg:w-36 lg:text-sm lg:leading-6">
              {t("card3")}
            </p>
          </div>

          {/* CARD 4 */}
          <div className="relative flex h-[240px] w-[145px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[30px] bg-[#0A4D69] px-4 text-center text-white lg:h-[320px] lg:w-[190px]">
            <div className="absolute -left-7 -top-7 h-20 w-20 rounded-full border-[14px] border-[#0D7CA8]/30 lg:h-24 lg:w-24 lg:border-[18px]" />
            <div className="absolute -left-2 -top-2 h-10 w-10 rounded-full bg-[#062F42] lg:h-12 lg:w-12" />

            <p className="relative text-xs leading-5 lg:text-sm lg:leading-7">
              {t("card4")}
            </p>
          </div>
        </div>
      </div>
    </section>

   {/* ================= PRODUCTS ================= */}
<section className="relative py-20">
  <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-cyan-100 opacity-40 blur-3xl" />

  {/* Previous */}
  {currentProduct > 0 && (
    <button
      onClick={() => {
        const prev = currentProduct - 1;
        setCurrentProduct(prev);
        setActiveIndex(`${products[prev].key}-0`);
      }}
      className="absolute left-4 top-1/2 z-20 -translate-y-1/2 text-5xl font-light text-[#05638B] transition hover:text-[#03A8A8]"
    >
      &#10094;
    </button>
  )}

  {/* Next */}
  {currentProduct < products.length - 1 && (
    <button
      onClick={() => {
        const next = currentProduct + 1;
        setCurrentProduct(next);
        setActiveIndex(`${products[next].key}-0`);
      }}
      className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-5xl font-light text-[#05638B] transition hover:text-[#03A8A8]"
    >
      &#10095;
    </button>
  )}

  <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-primary">
        {products[currentProduct].title}
      </h2>

      <p className="mt-3 max-w-xl text-gray-600">
        {products[currentProduct].description}
      </p>
    </div>

    <div className="grid items-start gap-12 lg:grid-cols-2">
    {/* LEFT */}
<div className="flex items-center justify-center">
  <div className="drop-shadow-[0_25px_40px_rgba(0,0,0,0.18)]">
    <Image
      src={products[currentProduct].image}
      alt={products[currentProduct].title}
      width={1000}
      height={900}
      priority
      className="h-auto w-full max-w-[650px] object-contain"
    />
  </div>
</div>

      {/* RIGHT */}
      <div className="space-y-5">
        {products[currentProduct].items.map((_: any, index: number) => {
          const itemKey = `${products[currentProduct].key}-${index}`;

          return (
            <div
              key={itemKey}
              className="border-b border-cyan-200 pb-5"
            >
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    activeIndex === itemKey ? null : itemKey
                  )
                }
                className="flex w-full items-start gap-4 text-left"
              >
                <div
                  className={`mt-1 h-4 w-4 rounded-full border-2 ${
                    activeIndex === itemKey
                      ? "border-primary bg-primary"
                      : "border-gray-300"
                  }`}
                />

                <div className="flex-1">
                  <h3 className="text-base text-gray-800">
                    {t(
                      `${products[currentProduct].key}.items.${index}.title`
                    )}
                  </h3>

                  <p className="mt-1 text-sm italic text-primary">
                    {activeIndex === itemKey
                      ? t("showLess")
                      : t("seeMore")}
                  </p>

                  {activeIndex === itemKey && (
                    <p className="mt-3 leading-7 text-gray-600">
                      {t(
                        `${products[currentProduct].key}.items.${index}.description`
                      )}
                    </p>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>
  </main>
);
}