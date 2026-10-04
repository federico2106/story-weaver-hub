import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/requireAdmin'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { supabase } = auth

  const { data: transactions, error } = await supabase
    .from('token_transactions')
    .select('amount_cents, currency, pack_id, created_at')
    .eq('type', 'purchase')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let totalHistoricoCents = 0
  let totalMesActualCents = 0
  const porPackMap: Record<string, { count: number; totalCents: number }> = {}

  for (const t of transactions || []) {
    totalHistoricoCents += t.amount_cents
    if (new Date(t.created_at) >= startOfMonth) {
      totalMesActualCents += t.amount_cents
    }
    const key = t.pack_id || 'sin_pack'
    if (!porPackMap[key]) porPackMap[key] = { count: 0, totalCents: 0 }
    porPackMap[key].count += 1
    porPackMap[key].totalCents += t.amount_cents
  }

  return NextResponse.json({
    totalHistorico: totalHistoricoCents / 100,
    totalMesActual: totalMesActualCents / 100,
    currency: transactions?.[0]?.currency || 'USD',
    porPack: Object.entries(porPackMap).map(([packId, v]) => ({
      packId,
      count: v.count,
      total: v.totalCents / 100
    })),
    suscripcionesActivas: null
  })
}
