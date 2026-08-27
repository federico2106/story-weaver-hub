import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CHARACTER_PROMPTS: Record<string, string> = {
  elena: "Eres Elena, un personaje centrado en el romance profundo y emocional. Tus respuestas son cálidas, reflexivas, empáticas y muy atentas a los matices de los sentimientos. Respondé siempre en español, en primera persona, en 2-4 oraciones como máximo.",
  samantha: "Eres Samantha, un personaje enfocado en el drama íntimo y las conversaciones intensas y misteriosas. Respondé siempre en español, en primera persona, en 2-4 oraciones como máximo.",
  akane: "Eres Akane, enérgica amante de las historias de aventura, estilo anime. Respondé siempre en español, en primera persona, en 2-4 oraciones como máximo.",
  victoria: "Eres Victoria, sofisticada, elegante y con aire de misterio. Respondé siempre en español, en primera persona, en 2-4 oraciones como máximo.",
  valentina: "Eres Valentina, apasionada, carismática y de charlas intensas. Respondé siempre en español, en primera persona, en 2-4 oraciones como máximo.",
};

const DEFAULT_PROMPT = "Eres un personaje cálido, atento y conversador. Respondé siempre en español, en primera persona, en 2-4 oraciones como máximo.";

async function getAIReply(characterId: string, conversationHistory: { sender: string; text: string }[], newMessage: string) {
  const systemPrompt = CHARACTER_PROMPTS[characterId] || DEFAULT_PROMPT;

  // Convertimos el historial reciente al formato que espera OpenRouter (estilo OpenAI)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text || ''
    })),
    { role: 'user', content: newMessage }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // Modelo económico para arrancar. Se puede cambiar después por otro de OpenRouter.
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Error de OpenRouter:', response.status, errText);
    throw new Error('El personaje no pudo responder en este momento.');
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('Respuesta vacía del modelo.');
  }

  return reply;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // El usuario se identifica SIEMPRE por la sesión del servidor, nunca por el body.
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

    // 1. Descontar el token de forma atómica y segura vía RPC
    const { data: newBalance, error: spendError } = await supabase.rpc('spend_tokens', {
      amount: 1,
      reason: 'mensaje_chat'
    });

    if (spendError) {
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

    // 3. Traer los últimos mensajes de este chat para dar contexto a la IA
    const { data: recentHistory } = await supabase
      .from('chat_messages')
      .select('sender, text')
      .eq('user_id', user.id)
      .eq('character_id', characterId)
      .order('created_at', { ascending: false })
      .limit(10);

    const orderedHistory = (recentHistory || []).reverse();

    // 4. Generar la respuesta real del personaje vía OpenRouter
    let botReply: string;
    try {
      botReply = await getAIReply(
        characterId,
        orderedHistory,
        audioUrl ? '[el usuario envió una nota de voz]' : message
      );
    } catch (aiError) {
      console.error('Error generando respuesta de IA:', aiError);
      // El mensaje del usuario y el token ya se guardaron; devolvemos un fallback
      // en vez de dejar al usuario sin respuesta y sin saber qué pasó.
      botReply = 'Perdón, se me cortó la conexión un segundo... ¿me repetís eso? 💭';
    }

    // 5. Guardar la respuesta del bot
    const { error: botMsgError } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      character_id: characterId,
      sender: 'bot',
      text: botReply,
      audio_url: null
    });

    if (botMsgError) {
      console.error('Error guardando respuesta del bot:', botMsgError.message);
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