import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, characterName } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    const replyContent = `Hola, soy ${characterName}. Recibí tu mensaje: "${lastMessage}". ¡El chat funciona perfectamente en modo local!`;

    return NextResponse.json({
      role: 'assistant',
      content: replyContent,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}