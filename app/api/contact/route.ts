import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '../../lib/validations';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(data);
    
    // Log the feedback data
    console.log('Feedback received:', {
      email: validatedData.email,
      message: validatedData.message,
      timestamp: new Date().toISOString(),
      source: 'landing_page',
    });

    // Send email to rizkyfedp@gmail.com
    await sendFeedbackEmail({
      to: 'rizkyfedp@gmail.com',
      from: validatedData.email,
      subject: 'New Feedback from LockIn Landing Page',
      message: validatedData.message || 'No message provided',
      userEmail: validatedData.email,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback sent successfully!' 
    });
  } catch (error) {
    console.error('Error processing feedback:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send feedback. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Function to send feedback email
async function sendFeedbackEmail({
  to,
  from,
  subject,
  message,
  userEmail,
}: {
  to: string;
  from: string;
  subject: string;
  message: string;
  userEmail: string;
}) {
  // In a real application, you would use a service like:
  // - SendGrid
  // - Nodemailer with SMTP
  // - AWS SES
  // - Resend
  // - EmailJS
  
  // For now, we'll use a simple console log and simulate email sending
  console.log('📧 EMAIL NOTIFICATION');
  console.log('====================');
  console.log(`To: ${to}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log(`User Email: ${userEmail}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('====================');
  
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
      <h2>New Feedback from LockIn Landing Page</h2>
      <p><strong>From:</strong> ${userEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><em>Sent from LockIn Landing Page at ${new Date().toISOString()}</em></p>
    `,
  });
  */
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Contact API is running',
    timestamp: new Date().toISOString()
  });
}

