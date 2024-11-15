import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { Category } from '@/lib/store';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as Category;
  const description = searchParams.get('description') || '';

  // For demo purposes, return a mock solution if no API key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      solution: `Mock AI Solution for ${category} issue:\n\n1. Analyzed the problem: "${description}"\n2. Recommended steps:\n   - Check system logs\n   - Verify configurations\n   - Test connectivity\n   - Restart services if needed\n\nNote: This is a mock solution. Add OPENAI_API_KEY to enable real AI suggestions.`,
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert IT support specialist. Provide a clear, step-by-step solution for the following incident in the ${category} category. Focus on practical troubleshooting steps and potential fixes.`,
        },
        {
          role: 'user',
          content: `Please suggest a solution for this issue: ${description}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const solution = completion.choices[0].message.content;
    return NextResponse.json({ solution });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get AI solution' },
      { status: 500 }
    );
  }
}