import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NapStopper",
  description: "NapStopper pings your backend every 10 minutes to keep it awake and responsive. Ideal for free-tier platforms like Render, Vercel, and Railway. Simple, reliable, and free to get started.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1028044699975607"
     crossOrigin="anonymous"></Script>
        {children}
      </body>
    </html>
  );
}
