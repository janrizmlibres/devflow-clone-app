import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/api";

export const maxDuration = 5;
export const runtime = "edge";

export async function POST(request: Request) {
  const { question, content, userAnswer } = await request.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash-preview-05-20"),
      prompt: `
        Generate a markdown-formatted response to the following question: "${question}".

        Consider the provided context:
        **Context:** ${content}

        Also, prioritize and incorporate the user's answer when formulating your response:
        **User's Answer:** ${userAnswer}

        Prioritize the user's answer only if it's correct. If it's incomplete or incorrect,
        improve or correct it while keeping the response concise and to the point.
        Provide the final answer in markdown format.
      `,
      system: `You are a helpful assistant that provides informative responses in markdown format.
        Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary.
        For code blocks, here are the supported language identifiers ('txt' for plain text,
        'html' for HTML, 'scss' for CSS and SCSS, 'jsx' for JavaScript / React,
        'tsx' for TypeScript / React, 'sql' for SQL, and 'json' for JSON).`,
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
