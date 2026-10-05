import Image from "next/image";
export function HeroVisual() {
  return (
    <figure className="hardware-photograph detail-hardware-photo">
      <Image
        src="/images/asic-detail.webp"
        alt="ASIC cooling fan, fasteners and metal chassis detail from the HashNomads deck"
        fill
        sizes="(max-width: 800px) 100vw, 45vw"
      />
      <figcaption>Purpose-built Bitcoin mining hardware.</figcaption>
    </figure>
  );
}
