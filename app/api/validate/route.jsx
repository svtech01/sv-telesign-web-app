import { NextResponse } from "next/server";
import { supabase } from "../../config/supabase";

const API_URL = process.env.API_URL;

export async function POST(req) {
 try {
  
  const body = await req.json();

  console.log("Getting File Path:", body?.file);
  
  // // ✅ Step 3 — Create a downloadable signed URL for processing
  // const { data, error } = await supabase.storage
  //     .from("uploads")
  //     .createSignedUrl(body?.file, 60 * 30); // 30 minutes

  // if (error){
  //   console.log(error)
  //   return NextResponse.json(error, { status: 500 });
  // }

  // const fileUrl =  body?.fileUrl

  console.log("Got downloadable file name: ", body?.fileUrl)
  
  const res = await fetch(`${API_URL}upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // ✅ this is crucial
    },
    body: JSON.stringify({...body }),
  });
  const result = await res.json();
  console.log("Backend Response: ", result);
  
  return NextResponse.json(result);
  // return NextResponse.json({})
 } catch (error) {
  return NextResponse.json(error, { status: 500 });
 }
}