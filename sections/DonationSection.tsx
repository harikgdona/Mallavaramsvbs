"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const UPI_ID = "YOUR_UPI_ID";

export function DonationSection() {
  const t = useTranslate();
  const [copied, setCopied] = useState(false);

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <SectionContainer id="donate">
      <div className="bg-white rounded-3xl border border-gold/40 shadow-[0_16px_40px_rgba(123,30,30,0.18)] p-6 md:p-8 lg:p-10">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-center">
          <div>
            <h2 className="section-heading">{t("donation_title")}</h2>
            <p className="section-subtitle mb-5">
              {t("donation_subtitle")}
            </p>

            <div className="mb-4">
              <p className="text-xs md:text-sm font-semibold text-text-dark/90 mb-1">
                {t("donation_upi_label")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <code className="text-sm md:text-base bg-sandal/80 border border-maroon/20 rounded-full px-4 py-2 text-maroon font-semibold">
                  {UPI_ID}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="btn-outline text-xs md:text-sm"
                >
                  {copied
                    ? "Copied"
                    : t("donation_copy")}
                </button>
              </div>
            </div>

            <p className="text-xs md:text-sm text-text-dark/80 mb-3">
              Scan the QR code on the right or use the UPI ID above from your
              banking / UPI app (Google Pay, PhonePe, Paytm, BHIM etc.).
            </p>

            <p className="text-xs md:text-sm text-text-dark/80 mb-4">
              {t("donation_instructions")}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppButton />
            </div>

            <p className="text-xs text-text-dark/70 mt-3">
              For larger donations, family-specific sevas or regular monthly
              contributions, please contact the trust through phone or WhatsApp.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white rounded-3xl border-2 border-gold shadow-soft-gold p-4 md:p-5">
              <div className="relative h-48 w-48 md:h-56 md:w-56">
                <Image
                  src="/images/upi-qr.svg"
                  alt="UPI QR code for Mallavaram Brahmana Satram"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
            <p className="text-xs md:text-sm text-text-dark/80 mt-3 text-center max-w-xs">
              Use any UPI app to scan this QR code and make your offering
              securely and directly to the trust account.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

