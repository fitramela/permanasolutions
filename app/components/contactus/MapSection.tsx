"use client";

export default function MapSection() {
  return (
    <section className="w-full bg-white py-200">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Map Card */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(0,0,0,.08)]">

          <iframe
            src="https://www.google.com/maps?q=Medianusa+Permana+Jakarta&output=embed"
            loading="lazy"
            title="Medianusa Permana Location"
            className="h-[320px] w-full border-0 md:h-[420px] lg:h-[500px]"
          />

        </div>

        {/* Address Card */}
        <div className="mt-1 rounded-2xl p-6 shadow-">

          <h3 className="text-xl font-semibold text-[#005D86]">
            Medianusa Permana (Permana Solutions)
          </h3>

          <p className="mt-3 leading-7 text-gray-600">
            Jl. Cideng Barat No.21B 3,
            RT.11/RW.11,
            Duri Pulo,
            Kecamatan Gambir,
            Kota Jakarta Pusat,
            Daerah Khusus Ibukota Jakarta 10140
          </p>

          <a
            href="https://maps.google.com/?q=Medianusa+Permana+Jakarta"
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
            Open in Google Maps
          </a>

        </div>

      </div>
    </section>
  );
}