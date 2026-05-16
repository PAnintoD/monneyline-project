import { NextResponse } from 'next/server';

// สำหรับการดึงข้อมูล (GET Request)
export async function GET(request: Request) {
    // รับ Search Params (ถ้ามี)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Logic การดึงข้อมูล
    const data = { message: "Success", id: id || "No ID provided" };

    return NextResponse.json(data, { status: 200 });
}

// สำหรับการสร้างข้อมูลหรือรับ Form (POST Request)
export async function POST(request: Request) {
    try {
        // การดึง Body จาก Request
        const body = await request.json();

        // Logic การบันทึกข้อมูล
        // const savedData = await db.create(body);

        return NextResponse.json({ message: "Data received", data: body }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
}