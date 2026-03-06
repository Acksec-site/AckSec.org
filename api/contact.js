export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, website, plan, message } = await req.json();

    // Validate required fields (now includes plan)
    if (!name || !email || !message || !plan) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format plan for display
    const planLabels = {
      'unsure': "Not sure — needs guidance",
      'starter': "Starter (CHF 75)",
      'professional': "Professional (CHF 150)",
      'enterprise': "Enterprise (CHF 500)",
      'custom': "Custom (Quote)",
    };
    const planDisplay = planLabels[plan] || plan;

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AckSec Contact Form <contact@acksec.org>',
        to: ['info@acksec.org'],
        subject: `[${planDisplay}] New Contact: ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; vertical-align: top;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; vertical-align: top;">Email:</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; vertical-align: top;">Website:</td>
              <td style="padding: 8px 0;">${website || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; vertical-align: top; color: #10b981;">Interested In:</td>
              <td style="padding: 8px 0; color: #10b981; font-weight: bold;">${planDisplay}</td>
            </tr>
          </table>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 16px; border-left: 4px solid #10b981;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        `,
        reply_to: email,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
