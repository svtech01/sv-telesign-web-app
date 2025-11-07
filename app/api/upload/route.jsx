import { NextResponse } from "next/server";
import { supabase } from "../../config/supabase";

const API_URL = process.env.API_URL;

export async function POST(req) {
  try {
    
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const bucket = "uploads"; // change to your bucket name
    const filePath = `${Date.now()}-${fileName}`;

    // 1️⃣ Create an *upload URL* valid for 60 seconds
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error) {
      console.log("Create Signed Error", error);
      return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: filePath,
    });

  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}