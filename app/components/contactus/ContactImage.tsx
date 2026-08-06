"use client";

import Image from "next/image";

export default function ContactImage() {
  return (
    <div className="relative h-[529px] w-[818px] -top-[10px] left-[7px]">

     

      {/* Background Biru Tua */}
      <Image
        src="/images/mglaptop.png"
        alt=""
        fill
        className="
          object-
          select-none
          pointer-events-none
        "
      />

      {/* Logo */}
      <Image
        src="/images/SP1.png"
        alt="Permana Solutions"
        width={306}
        height={76}
        className="
          absolute
          left-[52px]
          top-[46px]
          z-20
        "
      />
    </div>
  );
}