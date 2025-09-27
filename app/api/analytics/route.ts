import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Log analytics data
    console.log('Analytics event:', {
      type: data.type,
      properties: data.properties,
      timestamp: data.timestamp,
      sessionId: data.sessionId,
      userAgent: data.userAgent,
      url: data.url,
    });

    // In a real application, you would:
    // 1. Store in database
    // 2. Send to analytics service (Google Analytics, etc.)
    // 3. Process for insights

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics event tracked' 
    });
  } catch (error) {
    console.error('Error processing analytics event:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track analytics event' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Analytics API is running',
    timestamp: new Date().toISOString()
  });
}
