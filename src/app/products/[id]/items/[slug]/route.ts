import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
export async function GET(request: Request, { params }: any) {
  const id = params.slug;

  const buffer = await readFile(
    path.join(process.cwd(), "src/app/assets", "image.png")
  );

  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="image.png"');
  headers.append("Content-Type", "image/png");

  return new Response(buffer, {
    headers,
  });
}
