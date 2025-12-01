/**
 * Contact Form Handler - Cloudflare Worker
 * Handles form submissions and sends emails via Resend API
 */

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse form data
    const data: ContactFormData = await request.json();

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Send email via Resend
    if (env.RESEND_API_KEY) {
      await sendEmail(data, env.RESEND_API_KEY);
    }

    // Store in D1 database if available
    if (env.DB) {
      await storeContact(data, env.DB);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message!' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function sendEmail(data: ContactFormData, apiKey: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'contact@theinneredit.com',
      to: 'hello@theinneredit.com',
      subject: `Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}

async function storeContact(data: ContactFormData, db: any) {
  await db.prepare(`
    INSERT INTO contacts (name, email, subject, message, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).bind(
    data.name,
    data.email,
    data.subject,
    data.message
  ).run();
}
