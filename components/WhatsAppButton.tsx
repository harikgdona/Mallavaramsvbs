"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useTranslate } from "./ConfigProvider";

const WHATSAPP_NUMBER = "919885117126";

const PREFILLED_MESSAGE =
  "I have made a donation to Mallavaram Brahmana Satram";

export function WhatsAppButton({ outline = false, inHeader = false, className = "" }: { outline?: boolean; inHeader?: boolean; className?: string }) {
  const t = useTranslate();
  const label = t("whatsapp_us");

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    PREFILLED_MESSAGE
  )}`;

  const baseClass = inHeader
    ? "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-md hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    : outline
      ? "btn-outline gap-2"
      : "btn-whatsapp gap-2";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClass} ${className}`.trim()}
    >
      <FaWhatsapp aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

