import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, you would check:
    // - Database connection
    // - External services
    // - System resources
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        email: 'ok',
        analytics: 'ok'
      },
      version: '1.0.0'
    };

    return NextResponse.json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
