import { NextResponse } from "next/server";

const OPENAPI_SPEC = {
  openapi: "3.1.0",
  info: {
    title: "MockForge API",
    version: "1.0.0",
    description:
      "Generate professional product mockups using AI. " +
      "Authenticate with a Bearer API key obtained from your MockForge dashboard.",
    contact: { url: "https://mockforge.ai" },
  },
  servers: [{ url: process.env.NEXT_PUBLIC_APP_URL ?? "https://mockforge.ai", description: "Production" }],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "API Key",
        description: "Pass your MockForge API key as a Bearer token.",
      },
    },
    schemas: {
      GenerationResult: {
        type: "object",
        properties: {
          generationId: { type: "string", format: "uuid" },
          previewUrls: { type: "array", items: { type: "string", format: "uri" } },
          model: { type: "string" },
          variant: { type: "string", enum: ["a", "b", "c"] },
          variantLabel: { type: "string" },
          prompt: { type: "string" },
          preset: { type: "string" },
          sourceImageUrl: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: false },
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/api/v1/generate": {
      post: {
        summary: "Generate a product mockup",
        description:
          "Takes a product image and generates a professional mockup using the selected AI model variant.",
        operationId: "generateMockup",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["sourceImageUrl", "preset"],
                properties: {
                  sourceImageUrl: {
                    type: "string",
                    description: "URL of the product image to transform.",
                    example: "https://cdn.example.com/my-product.jpg",
                  },
                  preset: {
                    type: "string",
                    enum: ["clean_studio", "lifestyle_scene", "ad_creative", "custom"],
                    description: "Visual style preset for the generated mockup.",
                    default: "clean_studio",
                  },
                  variant: {
                    type: "string",
                    enum: ["a", "b", "c"],
                    description:
                      "AI model variant. a=Nano Banana 2 (fast), b=GPT Image (precise), c=FLUX.2 Pro (quality).",
                    default: "a",
                  },
                  category: { type: "string", description: "Product category hint.", example: "skincare" },
                  format: {
                    type: "string",
                    enum: ["1:1", "4:5", "9:16", "16:9"],
                    description: "Output image aspect ratio.",
                    default: "1:1",
                  },
                  productName: { type: "string", description: "Product name for prompt context.", example: "Vitamin C Serum" },
                  customPrompt: { type: "string", description: "Custom prompt override (used when preset=custom)." },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Generation successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/GenerationResult" },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Invalid or missing API key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "429": { description: "Rate limit or daily limit exceeded", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "500": { description: "Generation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};

export function GET() {
  return NextResponse.json(OPENAPI_SPEC, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
