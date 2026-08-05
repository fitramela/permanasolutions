"use client";

import Image from "next/image";
import { TeamMember } from "./teamdata";

interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <article
      className="
        relative

        flex
        flex-col
        items-center

        h-[345px]

        rounded-[14px]

        border
        border-[#E9EEF3]

        bg-white

        px-5
        pt-[82px]
        pb-5

        shadow-[0_8px_22px_rgba(0,0,0,.04)]

        transition-all
        duration-300

        hover:-translate-y-2
      "
    >
      {/* FOTO */}

      <div
        className="
          absolute
          left-1/2
          top-0

          -translate-x-1/2
          -translate-y-[48%]
        "
      >
        <div
          className="
            relative

            h-[118px]
            w-[118px]

            overflow-hidden

            rounded-full

            border-[4px]
            border-[#DDE8EF]

            bg-white
          "
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* POSITION */}

      <span
        className="
          rounded-full

          bg-[#13C6D6]

          px-4
          py-[3px]

          text-[10px]
          font-semibold

          text-white
        "
      >
        {member.position}
      </span>

      {/* NAMA */}

      <h3
        className="
          mt-4

          text-center

          text-[16px]
          font-semibold

          text-[#202020]
        "
      >
        {member.name}
      </h3>

      {/* DESKRIPSI */}

      <p
        className="
          mt-4

          text-center

          text-[12px]

          leading-[22px]

          text-[#666]
        "
      >
        {member.description}
      </p>
    </article>
  );
}