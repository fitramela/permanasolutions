"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const systemSlides = [
  {
    id: 1,
    image: "/images/image 679.png",
  },
  {
    id: 2,
    image: "/images/image 683.png",
  },
  {
    id: 3,
    image: "/images/image 680.png",
  },
  {
    id: 4,
    image: "/images/image 681.png",
  },
  {
    id: 5,
    image: "/images/image 682.png",
  },
  {
    id: 6,
    image: "/images/image 684.png",
  },
];

type SmartSystemItem = {
  name: string;
  title: string;
  description: string;
};

export default function ServiceAndClientsSection() {
  const t = useTranslations("SmartSystem");

  const systems = t.raw("systems") as SmartSystemItem[];

  const [activeSlide, setActiveSlide] = useState(0);
  const carouselId = useId();

  const currentSlide = systemSlides[activeSlide];
  const currentSystem = systems[activeSlide];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % systemSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? systemSlides.length - 1 : prev - 1
    );
  };

  return (
   <section
  aria-labelledby="service-heading"
  className="w-full bg-white py-20"
>
  <div className="w-full">
   <div className="mx-auto w-full px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-24">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h2
            id="service-heading"
            className="text-4xl font-bold text-black md:text-5xl"
          >
            {t("title")}
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[520px_1fr]">
          {/* Left Card */}
          <div className="rounded-3xl bg-gradient-to-b from-[#EAF9F9] to-white p-8 shadow-lg">
            <p className="font-semibold text-[#00628d]">
              {t("ourSystem")}
            </p>

            <h3 className="mt-2 text-4xl font-semibold text-black">
              {t("industry")}
            </h3>

            <div
              aria-labelledby={carouselId}
              className="relative mt-10"
            >
              <span id={carouselId} className="sr-only">
                System Carousel
              </span>

              <div className="relative mx-auto h-[220px] w-full">
                <Image
                  src={currentSlide.image}
                  alt={currentSystem.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-6 flex justify-center gap-2">
                {systemSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(index)}
                    className={`h-3 w-3 rounded-full transition ${
                      activeSlide === index
                        ? "bg-[#00628d]"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <h4 className="mt-6 text-center text-2xl font-bold text-black">
                {currentSystem.title}
              </h4>

              <p className="mx-auto mt-3 max-w-md text-center text-gray-600">
                {currentSystem.description}
              </p>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevSlide}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-[#00628d] hover:text-white"
                  aria-label="Previous Slide"
                >
                  ◀
                </button>

                <button
                  onClick={nextSlide}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-[#00628d] hover:text-white"
                  aria-label="Next Slide"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="mb-8 text-3xl font-semibold text-black">
              {t("monitoring")}
            </h3>

           <div className="relative flex h-[480px] items-center justify-center overflow-hidden rounded-2xl">
  <Image
    src="/images/dashboard-preview.png"
    alt="Dashboard Preview"
    fill
    className="scale-110 object-contain"
    sizes="(max-width:1024px)100vw,60vw"
    priority
  />
</div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}