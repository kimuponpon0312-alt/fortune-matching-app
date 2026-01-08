import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, planType } = body;

    // Stripeのシークレットキーを環境変数から取得
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
        { status: 500 }
      );
    }

    // Stripe SDKを動的にインポート
    const stripe = (await import('stripe')).default;
    const stripeClient = new stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
    });

    // チェックアウトセッションを作成
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Stripeで作成した価格ID（price_...）
          quantity: 1,
        },
      ],
      mode: planType === 'subscription' ? 'subscription' : 'payment',
      success_url: `${request.headers.get('origin') || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin') || 'http://localhost:3000'}/cancel`,
      metadata: {
        planType: planType,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
