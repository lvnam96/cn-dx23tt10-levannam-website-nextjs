import Link from 'next/link';
import Image from 'next/image';
import { Landmark, Star } from 'lucide-react';
import type { Artifact, Room } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteArtifact } from '@/actions/artifacts';
import { DeleteButton } from '@/components/admin/DeleteButton';

type ArtifactWithRoom = Artifact & { room: Room | null };

export function ArtifactsTable({ artifacts }: { artifacts: ArtifactWithRoom[] }) {
  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <Landmark className="size-10 opacity-30" />
        <p className="text-sm">Chưa có hiện vật nào.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Ảnh</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Phòng</TableHead>
            <TableHead>Nổi bật</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artifacts.map((a) => (
            <TableRow key={a.id}>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                  {a.images[0] && <Image src={a.images[0]} alt={a.name} fill sizes="48px" className="object-cover" />}
                </div>
              </TableCell>
              <TableCell className="font-medium">{a.name}</TableCell>
              <TableCell>{a.category}</TableCell>
              <TableCell>{a.room ? <Badge variant="secondary">{a.room.name}</Badge> : '—'}</TableCell>
              <TableCell>
                {a.featured ? (
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                ) : (
                  <Star className="size-4 fill-gray-300 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/artifacts/${a.id}/edit`}>Sửa</Link>
                </Button>
                <DeleteButton onDelete={deleteArtifact.bind(null, a.id)} itemName={a.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
