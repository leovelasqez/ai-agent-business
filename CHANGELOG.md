# Changelog

All notable changes to MockForge are documented here.

## [0.0.1.0] - 2026-04-05

### Added
- 9:16 Story (Instagram) format option across the full generation stack — form, model config, and GPT Image 1 size mapping
- Per-mockup download button in results view
- Unit tests for `mapFormatToResolutionMode` and `mapFormatToGptImageSize`
- Unified `npm test` runner

### Changed
- Preset prompts rewritten to explicitly instruct background-only edits ("Replace ONLY the background") and stronger label preservation rules
- GPT Image 1 (variant C) now requests `quality: "high"` and passes `image_size` matching the selected format
- Results view switches to `object-contain` + `aspect-square` so generated images aren't cropped
- Repo docs consolidated: `CLAUDE.md` at root, old `CLAUDE-CODE.md` and `mockforge/CLAUDE.md` removed
- gstack skills added: `.agents/` directory and `skills-lock.json`

### Fixed
- Path traversal vulnerability in `resolveFalImageUrl`: validates resolved path stays within `public/uploads/` before reading
- Prompt injection via `productName`/`category`: inputs are now sanitized (100 char limit, safe character allowlist)
