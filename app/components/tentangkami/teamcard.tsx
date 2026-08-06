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
        group
        relative
        flex
        h-full
        min-h-[390px]
        flex-col
        rounded-[32px]
        bg-white
        px-7
        pb-8
        pt-24
        shadow-[0_12px_40px_rgba(0,93,134,.08)]
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-[0_20px_55px_rgba(0,93,134,.18)]
      "
    >
      {/* Photo */}

      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">

        <div
          className="
            relative

            h-[140px]
            w-[140px]

            overflow-hidden

            rounded-full

            border-[6px]
            border-white

            shadow-xl

            transition-transform
            duration-500

            group-hover:scale-105

            lg:h-[160px]
            lg:w-[160px]
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

      {/* Position */}

      <div className="flex justify-center">

        <span
          className="
            rounded-full

            bg-gradient-to-r

            from-cyan-400
            to-sky-500

            px-5
            py-2

            text-xs

            font-semibold

            tracking-wide

            text-white
          "
        >
          {member.position}
        </span>

      </div>

      {/* Name */}

      <h3
        className="
          mt-6

          text-center

          text-xl

          font-bold

          text-[#005D86]

          lg:text-2xl
        "
      >
        {member.name}
      </h3>

      {/* Description */}

      <p
        className="
          mt-5

          flex-1

          text-center

          text-sm

          leading-7

          text-[#6B7280]
        "
      >
        {member.description}
      </p>

    </article>
  );
}