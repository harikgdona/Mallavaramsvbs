export type Language = "en" | "te";

export const DEFAULT_LANGUAGE: Language = "en";

type Translations = {
  [key: string]: {
    en: string;
    te: string;
  };
};

export const tMap: Translations = {
  nav_home: {
    en: "Home",
    te: "హోమ్"
  },
  nav_about: {
    en: "About",
    te: "సంస్థ గురించి"
  },
  nav_annadanam: {
    en: "Annadanam",
    te: "అన్నదానం"
  },
  nav_activities: {
    en: "Activities",
    te: "సేవలు"
  },
  nav_donate: {
    en: "Donate",
    te: "దానం చేయండి"
  },
  nav_gallery: {
    en: "Gallery",
    te: "గ్యాలరీ"
  },
  nav_volunteer: {
    en: "Volunteer",
    te: "సేవకులు"
  },
  nav_committee: {
    en: "Committee",
    te: "కమిటీ"
  },
  nav_contact: {
    en: "Contact",
    te: "సంప్రదించండి"
  },
  nav_configure: {
    en: "Configure (Admin only)",
    te: "కాన్ఫిగర్ (నిర్వాహకులు మాత్రమే)"
  },
  donate_now: {
    en: "Donate Now",
    te: "ఇప్పుడే దానం చేయండి"
  },
  whatsapp_us: {
    en: "WhatsApp",
    te: "వాట్సాప్"
  },
  hero_heading: {
    en: "Serving Dharma. Supporting Brahmin Families.",
    te: "ధర్మ సేవ. బ్రాహ్మణ కుటుంబాల ఆదరాభిమానాలు."
  },
  hero_subtitle: {
    en: "Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu serves poor Brahmin families in Mallavaram village through daily Annadanam and dharmic activities.",
    te: "శ్రీ మల్లవరం వెంకటేశ్వర అన్నదాన సమాజము మరియు బ్రాహ్మణ సత్రం మల్లవరం గ్రామంలోని పేద బ్రాహ్మణ కుటుంబాలకు ప్రతిరోజూ అన్నదానం మరియు ధార్మిక కార్యకలాపాల ద్వారా సేవ చేస్తోంది."
  },
  hero_join_annadanam: {
    en: "Join Annadanam Seva",
    te: "అన్నదాన సేవలో చేరండి"
  },
  about_title: {
    en: "About The Trust",
    te: "సంస్థ గురించి"
  },
  about_body: {
    en: " *"
    te: "*"},
  annadanam_title: {
    en: "Annadanam – Feeding with Devotion",
    te: "అన్నదానం – భక్తితో భోజనం"
  },
  annadanam_body: {
    en: "Annadanam is our primary seva. With your support, we provide simple, sattvic meals to deserving Brahmin families, visiting pilgrims, and Veda pandits throughout the year.",
    te: "అన్నదానం మా ప్రధాన సేవ. మీ సహకారంతో అర్హులైన బ్రాహ్మణ కుటుంబాలకు, యాత్రికులకు మరియు వేద పండితులకు సంవత్సరమంతా సాత్వికాహార భోజనాన్ని అందిస్తున్నాం."
  },
  annadanam_stats: {
    en: "By the grace of Sri Venkateswara Swamy and the support of devotees, this humble satram continues to serve those in need.",
    te: "శ్రీ వెంకటేశ్వర స్వామి కృపతో మరియు భక్తుల సహకారంతో ఈ వినయపూర్వక సత్రం అవసరంలో ఉన్నవారికి సేవ అందిస్తోంది."
  },
  activities_title: {
    en: "Our Activities",
    te: "మా సేవలు"
  },
  donation_title: {
    en: "Offer Your Support",
    te: "మీ సేవా దానం"
  },
  donation_subtitle: {
    en: "Your contribution directly supports Annadanam and essential needs of poor Brahmin families in Mallavaram village.",
    te: "మీ దానం మల్లవరం గ్రామంలోని పేద బ్రాహ్మణ కుటుంబాల అన్నదానం మరియు అవసరాలకు నేరుగా ఉపయోగపడుతుంది."
  },
  donation_upi_label: {
    en: "UPI ID",
    te: "యుపిఐ ఐడి"
  },
  donation_copy: {
    en: "Copy",
    te: "కాపీ"
  },
  donation_instructions: {
    en: "After completing your UPI payment, please share the payment screenshot with us on WhatsApp for proper accounting and receipt.",
    te: "యుపిఐ చెల్లింపు పూర్తయ్యాక, లెక్కల కోసం మరియు రసీదు కోసం దయచేసి చెల్లింపు స్క్రీన్‌షాట్‌ను వాట్సాప్ ద్వారా మాకు పంపండి."
  },
  donation_whatsapp_cta: {
    en: "Send Screenshot on WhatsApp",
    te: "స్క్రీన్‌షాట్‌ను వాట్సాప్ ద్వారా పంపండి"
  },
  gallery_title: {
    en: "Gallery",
    te: "గ్యాలరీ"
  },
  volunteer_title: {
    en: "Volunteer With Us",
    te: "మాతో సేవ చేయండి"
  },
  volunteer_subtitle: {
    en: "If you wish to offer your time or skills for Annadanam, satram maintenance, or spiritual activities, please share your details.",
    te: "అన్నదానం, సత్రం నిర్వహణ లేదా ఆధ్యాత్మిక కార్యక్రమాల కోసం మీ సమయం లేదా నైపుణ్యాన్ని సేవగా సమర్పించాలనుకుంటే, దయచేసి మీ వివరాలు పంపండి."
  },
  transparency_title: {
    en: "Transparency & Trust",
    te: "పారదర్శకత & నమ్మకం"
  },
  committee_title: {
    en: "Managing Committee",
    te: "నిర్వహణ కమిటీ"
  },
  committee_subtitle: {
    en: "Trust office bearers and committee members.",
    te: "ట్రస్ట్ పదాధికారులు మరియు కమిటీ సభ్యులు."
  },
  contact_title: {
    en: "Contact",
    te: "సంప్రదించండి"
  }
};

export function translate(key: keyof typeof tMap, lang: Language): string {
  return tMap[key]?.[lang] ?? tMap[key]?.en ?? key;
}

/** Section (header) name -> configurable text keys for the Configure tab */
export const CONFIG_SECTIONS: Record<string, (keyof typeof tMap)[]> = {
  Navigation: [
    "nav_home",
    "nav_about",
    "nav_annadanam",
    "nav_activities",
    "nav_donate",
    "nav_gallery",
    "nav_volunteer",
    "nav_committee",
    "nav_contact",
    "nav_configure"
  ],
  "Hero": ["hero_heading", "hero_subtitle", "hero_join_annadanam"],
  "About": ["about_title", "about_body"],
  "Annadanam": ["annadanam_title", "annadanam_body", "annadanam_stats"],
  "Activities": ["activities_title"],
  "Donation": [
    "donation_title",
    "donation_subtitle",
    "donation_upi_label",
    "donation_copy",
    "donation_instructions",
    "donation_whatsapp_cta",
    "donate_now",
    "whatsapp_us"
  ],
  "Gallery": ["gallery_title"],
  "Volunteer": ["volunteer_title", "volunteer_subtitle"],
  "Transparency": ["transparency_title"],
  "Committee": ["committee_title", "committee_subtitle"],
  "Contact": ["contact_title"]
};

