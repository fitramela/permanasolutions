import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("DATA FORM:", data);

    return NextResponse.json({
      success: true,
      message: "Form berhasil dikirim",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim form",
      },
      {
        status: 500,
      }
    );
  }
}