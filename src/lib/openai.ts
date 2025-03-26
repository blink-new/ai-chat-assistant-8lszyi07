
import OpenAI from 'openai';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend
});

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function* streamChat(messages: Message[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
    stream: true,
  });

  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || '';
  }
}