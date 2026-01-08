"use client";

import { useState } from "react";
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
  const [dailyCount, setDailyCount] = useState<number>(1248);

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

    // ローディングアニメーションを表示（2秒）
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {/* ヘッダー */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-6xl">🔮</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-gold">
            Soleil et Lune
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-6">
            四柱推命で導き出す、魂の共鳴
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-gold mx-auto rounded-full mb-6"></div>
          {/* 本日の鑑定数カウンター */}
          <div className="inline-flex items-center space-x-2 bg-navy/40 backdrop-blur-sm px-6 py-3 rounded-full border border-gold/30">
            <span className="text-gold text-sm font-medium">本日の鑑定数：</span>
            <span className="text-gold text-lg font-bold tabular-nums">{dailyCount.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">件</span>
          </div>
        </header>

        {/* メインコンテンツ */}
        <div className="bg-navy/60 backdrop-blur-md rounded-3xl shadow-gold-lg p-8 md:p-12 border border-gold/30 animate-fade-in">
          {isAnalyzing ? (
            /* ローディングアニメーション */
            <div className="text-center py-20">
              <div className="inline-block mb-8">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 border-4 border-gold/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin"></div>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-gold">
                運命を解析中...
              </h2>
              <p className="text-xl text-gray-300 mb-2">あなたの運命の糸を読み解いています</p>
              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          ) : !userTenkan ? (
            /* 入力フォーム */
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xl font-semibold mb-6 text-gold text-center">
                  <span className="inline-block mr-2">📅</span>
                  生年月日を入力してください
                </label>
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      年
                    </label>
                    <input
                      type="number"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="1980"
                      min="1900"
                      max="2100"
                      className="w-full px-5 py-4 bg-darkNavy/80 border-2 border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white text-center text-lg placeholder-gray-600 transition-all duration-300"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      月
                    </label>
                    <input
                      type="number"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      placeholder="5"
                      min="1"
                      max="12"
                      className="w-full px-5 py-4 bg-darkNavy/80 border-2 border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white text-center text-lg placeholder-gray-600 transition-all duration-300"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      日
                    </label>
                    <input
                      type="number"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      placeholder="15"
                      min="1"
                      max="31"
                      className="w-full px-5 py-4 bg-darkNavy/80 border-2 border-gold/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-white text-center text-lg placeholder-gray-600 transition-all duration-300"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* 性別選択 */}
              <div className="space-y-4">
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
              <div className="space-y-4">
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
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <span>🔒</span>
                <span>プライバシー保護：お客様のデータは最新の技術で暗号化され、厳重に守られます</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-gold text-darkNavy font-bold py-5 px-8 rounded-xl hover:shadow-gold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">✨</span>
                    占い中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🔮</span>
                    運命を占う
                  </span>
                )}
              </button>
            </form>
          ) : (
            /* 結果表示 */
            <div className="space-y-12 animate-fade-in">
              {/* あなたのタイプ */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gold flex items-center justify-center">
                  <span className="mr-3">✨</span>
                  あなたのタイプ
                </h2>
                <div className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-2xl p-8 border-2 border-gold/40 shadow-gold relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer opacity-30"></div>
                  <div className="relative z-10">
                    <div className="text-7xl md:text-8xl font-bold mb-3 text-gold drop-shadow-lg">
                      {TENKAN_NAMES[userTenkan]}
                    </div>
                    <div className="text-3xl md:text-4xl text-gray-200 mb-6 font-medium">
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
                <div className="text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-3xl md:text-4xl font-bold mx-4 text-gold">
                      💕 運命の相手
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  <div className="bg-gradient-to-br from-gold/40 via-gold/30 to-gold/20 rounded-2xl p-10 md:p-12 border-2 border-gold shadow-gold-lg relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer opacity-20"></div>
                    <div className="relative z-10">
                      <div className="text-8xl md:text-9xl font-bold mb-4 text-gold drop-shadow-2xl">
                        {TENKAN_NAMES[compatibleTenkan]}
                      </div>
                      <div className="text-4xl md:text-5xl text-gray-100 mb-6 font-medium">
                        （{compatibleTenkan}）
                      </div>
                      <div className="max-w-2xl mx-auto mb-8">
                        <p className="text-xl md:text-2xl text-gray-100 leading-relaxed tracking-wide">
                          {TENKAN_DESCRIPTIONS[compatibleTenkan]}
                        </p>
                      </div>
                      <div className="inline-block bg-gold/30 backdrop-blur-sm px-8 py-4 rounded-xl border-2 border-gold/60 shadow-lg">
                        <p className="text-gold font-bold text-lg md:text-xl">
                          {TENKAN_NAMES[userTenkan]} × {TENKAN_NAMES[compatibleTenkan]} = 最高の相性 ✨
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 占いの詳細情報 */}
              {fortuneDetails && (
                <div className="space-y-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-2xl md:text-3xl font-bold mx-4 text-gold">
                      📜 詳細な占い結果
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 今日の運勢 */}
                    <div className="bg-darkNavy/60 rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300">
                      <div className="text-4xl mb-4">🌟</div>
                      <h3 className="text-xl font-bold text-gold mb-4">本日の運勢</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.todayFortune}
                      </p>
                    </div>

                    {/* 開運の助言 */}
                    <div className="bg-darkNavy/60 rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300">
                      <div className="text-4xl mb-4">🧭</div>
                      <h3 className="text-xl font-bold text-gold mb-4">開運の助言</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.advice}
                      </p>
                    </div>

                    {/* 出会うべき時期 */}
                    <div className="bg-darkNavy/60 rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300">
                      <div className="text-4xl mb-4">💑</div>
                      <h3 className="text-xl font-bold text-gold mb-4">二人が出会うべき時期</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.meetingPeriod}
                      </p>
                    </div>

                    {/* 幸運の場所 */}
                    <div className="bg-darkNavy/60 rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300">
                      <div className="text-4xl mb-4">📍</div>
                      <h3 className="text-xl font-bold text-gold mb-4">幸運の場所</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.luckyPlace}
                      </p>
                    </div>

                    {/* ラッキーアイテム */}
                    <div className="bg-darkNavy/60 rounded-xl p-6 md:p-8 border border-gold/30 hover:border-gold/50 transition-all duration-300 lg:col-span-1">
                      <div className="text-4xl mb-4">🎁</div>
                      <h3 className="text-xl font-bold text-gold mb-4">あなたを導くラッキーアイテム</h3>
                      <p className="text-gray-300 leading-relaxed text-sm tracking-wide">
                        {fortuneDetails.luckyItem}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 月のメッセージ */}
              {fortuneDetails && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-2xl md:text-3xl font-bold mx-4 text-gold flex items-center">
                      <span className="mr-2">🌙</span>
                      あなたをさらに輝かせる月のメッセージ
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  <div className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-2xl p-8 md:p-10 border-2 border-gold/40 shadow-gold relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer opacity-20"></div>
                    <div className="relative z-10">
                      <p className="text-lg md:text-xl text-gray-100 leading-relaxed tracking-wide text-center max-w-3xl mx-auto">
                        {fortuneDetails.moonMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* さらに深く占うボタン */}
              <div className="text-center">
                <button
                  onClick={() => {
                    alert("有料版では、より詳細な四柱推命の分析、月間運勢、年間運勢、相性の詳細分析などがご利用いただけます。");
                  }}
                  className="w-full bg-gradient-gold text-darkNavy font-bold py-5 px-8 rounded-xl hover:shadow-gold-lg transition-all duration-300 transform hover:scale-105 text-lg relative overflow-hidden group"
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

              {/* プロフィールカード */}
              {filteredProfiles.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                    <h2 className="text-2xl md:text-3xl font-bold mx-4 text-gold">
                      💫 あなたと宿縁で結ばれた相手候補
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="bg-darkNavy/80 rounded-xl p-6 border-2 border-gold/30 hover:border-gold/60 transition-all duration-300 hover:shadow-gold transform hover:scale-105 relative overflow-hidden"
                    >
                      {/* 相性バッジ */}
                      <div className="absolute top-4 right-4 bg-gradient-gold text-darkNavy text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        相性{profile.compatibility}%
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-3">{profile.avatar}</div>
                        <h3 className="text-2xl font-bold text-gold mb-1">{profile.name}</h3>
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

        {/* フッター */}
        <footer className="text-center mt-16 text-gray-400 text-sm animate-fade-in space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gold/60">監修：</span>
            <span className="text-gold font-semibold">東洋占星術研究機構</span>
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
