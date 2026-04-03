import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const WORKFLOW_ID = 'wf_69cbc99810488190afeff203befb9dd60bd56349d2118d42';

export async function POST(req) {
  const { message, previousResponseId } = await req.json();

  const params = {
    model: 'gpt-4.1',
    input: message,
    workflow_id: WORKFLOW_ID,
  };

  if (previousResponseId) {
    params.previous_response_id = previousResponseId;
  }

  const response = await client.responses.create(params);

  return Response.json({
    reply: response.output_text,
    responseId: response.id,
  });
}
