import ImageKit from "imagekit";
import { NextResponse } from "next/server";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 *
 * @param {NextRequest} req
 */
export async function POST(req) {
  const formData = await req.formData();
  const img = formData.get("image");
  const imagekitRes = await imagekit.upload({
    file: Buffer.from(await img.arrayBuffer()),
    fileName: img.name,
    folder: process.env.IMAGEKIT_FOLDER,
  });
  return NextResponse.json(imagekitRes);
}

/**
 *
 * @param {NextRequest} req
 */
export async function DELETE(req) {
  const fileId = req.nextUrl.searchParams.get("fileId");

  const imagekitRes = await imagekit.deleteFile(fileId);

  return NextResponse.json(imagekitRes);
}

