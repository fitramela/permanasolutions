"use client";

import type {
  CmsSectionContent,
} from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
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

export default function MapSection({
  content,
}: Props) {
  if (!content) {
    return null;
  }

  const mapEmbedUrl =
    text(
      content,
      "map_embed_url"
    );

  const mapLink =
    text(
      content,
      "map_link"
    );

  return (
    <section className="w-full bg-white py-20">

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading */}

        <div className="mb-10 text-center">

          <h2 className="text-3xl font-bold text-[#005D86] md:text-4xl">
            {text(
              content,
              "findOffice"
            )}
          </h2>

          <p className="mt-3 text-gray-500">
            {text(
              content,
              "visitContact"
            )}
          </p>

        </div>

        {/* Map Card */}

        {mapEmbedUrl && (
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(0,0,0,.08)]">

            <iframe
              src={
                mapEmbedUrl
              }
              loading="lazy"
              title="Medianusa Permana Location"
              className="h-[320px] w-full border-0 md:h-[420px] lg:h-[500px]"
            />

          </div>
        )}

        {/* Address Card */}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h3 className="text-xl font-semibold text-[#005D86]">
            {text(
              content,
              "office"
            )}
          </h3>

          <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
            {text(
              content,
              "address"
            )}
          </p>

          {mapLink && (
            <a
              href={
                mapLink
              }
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                inline-flex
                items-center
                rounded-full
                bg-[#12C2C9]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0eaab0]
              "
            >
              {text(
                content,
                "findOffice"
              )}
            </a>
          )}

        </div>

      </div>

    </section>
  );
}