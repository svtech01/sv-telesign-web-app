import { NextResponse } from "next/server";

// const api_urls = {
//   "local": "http://127.0.0.1:5000/api/",
//   "staging": "https://sv-telesign-api.vercel.app/api/",
//   "production": "https://sv-telesign-api.vercel.app/api/"
// }

const API_URL = process.env.API_URL;

export async function POST(req) {
  const formData = await req.formData();
  console.log(formData)
  const res = await fetch(`${API_URL}upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data);
}