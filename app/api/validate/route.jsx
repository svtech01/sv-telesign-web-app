import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function POST(req) {
 try {
  
  const body = await req.json();

  console.log("/api/validate request body", body)

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