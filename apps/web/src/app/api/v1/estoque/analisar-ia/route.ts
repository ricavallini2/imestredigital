import { NextResponse } from 'next/server';
import { analisarEstoqueIA } from '../_mock-data';

export async function GET() {
  return NextResponse.json(analisarEstoqueIA());
}
