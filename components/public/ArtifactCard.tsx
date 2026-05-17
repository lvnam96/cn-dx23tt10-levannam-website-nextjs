import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function CardInner({
  name,
  image,
  category,
  roomName,
}: {
  name: string
  image: string
  category: string
  roomName?: string
}) {
  return (
    <>
      <div className="relative aspect-3/2 w-full overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="inline-flex w-fit rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
          {category}
        </span>
        <h3 className="line-clamp-2 text-lg font-semibold">{name}</h3>
        {roomName && <p className="mt-auto text-sm text-muted-foreground">{roomName}</p>}
      </div>
    </>
  )
}

export function ArtifactCard({
  name,
  image,
  category,
  roomName,
  href,
}: {
  name: string
  image: string
  category: string
  roomName?: string
  href?: string
}) {
  const base = 'group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card'
  const inner = <CardInner name={name} image={image} category={category} roomName={roomName} />
  if (href) {
    return (
      <Link href={href} className={cn(base, 'transition-shadow hover:shadow-lg')}>
        {inner}
      </Link>
    )
  }
  return <div className={base}>{inner}</div>
}
