import Image from 'next/image'
import Link from 'next/link'

export function RoomEntryCards({
  rooms,
}: {
  rooms: { id: string; name: string; count: number; image: string }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {rooms.map((r) => (
        <Link
          key={r.id}
          href={`/hien-vat?room=${r.id}`}
          className="group relative aspect-4/3 overflow-hidden rounded-lg"
        >
          <Image
            src={r.image}
            alt={r.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-navy-950/85 to-navy-950/10" />
          <div className="absolute inset-x-0 bottom-0 p-3 text-navy-50">
            <div className="font-heading font-semibold">{r.name}</div>
            <div className="text-xs text-navy-50/80">{r.count} hiện vật</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
