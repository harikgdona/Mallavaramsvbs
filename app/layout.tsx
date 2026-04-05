import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AdminAuthProvider } from "@/components/AdminAuthProvider";
import { ConfigProvider } from "@/components/ConfigProvider";
import { SectionTabsProvider } from "@/components/SectionTabs";
import { MainContentColumn } from "@/components/MainContentColumn";
import { TopHeader } from "@/components/TopHeader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomRightActions } from "@/components/BottomRightActions";
import { LayoutViewportOffsets } from "@/components/LayoutViewportOffsets";
import { TypographyTheme } from "@/components/TypographyTheme";
import { TYPOGRAPHY_PRESET_GOOGLE_FONTS_STYLESHEET } from "@/lib/typographyFontPresets";

const inter = Inter({ subsets: ["latin"], variable: "--font-site-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-site-heading" });

export const metadata: Metadata = {
  title:
    "Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu",
  description:
    "Official website of Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu – supporting poor Brahmin families in Mallavaram village through Annadanam and dharmic activities.",
  metadataBase: new URL("https://MallavaramBrahmanasatram.org"),
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png"
  },
  openGraph: {
    title:
      "Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu",
    description:
      "Support Annadanam and dharmic activities for poor Brahmin families in Mallavaram village, Prakasam district.",
    url: "https://MallavaramBrahmanasatram.org",
    type: "website",
    images: [
      {
        url: "/images/Satram-illuminated.jpeg",
        width: 1200,
        height: 630,
        alt: "Sri Mallavaram Brahmana Satram"
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={TYPOGRAPHY_PRESET_GOOGLE_FONTS_STYLESHEET} rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <ConfigProvider>
            <TypographyTheme />
            <AdminAuthProvider>
              <SectionTabsProvider>
              {/* min-h-dvh on outer column so TopHeader + main row = one viewport (avoids min-h-screen stacking past 100vh). */}
              <div className="flex min-h-[100dvh] min-h-[100svh] flex-col">
                {/* Desktop-only ornate banner; mobile uses the compact bar inside Header. */}
                <TopHeader />
                <div className="flex min-h-0 flex-1 flex-col md:flex-row">
                  <Header />
                  <MainContentColumn>
                    <main className="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-hidden">
                      {children}
                    </main>
                    <Footer />
                  </MainContentColumn>
                </div>
              </div>
              <LayoutViewportOffsets />
              <BottomRightActions />
              </SectionTabsProvider>
            </AdminAuthProvider>
          </ConfigProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

