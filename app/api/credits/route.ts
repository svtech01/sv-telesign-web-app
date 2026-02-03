import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
 try {
  
  const res = await fetch(`${API_URL}credits`);
  const result = await res.json();

  console.log("Backend Response: ", result);
  
  return NextResponse.json(result);

 } catch (error) {
  return NextResponse.json(error, { status: 500 });
 }
}