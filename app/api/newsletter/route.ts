import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '../../lib/validations';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the form data
    const validatedData = newsletterSchema.parse(data);
    
    // Log the newsletter signup
    console.log('Newsletter signup:', {
      email: validatedData.email,
      timestamp: new Date().toISOString(),
      source: 'landing_page',
    });

    // Send email to rizkyfedp@gmail.com
    await sendNewsletterSignupEmail({
      to: 'rizkyfedp@gmail.com',
      from: validatedData.email,
      subject: 'New Newsletter Signup from LockIn Landing Page',
      userEmail: validatedData.email,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    console.error('Error processing newsletter signup:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to subscribe to newsletter. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Function to send newsletter signup email
async function sendNewsletterSignupEmail({
  to,
  from,
  subject,
  userEmail,
}: {
  to: string;
  from: string;
  subject: string;
  userEmail: string;
}) {
  // In a real application, you would use a service like:
  // - SendGrid
  // - Nodemailer with SMTP
  // - AWS SES
  // - Resend
  // - EmailJS
  
  // For now, we'll use a simple console log and simulate email sending
  console.log('📧 NEWSLETTER SIGNUP NOTIFICATION');
  console.log('==================================');
  console.log(`To: ${to}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`User Email: ${userEmail}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('==================================');
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, replace this with actual email service:
  /*
  const emailService = new EmailService({
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.FROM_EMAIL,
  });
  
  await emailService.send({
    to,
    subject,
    html: `
      <h2>New Newsletter Signup from LockIn Landing Page</h2>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <hr>
      <p><em>Sent from LockIn Landing Page</em></p>
    `,
  });
  */
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Newsletter API is running',
    timestamp: new Date().toISOString()
  });
}
