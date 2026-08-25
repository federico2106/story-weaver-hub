import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_TOKEN_BALANCE } from '@/lib/tokens'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('token_balance')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: user.id, token_balance: DEFAULT_TOKEN_BALANCE })
      .select('token_balance')
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ balance: created.token_balance })
  }

  return NextResponse.json({ balance: data.token_balance })
}
