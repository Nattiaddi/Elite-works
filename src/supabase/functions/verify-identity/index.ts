import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/openai@4.28.0"

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

serve(async (req) => {
  const { imageUrl, fullName } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analyze this ID document. Does the name on the ID match "${fullName}"? 
                     Is it a valid looking government ID? 
                     Answer in JSON format: { "verified": true/false, "reason": "text" }` 
            },
            { 
              type: "image_url", 
              image_url: { url: imageUrl } 
            },
          ],
        },
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});