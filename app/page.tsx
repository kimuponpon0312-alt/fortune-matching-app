"use client";

import { useState, useEffect, useRef } from "react";
import {
  calculateTenkan,
  getCompatibleTenkan,
  validateBirthDate,
  getFortuneDetails,
  TENKAN_NAMES,
  TENKAN_DESCRIPTIONS,
  type Tenkan,
} from "./lib/fourPillars";

// 性別の型定義
export type Gender = "male" | "female" | "other";
export type LookingFor = "male" | "female" | "all";

// プロフィールデータの型定義
interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  occupation: string;
  description: string;
  compatibility: number;
  type: string;
  avatar: string;
  gender: Gender;
}

// 架空のプロフィールデータ（30〜50代向け）
const PROFILES: Profile[] = [
  {
    id: 1,
    name: "雅人",
    age: 42,
    location: "東京都",
    occupation: "経営コンサルタント",
    description: "落ち着いた雰囲気で、知的な会話を楽しめる方。読書とクラシック音楽が趣味です。",
    compatibility: 95,
    type: "宝石",
    avatar: "👨‍💼",
    gender: "male",
  },
  {
    id: 2,
    name: "美咲",
    age: 38,
    location: "神奈川県",
    occupation: "インテリアデザイナー",
    description: "上品で洗練された趣味の持ち主。アートや文化に造詣が深く、優雅な時間を大切にします。",
    compatibility: 92,
    type: "太陽",
    avatar: "👩‍🎨",
    gender: "female",
  },
  {
    id: 3,
    name: "健一",
    age: 45,
    location: "千葉県",
    occupation: "医師",
    description: "誠実で責任感が強く、人を思いやる心を持った方。安定感があり、信頼できるパートナーです。",
    compatibility: 90,
    type: "大地",
    avatar: "👨‍⚕️",
    gender: "male",
  },
  {
    id: 4,
    name: "由美",
    age: 40,
    location: "東京都",
    occupation: "大学教授",
    description: "知性と優しさを兼ね備えた方。学問と文化に深い関心を持ち、豊かな教養があります。",
    compatibility: 88,
    type: "草花",
    avatar: "👩‍🏫",
    gender: "female",
  },
  {
    id: 5,
    name: "大輔",
    age: 43,
    location: "埼玉県",
    occupation: "建築家",
    description: "創造性と実用性を両立させる方。美しいものへの感覚が鋭く、上質なライフスタイルを好みます。",
    compatibility: 87,
    type: "大樹",
    avatar: "👨‍💻",
    gender: "male",
  },
  {
    id: 6,
    name: "恵子",
    age: 39,
    location: "東京都",
    occupation: "弁護士",
    description: "正義感が強く、誠実な性格。責任感があり、パートナーを大切にする心優しい方です。",
    compatibility: 85,
    type: "鉄",
    avatar: "👩‍⚖️",
    gender: "female",
  },
];

