import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

function getMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;

  // Reject anything that looks like a traversal attempt
  if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const absolutePath = path.join(uploadsDir, file);

  // Double-check the resolved path is still inside uploadsDir
  if (!absolutePath.startsWith(uploadsDir + path.sep) && absolutePath !== uploadsDir) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    await stat(absolutePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = await readFile(absolutePath);
  const ext = path.extname(file);
  const contentType = getMimeType(ext);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
