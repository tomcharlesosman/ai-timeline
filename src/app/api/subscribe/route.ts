import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // TODO: Connect to email service (ConvertKit, Mailchimp, Resend, etc.)
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'AI Timeline <updates@aitimeline.com>',
    //   to: email,
    //   subject: 'Confirm your subscription',
    //   html: '<p>Click to confirm...</p>'
    // });

    // For now, simulate successful subscription
    console.log('New subscriber:', email);

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
