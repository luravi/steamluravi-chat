import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { message, messages: history } = await req.json();

    const messages = [
      {
        role: 'system',
        content: 'Eres STEAMLURAVI, un profesor experto en educación STEAM (Ciencia, Tecnología, Ingeniería, Arte y Matemáticas). Ayudas a estudiantes y profesores con explicaciones claras, actividades creativas y recursos educativos.',
      },
      ...(history || []),
      { role: 'user', content: message },
    ];

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    return Response.json({
      reply: completion.choices[0].message.content,
      messages: [...(history || []), { role: 'user', content: message }, completion.choices[0].message],
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
