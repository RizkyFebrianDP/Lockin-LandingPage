import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, you would fetch dynamic content from:
    // - CMS (Contentful, Strapi, etc.)
    // - Database
    // - External API
    
    const content = {
      testimonials: [
        {
          id: 1,
          text: "LockIn has completely transformed my productivity! My days are so much more organized and focused.",
          author: "Sarah Johnson",
          role: "Product Manager",
          company: "TechCorp"
        }
      ],
      features: [
        {
          id: 1,
          title: "Smart Task Management",
          description: "Organize and prioritize your tasks with AI-powered insights"
        }
      ]
    };

    return NextResponse.json({ 
      success: true, 
      data: content,
      message: 'Content data retrieved' 
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch content' 
      },
      { status: 500 }
    );
  }
}
