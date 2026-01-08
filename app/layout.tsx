import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soleil et Lune - 四柱推命で導く魂の共鳴",
  description: "30〜50代のための上質な占いマッチング。四柱推命で導き出す、魂が共鳴する相手を見つけましょう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
