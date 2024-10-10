import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure this path matches where you placed your prisma.ts file


// types.ts
export interface CsvJson {
  'Team Name': string;
  'Candidate Name': string;
  'Candidate Email': string;
}

export async function POST(req: Request) {
  try {
    const { data }: { data: CsvJson[] } = await req.json();

    // Process the JSON data and save to the database
    const candidates = await prisma.candidate.createMany({
      data: data.map(item => ({
        teamName: item['Team Name'] || '',
        candidateName: item['Candidate Name'] || '',
        candidateEmail: item['Candidate Email'] || ''
      })),
    });

    return NextResponse.json({ message: 'File uploaded and processed successfully.', candidates }, { status: 200 });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'An error occurred while processing the upload.' }, { status: 500 });
  }
}