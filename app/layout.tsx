import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AdminAuthProvider } from "@/components/AdminAuthProvider";
import { ConfigProvider } from "@/components/ConfigProvider";
import { MainContentColumn } from "@/components/MainContentColumn";
import { TopHeader } from "@/components/TopHeader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomRightActions } from "@/components/BottomRightActions";

export const metadata: Metadata = {
  title:
    "Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu",
  description:
    "Official website of Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu – supporting poor Brahmin families in Mallavaram village through Annadanam and dharmic activities.",
  metadataBase: new URL("https://MallavaramBrahmanasatram.org"),
  openGraph: {
    title:
      "Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu",
    description:
      "Support Annadanam and dharmic activities for poor Brahmin families in Mallavaram village, Prakasam district.",
    url: "https://MallavaramBrahmanasatram.org",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <ConfigProvider>
            <AdminAuthProvider>
              {/* Desktop-only ornate banner; mobile uses the compact bar inside Header. */}
              <TopHeader />
              <div className="flex min-h-screen min-h-[100dvh] flex-col md:flex-row">
                <Header />
                <MainContentColumn>
                  <main className="relative flex-1 flex flex-col min-h-0">{children}</main>
                  <Footer />
                </MainContentColumn>
              </div>
              <BottomRightActions />
            </AdminAuthProvider>
          </ConfigProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

