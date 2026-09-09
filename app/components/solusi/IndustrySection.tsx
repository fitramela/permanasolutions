"use client";

import Image from "next/image";

type IndustryContent = {
  tag?: string;
  title1?: string;
  title2?: string;
  titleHighlight?: string;
  description?: string;
  footer?: string;
  image_id?: string;
  image_en?: string;
};

type Props = {
  content?: IndustryContent;
  locale: string;
};

function renderFooter(
  footer?: string
) {
  if (!footer) {
    return null;
  }

  const parts = footer.split(
    /(<bold>.*?<\/bold>)/g
  );

  return parts.map((part, index) => {
    const match = part.match(
      /^<bold>(.*?)<\/bold>$/
    );

    if (match) {
      return (
        <span
          key={index}
          className="font-semibold text-[#333333]"
        >
          {match[1]}
        </span>
      );
    }

    return part;
  });
}

export default function IndustrySection({
  content,
  locale,
}: Props) {
  if (!content) {
    return null;
  }

  const image =
    locale === "id"
      ? content.image_id
      : content.image_en;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:px-16">
        {/* Left */}

        <div className="flex h-full max-w-full flex-col lg:max-w-[360px]">
          <p className="text-base font-semibold text-[#00628D] lg:text-lg">
            {content.tag}
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#111111] sm:text-4xl">
            {content.title1}
            <br />

            {content.title2}{" "}

            <span className="text-[#04BCBC]">
              {content.titleHighlight}
            </span>
          </h2>

          <p
            className="
              mt-6
              max-w-[340px]
              text-[15px]
              leading-8
              text-[#6B7280]
              text-justify
              sm:mt-8
              sm:max-w-[360px]
              lg:max-w-[350px]
            "
          >
            {content.description}
          </p>

          <p
            className="
              mt-6
              text-sm
              leading-7
              text-[#555555]
              text-justify
              [text-align-last:left]
              lg:mt-[250px]
              lg:leading-8
            "
          >
            {renderFooter(
              content.footer
            )}
          </p>
        </div>

        {/* Right Image */}

        {image && (
          <div className="flex-1">
            <Image
              src={image}
              alt="Industries"
              width={900}
              height={700}
              className="h-auto w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}