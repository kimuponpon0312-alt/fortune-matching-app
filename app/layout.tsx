import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "運命のマッチング - 四柱推命で見つける相性抜群の相手",
  description: "30〜50代向けの占いマッチングアプリ。四柱推命であなたの運命の相手を見つけましょう。",
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
