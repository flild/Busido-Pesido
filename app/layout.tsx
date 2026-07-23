import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/Toast";
import { ModalProvider } from "@/components/Modal";
import "./globals.css";
import { ReadingProgress } from "@/components/ReadingProgress";
import { UtilityBar } from "@/components/UtilityBar";
import { PaletteStripe } from "@/components/PaletteStripe";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://busidopesido.ru"), // Replace with actual domain
  title: {
    default: "Busido-Pesido | Зоопсихолог, специалист по поведению животных",
    template: "%s | Busido-Pesido",
  },
  description:
    "Помощь владельцам собак и кошек в решении проблем поведения. Анализ состояния, среды и истории обучения. Ярослава Ковалевская - ветеринарный врач и зоотехник-кинолог.",
  keywords: [
    "зоопсихолог",
    "кинолог",
    "поведение собак",
    "поведение кошек",
    "Ярослава Ковалевская",
    "агрессия собак",
    "страхи собак",
    "коррекция поведения",
    "ветеринарное поведение",
    "busido-pesido",
  ],
  authors: [{ name: "Ярослава Ковалевская" }],
  creator: "Ярослава Ковалевская",
  publisher: "Busido-Pesido",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Busido-Pesido | Специалист по поведению животных",
    description:
      "Ярослава Ковалевская — ветеринарный врач, зоотехник-кинолог. Помощь с поведением собак и кошек, учитывая их состояние, здоровье и среду.",
    url: "https://busidopesido.ru",
    siteName: "Busido-Pesido",
    images: [
      {
        url: "/og-image.jpg", // You need to add this image to /public
        width: 1200,
        height: 630,
        alt: "Busido-Pesido - Поведение и благополучие животных",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Busido-Pesido | Поведение животных",
    description: "Помощь владельцам собак и кошек в решении проблем поведения.",
    images: ["/og-image.jpg"],
    creator: "@busidopesido",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Add your actual code
    yandex: "yandex-verification-code", // Add your actual code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="theme-expressive" suppressHydrationWarning>
        <ToastProvider>
          <ModalProvider>
            <ReadingProgress />
            <UtilityBar />
            <PaletteStripe />
            <Header />
            {children}
            <Footer />
          </ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
