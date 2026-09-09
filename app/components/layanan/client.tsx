"use client";

import Image from "next/image";
import type {
  CmsClient,
  CmsSectionContent,
} from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
  clients?: CmsClient[];
};

function text(
  content: CmsSectionContent | undefined,
  key: string,
  fallback = ""
) {
  const value = content?.[key];
  return typeof value === "string" ? value : fallback;
}

export const Client = ({
  content,
  clients = [],
}: Props) => {
  const validClients = clients.filter(
    (client) =>
      client.is_active !== false &&
      typeof client.logo_url === "string" &&
      client.logo_url.length > 0
  );

  if (validClients.length === 0) {
    return null;
  }

  return (
    <section className="relative z-20 -mt-28 bg-white pb-20">
      <div className="mx-auto w-full">
        <h2 className="relative z-10 mb-12 text-center text-5xl font-bold text-[#05638B] drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
          {text(
            content,
            "titleClientLayanan",
            text(content, "title-clientlayanan", "Our Clients")
          )}
        </h2>

        <div className="overflow-hidden">
          <div className="flex w-max animate-scroll gap-6 md:gap-12">
            {[...validClients, ...validClients].map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="flex h-16 min-w-[120px] flex-shrink-0 items-center justify-center md:h-24 md:min-w-[180px]"
              >
                <Image
                  src={client.logo_url!}
                  alt={client.name}
                  width={180}
                  height={96}
                  className="h-auto max-h-12 w-auto max-w-[160px] object-contain md:max-h-20"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
