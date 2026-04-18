"use client";

import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919885117126";
const PREFILLED_MESSAGE =
  "I have made a donation to Mallavaram Brahmana Satram";

export function WhatsAppFloatingButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    PREFILLED_MESSAGE
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 md:bottom-8 md:right-8 z-40 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-sandal"
    >
      <FaWhatsapp className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
    </a>
  );
}

