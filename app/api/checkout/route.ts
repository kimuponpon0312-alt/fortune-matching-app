import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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

    // Stripe SDKを初期化
    const stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // オリジンを取得
    const origin = request.headers.get('origin') || request.headers.get('host') 
      ? `https://${request.headers.get('host')}` 
      : 'http://localhost:3000';

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
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        planType: planType,
      },
      customer_email: body.email || undefined, // オプション：メールアドレスがあれば設定
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
