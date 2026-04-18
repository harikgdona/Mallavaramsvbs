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
import { BottomRightActions } from "@/components/BottomRightActions";
import { LayoutViewportOffsets } from "@/components/LayoutViewportOffsets";
import { LiveFeedStrip } from "@/components/LiveFeedStrip";
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
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com https://*.googleapis.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*.googleapis.com https://*.googleusercontent.com https://www.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.google.com https://www.gstatic.com wss://*.firebaseio.com; frame-src 'self' https://www.google.com https://maps.google.com https://*.firebaseapp.com; object-src 'none'; base-uri 'self';"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={TYPOGRAPHY_PRESET_GOOGLE_FONTS_STYLESHEET} rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <AdminAuthProvider>
            <ConfigProvider>
              <TypographyTheme />
              <SectionTabsProvider>
              {/* TopHeader and Header are sticky; content scrolls below */}
              <div className="flex flex-col pt-[3.5rem] md:pt-[10rem]">
                {/* Desktop-only ornate banner; mobile uses the compact bar inside Header. */}
                <TopHeader />
                <div className="flex flex-col md:flex-row">
                  <Header />
                  <MainContentColumn>
                    <main className="relative flex min-w-0 w-full max-w-full flex-1 flex-col overflow-x-hidden">
                      <LiveFeedStrip />
                      {children}
                    </main>
                  </MainContentColumn>
                </div>
              </div>
              <LayoutViewportOffsets />
              <BottomRightActions />
              </SectionTabsProvider>
            </ConfigProvider>
          </AdminAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