export default function Home() {
  const [birthYear, setBirthYear] = useState<string>("");
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");
  const [userGender, setUserGender] = useState<Gender | "">("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [userTenkan, setUserTenkan] = useState<Tenkan | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingTextIndex, setAnalyzingTextIndex] = useState<number>(0);
  const [dailyCount, setDailyCount] = useState<number>(1248);
  const [showLightLeak, setShowLightLeak] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const analyzingTexts = [
    "魂の波長を同期中...",
    "宿縁の糸を手繰り寄せています...",
    "星の配置を読み解いています...",
    "運命の扉を開いています...",
    "魂の同期率を測定中...",
    "星の配置を読み解いています...",
    "前世の記憶をスキャン中...",
  ];
  
  // スクロール時のパララックス効果
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const stars = document.querySelectorAll('.parallax-star');
      stars.forEach((star, index) => {
        const speed = (index % 3 + 1) * 0.1;
        (star as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 結果表示時のライトリークエフェクト
  useEffect(() => {
    if (userTenkan) {
      setShowLightLeak(true);
      setTimeout(() => setShowLightLeak(false), 1500);
    }
  }, [userTenkan]);
  // 戦略A：メール登録
  const [email, setEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  // 戦略C：モーダル
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  const [isProcessingMonthlyCheckout, setIsProcessingMonthlyCheckout] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // バリデーション
    if (!userGender) {
      setError("あなたの性別を選択してください。");
      return;
    }
    
    if (!lookingFor) {
      setError("探している相手の性別を選択してください。");
      return;
    }

    setIsLoading(true);
    setIsAnalyzing(true);
    setAnalyzingTextIndex(0);

    // テキスト切り替えアニメーション（1秒おき）
    const textInterval = setInterval(() => {
      setAnalyzingTextIndex((prev) => (prev + 1) % analyzingTexts.length);
    }, 1000);

    // ローディングアニメーションを表示（2秒）
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    clearInterval(textInterval);

    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);

    if (!validateBirthDate(year, month, day)) {
      setError("正しい生年月日を入力してください。");
      setIsLoading(false);
      setIsAnalyzing(false);
      return;
    }

    const tenkan = calculateTenkan(year, month, day);
    setUserTenkan(tenkan);
    setIsLoading(false);
    setIsAnalyzing(false);
  };

  const compatibleTenkan = userTenkan ? getCompatibleTenkan(userTenkan) : null;
  const fortuneDetails = userTenkan ? getFortuneDetails(userTenkan) : null;

  // フィルタリングされたプロフィール
  const filteredProfiles = lookingFor
    ? PROFILES.filter((profile) => {
        if (lookingFor === "all") return true;
        return profile.gender === lookingFor;
      })
    : [];

  // セグメントコントロールコンポーネント
  const SegmentControl = <T extends string>({
    options,
    value,
    onChange,
    labels,
  }: {
    options: T[];
    value: T | "";
    onChange: (value: T) => void;
    labels: Record<T, string>;
  }) => (
    <div className="flex bg-darkNavy/60 rounded-xl p-1.5 border-2 border-gold/30 shadow-inner">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
            value === option
              ? "bg-gradient-gold text-darkNavy shadow-gold transform scale-105"
              : "text-gray-300 hover:text-gold hover:bg-gold/10"
          }`}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-fortune relative overflow-hidden">
      {/* Parallax Starfield + オーロラ背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 既存の装飾的な背景要素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        
        {/* Parallax Starfield - 複数レイヤー + 星屑（スターダスト） */}
        {[1, 2, 3].map((layer) => (
          <div key={`starfield-layer-${layer}`} className="absolute inset-0">
            {[...Array(30)].map((_, i) => {
              const size = (Math.random() * (layer === 1 ? 1 : layer === 2 ? 2 : 3)) + 0.5;
              const speed = layer * 0.5;
              const breathDuration = 2 + Math.random() * 4; // 2-6秒のランダムな呼吸リズム
              const breathDelay = Math.random() * 3;
              return (
                <div
                  key={`star-${layer}-${i}`}
                  className="absolute rounded-full bg-gold/40 parallax-star animate-stardust-breath"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    '--breath-duration': `${breathDuration}s`,
                    '--breath-delay': `${breathDelay}s`,
                    '--parallax-x': `${(Math.random() - 0.5) * 100 * speed}px`,
                    '--parallax-y': `${(Math.random() - 0.5) * 100 * speed}px`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        ))}
        
        {/* 追加の星屑（スターダスト） - より微細な明滅 */}
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 0.8 + 0.3;
          const breathDuration = 1.5 + Math.random() * 3;
          const breathDelay = Math.random() * 5;
          return (
            <div
              key={`stardust-${i}`}
              className="absolute rounded-full bg-gold/30 parallax-star animate-stardust-breath"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                '--breath-duration': `${breathDuration}s`,
                '--breath-delay': `${breathDelay}s`,
              } as React.CSSProperties}
            />
          );
        })}
        
        {/* オーロラエフェクト */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`aurora-${i}`}
            className="absolute w-full h-full animate-aurora"
            style={{
              background: `linear-gradient(${i === 0 ? '135deg' : '45deg'}, transparent 0%, rgba(212, 175, 55, 0.1) 30%, rgba(212, 175, 55, 0.15) 50%, rgba(212, 175, 55, 0.1) 70%, transparent 100%)`,
              animationDelay: `${i * 7.5}s`,
              top: `${i * 30}%`,
            }}
          />
        ))}
        
        {/* 粒子エフェクト */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-gold/20 animate-particle-float blur-sm"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-10px',
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {/* ヘッダー */}
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4 animate-fade-in-up-delay-1">
            <span className="text-6xl">🔮</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-gold animate-fade-in-up-delay-1 font-serif-elegant">
            Soleil et Lune
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-6 animate-fade-in-up-delay-2 font-serif-elegant">
            四柱推命で導き出す、魂の共鳴
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-gold mx-auto rounded-full mb-6 animate-fade-in-up-delay-2"></div>
          {/* 本日の鑑定数カウンター */}
          <div className="inline-flex items-center space-x-2 bg-navy/40 backdrop-blur-sm px-6 py-3 rounded-full border border-gold/30 animate-fade-in-up-delay-3">
            <span className="text-gold text-sm font-medium">本日の鑑定数：</span>
            <span className="text-gold text-lg font-bold tabular-nums">{dailyCount.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">件</span>
          </div>
        </header>

        {/* メインコンテンツ */}
        <div className="glass-morphism rounded-3xl shadow-gold-lg p-8 md:p-12 border border-gold/30 animate-fade-in-up-delay-2">
          {isAnalyzing ? (
            /* 魔法陣/星座の輪のローディングアニメーション */
            <div className="text-center py-20 relative">
              {/* 背景の光の収束エフェクト */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-light-converge"></div>
              </div>
              
              {/* 魔法陣/星座の輪 */}
              <div className="relative z-10 mb-12">
                <div className="relative w-64 h-64 mx-auto animate-crystal-glow">
                  {/* SVG魔法陣 */}
                  <svg className="absolute inset-0 w-full h-full animate-magic-circle" viewBox="0 0 200 200">
                    {/* 外側の魔法陣 */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1.5" />
                    
                    {/* 六芒星 */}
                    <path
                      d="M 100 20 L 120 80 L 180 80 L 130 120 L 150 180 L 100 140 L 50 180 L 70 120 L 20 80 L 80 80 Z"
                      fill="none"
                      stroke="rgba(212, 175, 55, 0.5)"
                      strokeWidth="2"
                    />
                    
                    {/* 内側の星座の輪 */}
                    <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1" strokeDasharray="5,5" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
                    
                    {/* 中心の星 */}
                    <polygon
                      points="100,60 105,75 120,75 108,85 113,100 100,90 87,100 92,85 80,75 95,75"
                      fill="rgba(212, 175, 55, 0.8)"
                    />
                    
                    {/* 回転する装飾 */}
                    <g transform="rotate(0 100 100)">
                      <line x1="100" y1="20" x2="100" y2="30" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="2" />
                      <line x1="100" y1="170" x2="100" y2="180" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="2" />
                      <line x1="20" y1="100" x2="30" y2="100" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="2" />
                      <line x1="170" y1="100" x2="180" y2="100" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="2" />
                    </g>
                  </svg>
                  
                  {/* 逆回転する内側の魔法陣 */}
                  <svg className="absolute inset-0 w-full h-full" style={{ animation: 'magicCircleRotate 15s linear infinite reverse' }} viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
                  </svg>
                  
                  {/* 中心の光 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gold rounded-full shadow-gold-lg animate-pulse"></div>
                  
                  {/* 周囲の光の粒子 */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`particle-${i}`}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-gold rounded-full"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-120px)`,
                        animation: `lightConverge 2s ease-out ${i * 0.1}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* テキスト切り替え（1秒おき） */}
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-gold font-serif-elegant animate-text-fade">
                  {analyzingTexts[analyzingTextIndex]}
                </h2>
                <p className="text-xl text-gray-300 mb-2 font-serif-elegant">あなたの運命の糸を読み解いています</p>
              </div>
            </div>
          ) : !userTenkan ? (
            /* 入力フォーム */
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="animate-fade-in-up">
                <label className="block text-xl font-semibold mb-6 text-gold text-center">
                  <span className="inline-block mr-2">📅</span>
                  生年月日を入力してください
                </label>
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-2 animate-fade-in-up-delay-1">
                    <label className="block text-sm font-medium text-gray-300">
                      年
                    </label>
                    <div className="glow-border particle-burst rounded-xl">
                      <input
                        type="number"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="1980"
                        min="1900"
                        max="2100"
                        className="w-full px-5 py-4 bg-darkNavy/80 rounded-xl focus:outline-none text-white text-center text-lg placeholder-gray-600 transition-all duration-300"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 animate-fade-in-up-delay-2">
                    <label className="block text-sm font-medium text-gray-300">
                      月
                    </label>
                    <div className="glow-border particle-burst rounded-xl">
                      <input
                        type="number"
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        placeholder="5"
                        min="1"
                        max="12"
                        className="w-full px-5 py-4 bg-darkNavy/80 rounded-xl focus:outline-none text-white text-center text-lg placeholder-gray-600 transition-all duration-300"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 animate-fade-in-up-delay-3">
                    <label className="block text-sm font-medium text-gray-300">
                      日
                    </label>
                    <div className="glow-border particle-burst rounded-xl">
                      <input
                        type="number"
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        placeholder="15"
                        min="1"
                        max="31"
                        className="w-full px-5 py-4 bg-darkNavy/80 rounded-xl focus:outline-none text-white text-center text-lg placeholder-gray-600 transition-all duration-300"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 性別選択 */}
              <div className="space-y-4 animate-fade-in-up-delay-1">
                <label className="block text-lg font-semibold text-gold text-center">
                  <span className="inline-block mr-2">👤</span>
                  あなたの性別
                </label>
                <SegmentControl
                  options={["male", "female", "other"] as Gender[]}
                  value={userGender}
                  onChange={(value) => setUserGender(value)}
                  labels={{
                    male: "男性",
                    female: "女性",
                    other: "その他",
                  }}
                />
              </div>

              {/* 探している相手の性別 */}
              <div className="space-y-4 animate-fade-in-up-delay-2">
                <label className="block text-lg font-semibold text-gold text-center">
                  <span className="inline-block mr-2">💕</span>
                  探している相手
                </label>
                <SegmentControl
                  options={["male", "female", "all"] as LookingFor[]}
                  value={lookingFor}
                  onChange={(value) => setLookingFor(value)}
                  labels={{
                    male: "男性",
                    female: "女性",
                    all: "すべて",
                  }}
                />
              </div>

              {error && (
                <div className="bg-red-900/40 border-2 border-red-500/50 rounded-xl p-4 text-red-200 animate-fade-in">
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* プライバシー保護の一文 */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 animate-fade-in-up-delay-2">
                <span>🔒</span>
                <span>プライバシー保護：お客様のデータは最新の技術で暗号化され、厳重に守られます</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-gold text-darkNavy font-bold py-5 px-8 rounded-xl hover:shadow-gold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg relative overflow-hidden animate-fade-in-up-delay-3 ripple-effect"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">✨</span>
                    占い中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-10">
                    <span className="mr-2">🔮</span>
                    <span className="animate-gold-shine">運命を占う</span>
                  </span>
                )}
              </button>
            </form>
          ) : (
            /* 結果表示 - 羊皮紙/霧が晴れるトランジション */
            <div className="space-y-12 relative">
              {/* ライトリーク効果（画面中央から外側へ光が広がる） */}
              {showLightLeak && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-radial from-gold/60 via-gold/30 to-transparent rounded-full animate-light-leak"></div>
                </div>
              )}
              
              {/* 霧が晴れるエフェクト */}
              <div className="absolute inset-0 bg-gradient-fortune animate-mist-clear pointer-events-none z-0"></div>
              
              {/* 紙吹雪エフェクト（最高の相性表示時） */}
              {compatibleTenkan && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={`confetti-${i}`}
                      className="absolute w-2 h-2 bg-gold rounded-sm animate-confetti-fall"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 1}s`,
                      }}
                    />
                  ))}
                  
                  {/* 光の柱 */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={`pillar-${i}`}
                      className="absolute bottom-0 w-1 bg-gradient-to-t from-gold/80 to-transparent animate-light-pillar"
                      style={{
                        left: `${20 + i * 15}%`,
                        height: '100%',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* あなたのタイプ */}
              <div className="text-center animate-parchment-reveal relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gold flex items-center justify-center font-serif-elegant">
                  <span className="mr-3">✨</span>
                  あなたのタイプ
                </h2>
                <div className="glass-morphism rounded-2xl p-8 border-2 border-gold/40 shadow-gold relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer opacity-30"></div>
                  
                  {/* オーラの揺らぎ（タイプ文字の背後） */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-gold/20 via-gold/10 to-transparent rounded-full animate-aura-glow pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="text-7xl md:text-8xl font-bold mb-3 text-gold drop-shadow-lg font-serif-elegant relative">
                      {TENKAN_NAMES[userTenkan]}
                    </div>
                    <div className="text-3xl md:text-4xl text-gray-200 mb-6 font-medium font-serif-elegant">
                      （{userTenkan}）
                    </div>
                    <div className="max-w-2xl mx-auto">
                      <p className="text-lg md:text-xl text-gray-200 leading-relaxed tracking-wide">
                        {TENKAN_DESCRIPTIONS[userTenkan]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 相性抜群の相手 */}
              {compatibleTenkan && (
                <div className="text-center animate-parchment-reveal relative z-10" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-3xl md:text-4xl font-bold mx-4 text-gold font-serif-elegant">
                      💕 運命の相手
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  <div className="glass-morphism rounded-2xl p-10 md:p-12 border-2 border-gold shadow-gold-lg relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer opacity-20"></div>
                    <div className="relative z-10">
                      <div className="text-8xl md:text-9xl font-bold mb-4 text-gold drop-shadow-2xl font-serif-elegant">
                        {TENKAN_NAMES[compatibleTenkan]}
                      </div>
                      <div className="text-4xl md:text-5xl text-gray-100 mb-6 font-medium font-serif-elegant">
                        （{compatibleTenkan}）
                      </div>
                      <div className="max-w-2xl mx-auto mb-8">
                        <p className="text-xl md:text-2xl text-gray-100 leading-relaxed tracking-wide">
                          {TENKAN_DESCRIPTIONS[compatibleTenkan]}
                        </p>
                      </div>
                      <div className="inline-block bg-gold/30 backdrop-blur-sm px-8 py-4 rounded-xl border-2 border-gold/60 shadow-lg animate-parchment-reveal" style={{ animationDelay: '0.5s' }}>
                        <p className="text-gold font-bold text-lg md:text-xl font-serif-elegant">
                          {TENKAN_NAMES[userTenkan]} × {TENKAN_NAMES[compatibleTenkan]} = 最高の相性 ✨
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 占いの詳細情報 */}
              {fortuneDetails && (
                <div className="space-y-8 animate-parchment-reveal relative z-10" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-2xl md:text-3xl font-bold mx-4 text-gold font-serif-elegant">
                      📜 詳細な占い結果
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 今日の運勢 */}
                    <div className="glass-morphism rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300 animate-parchment-reveal">
                      <div className="text-4xl mb-4">🌟</div>
                      <h3 className="text-xl font-bold text-gold mb-4 font-serif-elegant">本日の運勢</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.todayFortune}
                      </p>
                    </div>

                    {/* 開運の助言 */}
                    <div className="glass-morphism rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300 animate-parchment-reveal" style={{ animationDelay: '0.1s' }}>
                      <div className="text-4xl mb-4">🧭</div>
                      <h3 className="text-xl font-bold text-gold mb-4 font-serif-elegant">開運の助言</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.advice}
                      </p>
                    </div>

                    {/* 出会うべき時期 */}
                    <div className="glass-morphism rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300 animate-parchment-reveal" style={{ animationDelay: '0.2s' }}>
                      <div className="text-4xl mb-4">💑</div>
                      <h3 className="text-xl font-bold text-gold mb-4 font-serif-elegant">二人が出会うべき時期</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.meetingPeriod}
                      </p>
                    </div>

                    {/* 幸運の場所 */}
                    <div className="glass-morphism rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300 animate-parchment-reveal" style={{ animationDelay: '0.3s' }}>
                      <div className="text-4xl mb-4">📍</div>
                      <h3 className="text-xl font-bold text-gold mb-4 font-serif-elegant">幸運の場所</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.luckyPlace}
                      </p>
                    </div>

                    {/* ラッキーアイテム */}
                    <div className="glass-morphism rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300 lg:col-span-1 animate-parchment-reveal" style={{ animationDelay: '0.4s' }}>
                      <div className="text-4xl mb-4">🎁</div>
                      <h3 className="text-xl font-bold text-gold mb-4 font-serif-elegant">あなたを導くラッキーアイテム</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.luckyItem}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 月のメッセージ */}
              {fortuneDetails && (
                <div className="space-y-6 animate-parchment-reveal relative z-10" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-2xl md:text-3xl font-bold mx-4 text-gold flex items-center font-serif-elegant">
                      <span className="mr-2">🌙</span>
                      あなたをさらに輝かせる月のメッセージ
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  <div className="glass-morphism rounded-2xl p-8 md:p-10 border-2 border-gold/40 shadow-gold relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer opacity-20"></div>
                    <div className="relative z-10">
                      <p className="text-lg md:text-xl text-gray-100 leading-relaxed tracking-wide text-center max-w-3xl mx-auto">
                        {fortuneDetails.moonMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* さらに深い宿縁を知るボタン（月額プラン） */}
              {userTenkan && (
                <div className="text-center animate-fade-in-up-delay-3">
                  <div className="bg-gradient-to-br from-gold/30 via-gold/20 to-gold/10 rounded-2xl p-8 border-2 border-gold/50 shadow-gold-lg relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer opacity-30"></div>
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-gold mb-2">
                        💎 さらに深い宿縁を知る
                      </h3>
                      <p className="text-gray-200 text-lg mb-6">
                        月額<span className="text-gold font-bold text-2xl mx-2">5,000円</span>で
                        <br />
                        詳細な鑑定と特別コンテンツをお届け
                      </p>
                      <button
                        onClick={async () => {
                          setIsProcessingMonthlyCheckout(true);
                          try {
                            const response = await fetch('/api/checkout', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ?? 'price_xxxxx',
                                planType: 'subscription',
                              }),
                            });

                            const data = await response.json();
                            if (data.error) {
                              throw new Error(data.error);
                            }
                            if (data.url) {
                              window.location.href = data.url;
                            } else {
                              throw new Error('Checkout URL not found');
                            }
                          } catch (error: any) {
                            console.error('Checkout error:', error);
                            alert('決済処理中にエラーが発生しました。もう一度お試しください。');
                            setIsProcessingMonthlyCheckout(false);
                          }
                        }}
                        disabled={isProcessingMonthlyCheckout}
                        className="w-full bg-gradient-gold text-darkNavy font-bold py-6 px-10 rounded-xl hover:shadow-gold-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xl relative overflow-hidden group animate-shimmer-continuous ripple-effect"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          {isProcessingMonthlyCheckout ? (
                            <>
                              <div className="w-5 h-5 border-2 border-darkNavy border-t-transparent rounded-full animate-spin mr-3"></div>
                              <span>決済画面へ移動中...</span>
                            </>
                          ) : (
                            <>
                              <span className="mr-3 text-2xl">✨</span>
                              <span>さらに深い宿縁を知る（月額5,000円）</span>
                              <span className="ml-3 text-sm">→</span>
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </button>
                      <p className="text-xs text-gray-400 mt-3">
                        ※ いつでもキャンセル可能です
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 戦略B：SNS拡散（X/Twitterシェア） */}
              {userTenkan && compatibleTenkan && (
                <div className="text-center animate-fade-in-up-delay-1">
                  <button
                    onClick={() => {
                      const shareText = `Soleil et Luneで導き出された私の運命の相手は『${TENKAN_NAMES[compatibleTenkan]}タイプ』でした。 #SoleilEtLune #運命の鑑定`;
                      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                      window.open(shareUrl, "_blank");
                    }}
                    className="w-full bg-navy/80 border-2 border-gold/50 text-gold font-bold py-4 px-8 rounded-xl hover:bg-gold/10 hover:border-gold hover:shadow-gold transition-all duration-300 text-lg flex items-center justify-center"
                  >
                    <span className="mr-2">🐦</span>
                    X（旧Twitter）で結果をシェアする
                  </button>
                </div>
              )}

              {/* さらに深く占うボタン */}
              <div className="text-center animate-fade-in-up-delay-2">
                <button
                  onClick={() => {
                    setShowPremiumModal(true);
                  }}
                  className="w-full bg-gradient-gold text-darkNavy font-bold py-5 px-8 rounded-xl hover:shadow-gold-lg transition-all duration-300 transform hover:scale-105 text-lg relative overflow-hidden group animate-shimmer-continuous ripple-effect"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2">✨</span>
                    さらに深く占う（有料版）
                    <span className="ml-2 text-sm">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
                <p className="text-xs text-gray-400 mt-2">※ 有料版ではより詳細な分析が可能です</p>
              </div>

              {/* 戦略A：メール登録フォーム */}
              {userTenkan && !emailSubmitted && (
                <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-2xl p-8 border-2 border-gold/30 animate-fade-in-up-delay-2">
                  <h3 className="text-2xl font-bold text-gold mb-4 text-center">
                    📧 この詳細な鑑定書をメールで受け取る（無料）
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (email) {
                        setEmailSubmitted(true);
                        // 実際のメール送信処理はここに実装
                      }
                    }}
                    className="space-y-4"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="メールアドレスを入力してください"
                      className="w-full px-5 py-4 bg-darkNavy/80 border-2 border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-gold text-darkNavy font-bold py-4 px-8 rounded-xl hover:shadow-gold transition-all duration-300 transform hover:scale-105 ripple-effect"
                    >
                      送信する
                    </button>
                  </form>
                </div>
              )}

              {/* メール送信成功メッセージ */}
              {emailSubmitted && (
                <div className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-2xl p-6 border-2 border-gold/40 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-lg text-gold font-semibold">
                    メールを送信しました。後ほどご確認ください。
                  </p>
                </div>
              )}

              {/* プロフィールカード */}
              {filteredProfiles.length > 0 && (
                <div className="space-y-6 animate-parchment-reveal relative z-10" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-2xl md:text-3xl font-bold mx-4 text-gold font-serif-elegant">
                      💫 あなたと宿縁で結ばれた相手候補
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredProfiles.map((profile, index) => (
                    <div
                      key={profile.id}
                      className={`glass-morphism rounded-xl p-6 border-2 border-gold/30 hover:border-gold/60 transition-all duration-300 hover:shadow-gold transform hover:scale-105 relative overflow-hidden ${
                        index === 0 ? 'animate-parchment-reveal' : index === 1 ? 'animate-parchment-reveal' : 'animate-parchment-reveal'
                      }`}
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      {/* 相性バッジ */}
                      <div className="absolute top-4 right-4 bg-gradient-gold text-darkNavy text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        相性{profile.compatibility}%
                      </div>
                      
                      <div className="text-center mb-4">
                        {/* 宿縁の赤い糸の枠 */}
                        <div className="inline-block p-2 rounded-full animate-red-thread mb-3">
                          <div className="text-6xl">{profile.avatar}</div>
                        </div>
                        <h3 className="text-2xl font-bold text-gold mb-1 font-serif-elegant">{profile.name}</h3>
                        <p className="text-gray-400 text-sm">{profile.age}歳 • {profile.location}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">職業</p>
                          <p className="text-gray-200 font-medium">{profile.occupation}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">タイプ</p>
                          <p className="text-gold font-semibold">{profile.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">プロフィール</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{profile.description}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          alert(`${profile.name}さんの詳細プロフィールを表示します（実装予定）`);
                        }}
                        className="w-full mt-4 bg-navy border-2 border-gold/50 text-gold font-semibold py-2 px-4 rounded-lg hover:bg-gold/10 transition-all duration-300 text-sm"
                      >
                        詳細を見る
                      </button>
                    </div>
                    ))}
                  </div>
                </div>
              )}

              {/* もう一度占うボタン */}
              <button
                onClick={() => {
                  setUserTenkan(null);
                  setBirthYear("");
                  setBirthMonth("");
                  setBirthDay("");
                  setUserGender("");
                  setLookingFor("");
                  setError("");
                  setEmail("");
                  setEmailSubmitted(false);
                }}
                className="w-full bg-navy/80 border-2 border-gold text-gold font-bold py-4 px-8 rounded-xl hover:bg-gold/10 hover:shadow-gold transition-all duration-300 text-lg"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">🔄</span>
                  もう一度占う
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 戦略C：プレミアム会員モーダル */}
        {showPremiumModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowPremiumModal(false)}
          >
            <div
              className="bg-navy/95 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-2xl w-full border-2 border-gold shadow-gold-lg relative animate-modal-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 閉じるボタン */}
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-gold hover:text-lightGold transition-colors text-2xl"
              >
                ×
              </button>

              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
                  Soleil et Lune プレミアム会員
                </h2>
                <h3 className="text-xl md:text-2xl text-gold font-semibold mb-6">
                  先行受付中
                </h3>

                <div className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-xl p-6 border border-gold/30 mb-6">
                  <p className="text-lg text-gray-200 leading-relaxed mb-4">
                    通常<span className="text-gold font-bold text-2xl mx-2">5,000円</span>が
                  </p>
                  <p className="text-2xl md:text-3xl text-gold font-bold mb-4">
                    今だけ特別価格
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    正式リリース時に優先案内を受け取ることができます
                  </p>
                </div>

                <div className="space-y-4">
                  {/* 月額プラン */}
                  <div className="bg-darkNavy/40 rounded-xl p-6 border-2 border-gold/30">
                    <h4 className="text-lg font-bold text-gold mb-2">月額プラン</h4>
                    <p className="text-gray-300 text-sm mb-4">毎月の詳細な鑑定と特別コンテンツ</p>
                    <button
                      onClick={async () => {
                        setIsProcessingCheckout(true);
                        try {
                          const response = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ?? 'price_xxxxx', // 月額プランの価格ID
                              planType: 'subscription',
                            }),
                          });

                          const data = await response.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            throw new Error('Checkout URL not found');
                          }
                        } catch (error) {
                          console.error('Checkout error:', error);
                          alert('決済処理中にエラーが発生しました。もう一度お試しください。');
                          setIsProcessingCheckout(false);
                        }
                      }}
                      disabled={isProcessingCheckout}
                      className="w-full bg-gradient-gold text-darkNavy font-bold py-4 px-8 rounded-xl hover:shadow-gold-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessingCheckout ? '処理中...' : '月額プランを選択'}
                    </button>
                  </div>

                  {/* 今回限りの特別鑑定 */}
                  <div className="bg-darkNavy/40 rounded-xl p-6 border-2 border-gold/30">
                    <h4 className="text-lg font-bold text-gold mb-2">今回限りの特別鑑定</h4>
                    <p className="text-gray-300 text-sm mb-4">一度だけの詳細な鑑定書</p>
                    <button
                      onClick={async () => {
                        setIsProcessingCheckout(true);
                        try {
                          const response = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ONE_TIME ?? 'price_xxxxx', // 一回限りの価格ID
                              planType: 'payment',
                            }),
                          });

                          const data = await response.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            throw new Error('Checkout URL not found');
                          }
                        } catch (error) {
                          console.error('Checkout error:', error);
                          alert('決済処理中にエラーが発生しました。もう一度お試しください。');
                          setIsProcessingCheckout(false);
                        }
                      }}
                      disabled={isProcessingCheckout}
                      className="w-full bg-gradient-gold text-darkNavy font-bold py-4 px-8 rounded-xl hover:shadow-gold-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessingCheckout ? '処理中...' : '特別鑑定を選択'}
                    </button>
                  </div>

                  <button
                    onClick={() => setShowPremiumModal(false)}
                    disabled={isProcessingCheckout}
                    className="w-full bg-navy/80 border-2 border-gold/50 text-gold font-semibold py-3 px-6 rounded-xl hover:bg-gold/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    後で考える
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* フッター */}
        <footer className="text-center mt-16 text-gray-400 text-sm animate-fade-in-up-delay-3 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gold/60">監修：</span>
            <span className="text-gold font-semibold">東洋占星術研究機構</span>
          </div>
          
          <div className="pt-4 border-t border-gold/20">
            <a
              href="/tokusho"
              className="inline-block text-gold hover:text-lightGold transition-colors underline font-semibold text-base"
            >
              特定商取引法に基づく表記
            </a>
          </div>
          
          <p>© 2024 Soleil et Lune - 四柱推命による相性診断</p>
          
          <p className="text-xs text-gray-500">
            このアプリはプロトタイプです。正確な四柱推命の計算には旧暦への変換が必要です。
          </p>
        </footer>
      </div>
    </div>
  );
}
