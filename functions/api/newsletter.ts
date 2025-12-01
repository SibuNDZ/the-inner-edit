/**
 * Newsletter Subscription Handler - Cloudflare Worker
 * Handles newsletter signups and stores in D1 database
 */

interface NewsletterData {
  email: string;
  name?: string;
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
    const data: NewsletterData = await request.json();

    // Validate email
    if (!data.email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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

    // Check if already subscribed
    if (env.DB) {
      const existing = await env.DB.prepare(
        'SELECT id FROM subscribers WHERE email = ? AND active = 1'
      ).bind(data.email).first();

      if (existing) {
        return new Response(
          JSON.stringify({ 
            error: 'This email is already subscribed' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Add to database
      await env.DB.prepare(`
        INSERT INTO subscribers (email, name, source)
        VALUES (?, ?, 'website')
      `).bind(
        data.email,
        data.name || null
      ).run();
    }

    // Send welcome email via Resend
    if (env.RESEND_API_KEY) {
      await sendWelcomeEmail(data, env.RESEND_API_KEY);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed!' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function sendWelcomeEmail(data: NewsletterData, apiKey: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The Inner Edit <hello@theinneredit.com>',
      to: data.email,
      subject: 'Welcome to The Editor\'s Note',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Georgia, serif; color: #2A2A2A; line-height: 1.7; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            h1 { font-size: 32px; margin-bottom: 20px; }
            .subtitle { font-style: italic; color: #C8B58B; margin-bottom: 30px; }
            p { margin-bottom: 20px; }
            .signature { margin-top: 40px; font-style: italic; }
            .footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #E9E2DB; font-size: 14px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to The Inner Circle</h1>
            <p class="subtitle">The Editor's Note</p>
            
            <p>Dear ${data.name || 'Friend'},</p>
            
            <p>
              Thank you for joining The Inner Circle. I'm honored to have you here.
            </p>
            
            <p>
              Once a month, you'll receive a thoughtfully crafted note—a space for 
              deeper reflections, early access to new collections, and invitations 
              to slow down and edit life with intention.
            </p>
            
            <p>
              In the meantime, I invite you to explore the journal and discover 
              the collection of objects designed to bring ritual into everyday moments.
            </p>
            
            <p class="signature">
              With intention,<br>
              The Inner Edit
            </p>
            
            <div class="footer">
              <p>
                You're receiving this because you subscribed to The Editor's Note 
                at theinneredit.com. <a href="#">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    console.error('Failed to send welcome email');
  }
}
