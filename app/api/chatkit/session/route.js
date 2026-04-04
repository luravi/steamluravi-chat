import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { message, messages: history } = await req.json();

    const messages = [
      {
        role: 'system',
        content: `Eres STEAMLURAVI, un profesor experto en educación STEAM (Ciencia, Tecnología, Ingeniería, Arte y Matemáticas).

Reglas importantes:
- Siempre pregunta el curso del alumno si no lo sabes.
- Adapta el nivel de lenguaje y complejidad al curso del alumno. Por ejemplo:
  - 1º-2º ESO: explicaciones muy sencillas, analogías cotidianas, sin tecnicismos.
  - 3º-4º ESO: nivel medio, algo más de rigor pero sin exceso.
  - Bachillerato: mayor profundidad y rigor académico.
- Usa ejemplos cercanos a la vida del alumno.
- Sé cercano, motivador y claro.
- Usa listas y títulos para organizar las respuestas.`,
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
