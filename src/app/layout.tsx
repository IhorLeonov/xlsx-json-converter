import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = "https://xlsx-json-converter.vercel.app";

export const metadata: Metadata = {
  title: "XLSX to JSON converter",
  description: "Online XLSX to JSON Converter",
  applicationName: "XLSX to JSON Converter",
  keywords: [
    "XLSX to JSON",
    "XLSX converter",
    "JSON converter",
    "XLSX to JSON online",
    "convert XLSX to JSON",
    "xlsx to json",
    "xlsx converter",
    "json converter",
    "xlsx to json online",
    "convert xlsx to json",
    "xlsx json converter",
    "xlsx to json converter",
    "xlsx to json online converter",
    "xlsx to json file",
  ],
  alternates: {
    canonical: appUrl,
    languages: {
      en: appUrl,
      "x-default": appUrl,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
