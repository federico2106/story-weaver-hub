import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/requireAdmin'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { supabase } = auth

  const [progressRes, charactersRes, generationsRes] = await Promise.all([
    supabase.from('game_progress').select('user_id'),
    supabase.from('custom_characters').select('user_id'),
    supabase.from('content_generations').select('type')
  ])

  if (progressRes.error) {
    return NextResponse.json({ error: progressRes.error.message }, { status: 500 })
  }
  if (charactersRes.error) {
    return NextResponse.json({ error: charactersRes.error.message }, { status: 500 })
  }
  if (generationsRes.error) {
    return NextResponse.json({ error: generationsRes.error.message }, { status: 500 })
  }

  const progress = progressRes.data || []
  const characters = charactersRes.data || []
  const generations = generationsRes.data || []

  const usuariosConsumiendoHistorias = new Set(progress.map(p => p.user_id)).size
  const usuariosCreandoPersonajes = new Set(characters.map(c => c.user_id)).size

  const generacionesPorTipo = { image: 0, video: 0 }
  for (const g of generations) {
    if (g.type === 'image') generacionesPorTipo.image += 1
    if (g.type === 'video') generacionesPorTipo.video += 1
  }

  return NextResponse.json({
    consumoHistorias: {
      escenasDesbloqueadas: progress.length,
      usuarios: usuariosConsumiendoHistorias
    },
    creacionPersonajes: {
      totalCreados: characters.length,
      usuarios: usuariosCreandoPersonajes
    },
    generacionesContenido: generacionesPorTipo
  })
}
