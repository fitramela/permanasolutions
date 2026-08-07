"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { TeamMember } from "./teamdata";

interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
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