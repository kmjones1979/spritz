import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akash Auth | Passkey & Wallet Login",
  description:
    "Secure authentication with passkeys and wallet connection. Powered by Pimlico and WalletConnect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
