import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/requireAdmin'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { supabase } = auth

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, created_at')

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  const { data: purchases, error: purchasesError } = await supabase
    .from('token_transactions')
    .select('user_id')
    .eq('type', 'purchase')

  if (purchasesError) {
    return NextResponse.json({ error: purchasesError.message }, { status: 500 })
  }

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalUsuarios = profiles?.length || 0
  const registrosSemana = (profiles || []).filter(p => new Date(p.created_at) >= weekAgo).length
  const registrosMes = (profiles || []).filter(p => new Date(p.created_at) >= startOfMonth).length

  const compradoresSet = new Set((purchases || []).map(p => p.user_id))
  const compraron = compradoresSet.size
  const soloFree = Math.max(totalUsuarios - compraron, 0)

  return NextResponse.json({
    totalUsuarios,
    registrosSemana,
    registrosMes,
    compraron,
    soloFree
  })
}
