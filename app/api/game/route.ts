import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el prompt del usuario' }, { status: 400 })
    }

    // Configuración para Ollama local (puedes cambiar la URL o el modelo si usas otro servicio)
    const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate'
    const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3' // O el modelo que tengas instalado localmente

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `${systemPrompt || ''}\n\nUsuario: ${prompt}\nRespuesta:`,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Error en el servidor de IA local: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.response || 'Sin respuesta del modelo.'

    return NextResponse.json({ response: aiResponse })

  } catch (error: any) {
    console.error('Error en la API route /api/game:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno al procesar la solicitud con la IA.' },
      { status: 500 }
    )
  }
}