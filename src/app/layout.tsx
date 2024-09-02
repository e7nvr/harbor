import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panda Peach",
  description: "Harbor Branch Panda es una app que vigila a tus seres queridos mientras duermen, previniendo caídas y garantizando un descanso seguro. Protége a tus abuelos con monitoreo nocturno en tiempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>{children}</body>
    </html>
  );
}
