"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type { CmsSectionContent } from "@/app/services/cms";

type SmartSystemItem = {
  name: string;
  title: string;
  description: string;
  image_url: string;
};

type Props = {
  content?: CmsSectionContent;
};

function text(
  content: CmsSectionContent | undefined,
  key: string
) {
  const value = content?.[key];

  return typeof value === "string"
    ? value
    : "";
}

function getSystems(
  content?: CmsSectionContent
): SmartSystemItem[] {
  const value = content?.systems;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return [];
    }

    const record =
      item as Record<string, unknown>;

    const name =
      typeof record.name === "string"
        ? record.name
        : "";

    const title =
      typeof record.title === "string"
        ? record.title
        : "";

    const description =
      typeof record.description === "string"
        ? record.description
        : "";

    const image_url =
      typeof record.image_url === "string"
        ? record.image_url
        : "";

    return [
      {
        name,
        title,
        description,
        image_url,
      },
    ];
  });
}

export default function ServiceAndClientsSection({
  content,
}: Props) {
  const systems =
    getSystems(content);

  const [activeSlide, setActiveSlide] =
    useState(0);

  const carouselId =
    useId();

  const safeActiveSlide =
    systems.length > 0
      ? Math.min(
          activeSlide,
          systems.length - 1
        )
      : 0;

  const currentSystem =
    systems[safeActiveSlide];

  const nextSlide = () => {
    if (systems.length === 0) {
      return;
    }

    setActiveSlide(
      (prev) =>
        (prev + 1) %
        systems.length
    );
  };

  const prevSlide = () => {
    if (systems.length === 0) {
      return;
    }

    setActiveSlide(
      (prev) =>
        prev === 0
          ? systems.length - 1
          : prev - 1
    );
  };

  const dashboardImage =
    text(
      content,
      "dashboard_image"
    );

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
              {text(
                content,
                "title"
              )}
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
              {text(
                content,
                "subtitle"
              )}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[520px_1fr]">

            {/* Left Card */}
            <div className="rounded-3xl bg-gradient-to-b from-[#EAF9F9] to-white p-8 shadow-lg">

              <p className="font-semibold text-[#00628d]">
                {text(
                  content,
                  "ourSystem"
                )}
              </p>

              <h3 className="mt-2 text-4xl font-semibold text-black">
                {text(
                  content,
                  "industry"
                )}
              </h3>

              <div
                aria-labelledby={
                  carouselId
                }
                className="relative mt-10"
              >
                {currentSystem && (
                  <>
                    <div className="relative mx-auto h-[220px] w-full">
                      {currentSystem.image_url && (
                        <Image
                          src={
                            currentSystem.image_url
                          }
                          alt={
                            currentSystem.title ||
                            currentSystem.name
                          }
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>

                    <div className="mt-6 flex justify-center gap-2">
                      {systems.map(
                        (
                          system,
                          index
                        ) => (
                          <button
                            key={`${system.name}-${index}`}
                            onClick={() =>
                              setActiveSlide(
                                index
                              )
                            }
                            className={`h-3 w-3 rounded-full transition ${
                              safeActiveSlide ===
                              index
                                ? "bg-[#00628d]"
                                : "bg-gray-300"
                            }`}
                            aria-label={`Go to slide ${
                              index + 1
                            }`}
                          />
                        )
                      )}
                    </div>

                    <h4 className="mt-6 text-center text-2xl font-bold text-black">
                      {
                        currentSystem.title
                      }
                    </h4>

                    <p className="mx-auto mt-3 max-w-md text-center text-gray-600">
                      {
                        currentSystem.description
                      }
                    </p>
                  </>
                )}

                <div className="mt-8 flex justify-between">

                  <button
                    onClick={
                      prevSlide
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-[#00628d] hover:text-white"
                    aria-label="Previous Slide"
                  >
                    ◀
                  </button>

                  <button
                    onClick={
                      nextSlide
                    }
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

              <h3 className="mb-8 text-2xl font-semibold text-black">
                {text(
                  content,
                  "monitoring"
                )}
              </h3>

              <div className="relative mx-auto flex h-[250px] w-[100%] items-center justify-center overflow-hidden rounded-2xl sm:h-[400px] sm:w-[95%] lg:h-[480px] lg:w-full">

                {dashboardImage && (
                  <Image
                    src={
                      dashboardImage
                    }
                    alt="Dashboard Preview"
                    fill
                    className="scale-110 object-contain"
                    sizes="(max-width:1024px)100vw,60vw"
                    priority
                  />
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}