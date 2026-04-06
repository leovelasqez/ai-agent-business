import assert from "node:assert/strict";
import { mapFormatToResolutionMode, mapFormatToGptImageSize, mapFormatToNanoBananaAspectRatio, DEFAULT_MODEL_D } from "@/lib/model-config";

function run() {
  // mapFormatToResolutionMode
  assert.equal(mapFormatToResolutionMode("9:16 story"), "9:16");
  assert.equal(mapFormatToResolutionMode("9:16"), "9:16");
  assert.equal(mapFormatToResolutionMode("story"), "9:16");
  assert.equal(mapFormatToResolutionMode("4:5 portrait"), "4:5");
  assert.equal(mapFormatToResolutionMode("4:5"), "4:5");
  assert.equal(mapFormatToResolutionMode("1:1 square"), "1:1");
  assert.equal(mapFormatToResolutionMode(undefined), "match_input");

  // mapFormatToGptImageSize
  assert.equal(mapFormatToGptImageSize("9:16 story"), "1024x1536");
  assert.equal(mapFormatToGptImageSize("9:16"), "1024x1536");
  assert.equal(mapFormatToGptImageSize("4:5 portrait"), "1024x1536");
  assert.equal(mapFormatToGptImageSize("1:1 square"), "1024x1024");
  assert.equal(mapFormatToGptImageSize(undefined), "1024x1024");

  // mapFormatToNanoBananaAspectRatio
  assert.equal(mapFormatToNanoBananaAspectRatio("9:16 story"), "9:16");
  assert.equal(mapFormatToNanoBananaAspectRatio("9:16"), "9:16");
  assert.equal(mapFormatToNanoBananaAspectRatio("story"), "9:16");
  assert.equal(mapFormatToNanoBananaAspectRatio("4:5 portrait"), "4:5");
  assert.equal(mapFormatToNanoBananaAspectRatio("4:5"), "4:5");
  assert.equal(mapFormatToNanoBananaAspectRatio("1:1 square"), "1:1");
  assert.equal(mapFormatToNanoBananaAspectRatio(undefined), "1:1");

  // DEFAULT_MODEL_D env fallback
  assert.equal(DEFAULT_MODEL_D, process.env.FAL_MODEL_D || "fal-ai/nano-banana-2/edit");

  console.log("model-config test passed");
}

run();
