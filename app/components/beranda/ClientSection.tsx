"use client";

import Image from "next/image";
import type {
  CmsClient,
  CmsSectionContent,
} from "@/app/services/cms";

type Props = {
  content?: CmsSectionContent;
  clients: CmsClient[];
};

function text(
  content: CmsSectionContent | undefined,
  key: string,
  fallback = ""
) {
  const value = content?.[key];
  return typeof value === "string" && value.trim()
    ? value
    : fallback;
}

export default function ClientSection({
  content,
  clients,
}: Props) {
  const visibleClients = clients.filter(
    (client) =>
      typeof client.logo_url === "string" &&
      client.logo_url.trim().length > 0
  );

  return (
  <section className="relative z-20 -mt-28 w-full bg-white pb-20">
    <h2
  className="
    relative
    z-10
    mb-12
    text-center
    text-4xl
    font-bold
    text-[#05638B]
    drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]
  "
>
  {text(content, "title")}
</h2>

    <div className="w-full overflow-hidden">
      <div className="flex w-max animate-scroll gap-10 px-10">
        {[...visibleClients, ...visibleClients].map((client, index) => (
          <div
            key={`${client.id}-${index}`}
            className="flex h-20 min-w-[180px] flex-shrink-0 items-center justify-center"
          >
            <Image
              src={client.logo_url as string}
              alt={client.name || "Client"}
              width={180}
              height={64}
              className="h-auto max-h-16 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);
}
