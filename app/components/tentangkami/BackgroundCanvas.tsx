"use client";

import Image from "next/image";

export default function BackgroundCanvas() {
  return (
    <div
      className="
        absolute
        inset-0
        overflow-hidden
        pointer-events-none
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          left-1/2
          top-[-140px]
          -translate-x-1/2
          h-[300px]
          w-[1100px]
          rounded-full
          bg-cyan-300/30
          blur-[140px]
        "
      />

      {/* Background kiri */}

      <Image
        src="/images/BGkiri.png"
        alt=""
        width={320}
        height={1200}
        className="
          absolute
          left-0
          top-[520px]
          w-[320px]
          h-auto
          select-none
        "
      />

      {/* Dot */}

      <Image
        src="/images/bgkiripermana.png"
        alt=""
        width={380}
        height={380}
        className="
          absolute
          left-[-20px]
          top-[1580px]
          w-[360px]
          h-auto
          opacity-70
        "
      />

      {/* Glow bawah */}

      <div
        className="
          absolute
          right-[-150px]
          bottom-[220px]
          h-[420px]
          w-[420px]
          rounded-full
          bg-cyan-200/20
          blur-[170px]
        "
      />
    </div>
  );
}