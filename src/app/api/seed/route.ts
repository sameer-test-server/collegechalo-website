import { NextResponse } from 'next/server';
import { seedColleges } from '../../../lib/seed';

export async function POST() {
  try {
    const result = await seedColleges();
    
    if (result.success) {
      return NextResponse.json({ success: true, data: result });
    } else {
      return NextResponse.json({ success: false, error: result.error || result.message }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
