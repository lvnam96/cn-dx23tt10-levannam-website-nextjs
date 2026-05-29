import { revalidatePath } from 'next/cache'

// Single source of truth: mutating entity Z busts Z's own surfaces AND every
// related surface that reads Z. Dynamic routes use the 'page' form so all
// param values are invalidated. revalidatePath is a no-op on uncached paths,
// so listing admin routes that may not be rendered yet is safe.

export function revalidatePost() {
  revalidatePath('/admin/posts')
  revalidatePath('/tin-tuc')
  revalidatePath('/tin-tuc/[slug]', 'page')
  revalidatePath('/')
  revalidatePath('/admin')
}

export function revalidateArtifact() {
  revalidatePath('/admin/artifacts')
  revalidatePath('/hien-vat')
  revalidatePath('/hien-vat/[id]', 'page')
  revalidatePath('/') // homepage shows featured artifacts
  // related: rooms list/edit show artifact counts + lists; exhibitions list/forms show linked artifacts
  revalidatePath('/admin/rooms')
  revalidatePath('/admin/rooms/[id]/edit', 'page')
  revalidatePath('/admin/exhibitions')
  revalidatePath('/admin/exhibitions/new') // picker lists all artifacts
  revalidatePath('/admin/exhibitions/[id]/edit', 'page')
  revalidatePath('/trien-lam')
  revalidatePath('/trien-lam/[id]', 'page')
  revalidatePath('/admin')
}

export function revalidateRoom() {
  revalidatePath('/admin/rooms')
  revalidatePath('/admin/rooms/[id]/edit', 'page')
  // related: artifacts carry the room name/badge + the room <select> options
  revalidatePath('/hien-vat')
  revalidatePath('/hien-vat/[id]', 'page')
  revalidatePath('/') // homepage featured-artifact cards show the room name
  revalidatePath('/admin/artifacts')
  revalidatePath('/admin/artifacts/new')
  revalidatePath('/admin/artifacts/[id]/edit', 'page')
  // exhibition detail renders artifact room names
  revalidatePath('/trien-lam')
  revalidatePath('/trien-lam/[id]', 'page')
  revalidatePath('/admin')
}

export function revalidateExhibition() {
  revalidatePath('/admin/exhibitions')
  revalidatePath('/admin/exhibitions/[id]/edit', 'page')
  revalidatePath('/trien-lam')
  revalidatePath('/trien-lam/[id]', 'page')
  revalidatePath('/')
  revalidatePath('/admin')
}

export function revalidateTour() {
  revalidatePath('/admin/tours')
  revalidatePath('/admin')
}

export function revalidateContact() {
  revalidatePath('/admin/contacts')
  revalidatePath('/admin')
}
