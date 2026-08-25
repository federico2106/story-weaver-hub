import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CHARACTER_PROMPTS: Record<string, string> = {
  elena: "Eres Elena, un personaje centrado en el romance profundo y emocional. Tus respuestas son cálidas, reflexivas, empáticas y muy atentas a los matices de los sentimientos.",
  samantha: "Eres Samantha, un personaje enfocado en el drama íntimo y las conversaciones intensas y misteriosas."
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // El usuario se identifica SIEMPRE por la sesión del servidor, nunca por el body.
    // Esto es lo que impide que alguien mande un userId ajeno y opere en nombre de otra persona.
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const body = await req.json();
    const { message, characterId, audioUrl } = body;

    if (!message && !audioUrl) {
      return NextResponse.json({ error: 'Mensaje vacío.' }, { status: 400 });
    }
    if (!characterId) {
      return NextResponse.json({ error: 'Falta characterId.' }, { status: 400 });
    }

    // 1. Descontar el token de forma atómica y segura vía RPC (misma función que ya usa el resto de la app)
    const { data: newBalance, error: spendError } = await supabase.rpc('spend_tokens', {
      amount: 1,
      reason: 'mensaje_chat'
    });

    if (spendError) {
      // spend_tokens lanza excepción si no hay saldo suficiente o el monto es inválido
      return NextResponse.json({ error: 'Sin tokens suficientes o error de saldo.' }, { status: 403 });
    }

    // 2. Guardar el mensaje del usuario
    const { error: userMsgError } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      character_id: characterId,
      sender: 'user',
      text: audioUrl ? null : message,
      audio_url: audioUrl || null
    });

    if (userMsgError) {
      console.error('Error guardando mensaje del usuario:', userMsgError.message);
      return NextResponse.json({ error: 'Error guardando el mensaje.' }, { status: 500 });
    }

    // 3. Generar la respuesta del bot.
    // Placeholder por ahora: reemplazar este bloque por la llamada real al proveedor de IA
    // (OpenAI/Anthropic/etc.) usando CHARACTER_PROMPTS[characterId] como system prompt.
    const botReply = `Me encantó leerte... Cada mensaje tuyo hace mi día mucho mejor 💖`;

    // 4. Guardar la respuesta del bot
    const { error: botMsgError } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      character_id: characterId,
      sender: 'bot',
      text: botReply,
      audio_url: null
    });

    if (botMsgError) {
      console.error('Error guardando respuesta del bot:', botMsgError.message);
      // No devolvemos error al usuario por esto: el mensaje del usuario ya se guardó
      // y el token ya se descontó; el usuario sí debe ver la respuesta del bot.
    }

    return NextResponse.json({
      success: true,
      reply: botReply,
      remainingTokens: newBalance
    });

  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}