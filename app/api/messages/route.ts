import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TOKEN_COST_PER_MESSAGE } from '@/lib/tokens'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const body = await req.json()
  const content = typeof body.content === 'string' ? body.content.trim() : ''
  const character = typeof body.character === 'string' ? body.character.trim() : ''

  if (!content || !character) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('send_chat_message', {
    p_content: content,
    p_character: character,
    p_token_cost: TOKEN_COST_PER_MESSAGE,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data?.success) {
    const status = data?.error === 'insufficient_tokens' ? 402 : 400
    return NextResponse.json(
      {
        error: data?.error ?? 'send_failed',
        balance: data?.balance ?? null,
      },
      { status }
    )
  }

  return NextResponse.json({
    success: true,
    balance: data.balance,
    messageId: data.message_id,
  })
}
