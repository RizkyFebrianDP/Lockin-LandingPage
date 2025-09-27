import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Log web vitals data (in production, send to analytics service)
    console.log('Web Vitals Data:', {
      url: data.url,
      timestamp: new Date(data.timestamp).toISOString(),
      metrics: data.metrics,
      userAgent: data.userAgent,
      connection: data.connection,
    });

    // Here you would typically:
    // 1. Validate the data
    // 2. Store in database
    // 3. Send to analytics service (Google Analytics, etc.)
    // 4. Process for performance monitoring

    // Example: Send to MCP server
    // await mcpClient.trackPerformanceMetrics(data);

    // Example: Store in database
    // await db.webVitals.create({ data });

    // Example: Send to external analytics
    // await sendToGoogleAnalytics(data);

    return NextResponse.json({ 
      success: true, 
      message: 'Web vitals data received' 
    });
  } catch (error) {
    console.error('Error processing web vitals data:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process web vitals data' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'web-vitals-analytics',
    timestamp: new Date().toISOString()
  });
}

// Example function to send data to Google Analytics
async function sendToGoogleAnalytics(data: any) {
  // This is a placeholder - implement actual GA4 integration
  const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
  const GA_API_SECRET = process.env.GA_API_SECRET;
  
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
    console.warn('Google Analytics credentials not configured');
    return;
  }

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: generateClientId(data.userAgent),
          events: data.metrics.map((metric: any) => ({
            name: 'web_vital',
            params: {
              metric_name: metric.name,
              metric_value: metric.value,
              metric_rating: metric.rating,
              page_location: data.url,
            },
          })),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GA request failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send data to Google Analytics:', error);
  }
}

// Generate a consistent client ID from user agent
function generateClientId(userAgent: string): string {
  // Simple hash function for demo - use a proper UUID in production
  let hash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    const char = userAgent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
}