import "./styles.css";

export default function MapSection() {
  return (
    <section className="map-section">

      <div className="map-wrapper">

        <iframe
          src="https://www.google.com/maps?q=Medianusa+Permana+Jakarta&output=embed"
          loading="lazy"
        ></iframe>

      </div>

      <div className="map-address">

        <h3>Medianusa Permana (Permana Solutions)</h3>

        <p>
          Jl. Cideng Barat No.21B 3, RT.11/RW.11,
          Duri Pulo, Kecamatan Gambir,
          Kota Jakarta Pusat,
          Daerah Khusus Ibukota Jakarta 10140
        </p>

      </div>

    </section>
  );
}