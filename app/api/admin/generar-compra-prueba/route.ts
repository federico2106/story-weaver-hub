import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/requireAdmin'

// Catálogo de packs de prueba: refleja los precios mostrados en app/tienda/page.tsx.
// El "Pase Ilimitado" no es en realidad un producto basado en tokens, así que
// para esta simulación se modela como un pack grande de tokens.
const CATALOGO_TEST: Record<string, { tokens: number; amountCents: number }> = {
  pack_inicial: { tokens: 100, amountCents: 499 },
  pack_pro: { tokens: 250, amountCents: 999 },
  pase_ilimitado: { tokens: 1000, amountCents: 1999 },
}

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { supabase } = auth

  const body = await req.json().catch(() => ({}))
  const packId = body?.packId as string | undefined

  const pack = packId ? CATALOGO_TEST[packId] : undefined
  if (!pack) {
    return NextResponse.json({ error: 'Pack inválido.' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('record_token_purchase', {
    p_pack_id: packId,
    p_tokens: pack.tokens,
    p_amount_cents: pack.amountCents,
    p_currency: 'USD'
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data?.success) {
    return NextResponse.json({ error: data?.error || 'No se pudo generar la compra.' }, { status: 403 })
  }

  return NextResponse.json(data)
}
