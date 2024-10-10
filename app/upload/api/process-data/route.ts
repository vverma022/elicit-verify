import { NextResponse } from 'next/server'

interface CsvJson {
  [key: string]: string
}

export async function POST(req: Request) {
  try {
    const { data }: { data: CsvJson[] } = await req.json()
    console.log('Received JSON data:', data)

    // Process the JSON data as needed
    return NextResponse.json({ message: 'File uploaded and processed successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Error processing upload:', error)
    return NextResponse.json({ error: 'An error occurred while processing the upload.' }, { status: 500 })
  }
}