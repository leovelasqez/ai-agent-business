import type { MockupGeneration } from "@/lib/types";

export const mockGeneration: MockupGeneration = {
  id: "gen_mock_123",
  preset: "clean_studio",
  sourceImageUrl: "/mock/source-image.jpg",
  previewUrls: [
    "/mock/preview-1.jpg",
    "/mock/preview-2.jpg",
    "/mock/preview-3.jpg",
    "/mock/preview-4.jpg",
  ],
  finalUrls: [],
  status: "completed",
  createdAt: new Date().toISOString(),
  category: "skincare",
  format: "4:5 portrait",
  productName: "Hydrating Face Serum",
};
