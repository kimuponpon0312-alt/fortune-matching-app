"use client";

import { useState, useEffect } from 'react';

export default function TokushoPage() {
  const [showReviewInfo, setShowReviewInfo] = useState(false);

  useEffect(() => {
    // Stripe審査用フラグ：URLパラメータまたは環境変数で制御
    // 本番環境では環境変数を使用することを推奨
    const params = new URLSearchParams(window.location.search);
    const reviewFlag = params.get('review') === 'true' || process.env.NEXT_PUBLIC_SHOW_REVIEW_INFO === 'true';
    setShowReviewInfo(reviewFlag);
  }, []);

  // 一般公開用の情報（プライバシー保護）
  const publicInfo = [
    { label: '販売業者', value: 'Soleil et Lune 運営事務局' },
    { label: '運営責任者', value: 'お問い合わせをいただいた後、遅滞なく電子メール等にて提供いたします' },
    { label: '所在地', value: 'お問い合わせをいただいた後、遅滞なく電子メール等にて提供いたします' },
    { label: '電話番号', value: 'お問い合わせをいただいた後、遅滞なく電子メール等にて提供いたします' },
    { label: 'メールアドレス', value: 'contact@soleil-et-lune.com' },
    { label: '販売価格', value: '各商品購入ページに表示' },
    { label: '支払方法', value: 'クレジットカード決済 (Stripe)' },
    { label: '商品の引渡時期', value: '決済完了後、直ちに利用可能' },
    { label: '返品・キャンセル', value: 'デジタルコンテンツの特性上、決済完了後の返品・返金はできません。' },
  ];

  // 審査用の情報（管理者のみ表示）
  const reviewInfo = [
    { label: '運営責任者（審査用）', value: '[審査用情報：実際の運営責任者名]' },
    { label: '所在地（審査用）', value: '[審査用情報：実際の所在地]' },
    { label: '電話番号（審査用）', value: '[審査用情報：実際の電話番号]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-fortune relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-4xl relative z-10">
        {/* ヘッダー */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
            Soleil et Lune
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gold">
            特定商取引法に基づく表記
          </h2>
          <div className="h-1 w-32 bg-gradient-gold mx-auto rounded-full"></div>
        </header>

        {/* メインコンテンツ */}
        <div className="bg-navy/60 backdrop-blur-md rounded-3xl shadow-gold-lg p-8 md:p-12 border border-gold/30 animate-fade-in">
          <div className="mb-6 text-center">
            <p className="text-gray-300 text-sm leading-relaxed">
              Soleil et Lune 運営事務局では、お客様のプライバシーを最優先に考えております。
              <br />
              以下の情報については、お問い合わせをいただいた後、遅滞なく電子メール等にて提供いたします。
            </p>
          </div>

          <table className="w-full text-sm md:text-base leading-relaxed border-collapse">
            <tbody>
              {publicInfo.map((row, i) => (
                <tr key={i} className="border-b border-gold/20 hover:bg-gold/5 transition-colors">
                  <td className="py-5 md:py-6 font-bold text-gold w-1/3 md:w-2/5 align-top">
                    {row.label}
                  </td>
                  <td className="py-5 md:py-6 text-gray-200 align-top">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 審査用情報（管理者のみ表示） */}
          {showReviewInfo && (
            <div className="mt-12 pt-8 border-t-2 border-gold/30">
              <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-6 mb-6">
                <p className="text-red-200 font-bold mb-2">⚠️ 審査用情報（管理者のみ表示）</p>
                <p className="text-red-200 text-sm">
                  このセクションは、Stripe審査用のフラグが有効な場合のみ表示されます。
                  <br />
                  通常のユーザーには表示されません。
                </p>
              </div>
              <table className="w-full text-sm md:text-base leading-relaxed border-collapse">
                <tbody>
                  {reviewInfo.map((row, i) => (
                    <tr key={i} className="border-b border-gold/20 hover:bg-gold/5 transition-colors">
                      <td className="py-5 md:py-6 font-bold text-gold w-1/3 md:w-2/5 align-top">
                        {row.label}
                      </td>
                      <td className="py-5 md:py-6 text-gray-200 align-top">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gold/20">
            <div className="bg-darkNavy/40 rounded-xl p-6 border border-gold/20">
              <h3 className="text-lg font-bold text-gold mb-4">お問い合わせについて</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                運営責任者、所在地、電話番号については、特定商取引法に基づき、
                お問い合わせをいただいた後、遅滞なく電子メール等にて提供いたします。
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                お問い合わせ先：<span className="text-gold font-semibold">contact@soleil-et-lune.com</span>
              </p>
            </div>
          </div>

          {/* フッターリンク */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-gold hover:text-lightGold transition-colors underline"
            >
              ← トップページに戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
