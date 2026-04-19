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
  "nav_temple-history": {
    en: "Temple History",
    te: "ఆలయ చరిత్ర"
  },
  nav_directions: {
    en: "Directions",
    te: "దిశలు"
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
  /** Home ticker (multicolor words). Spaces are preserved; editable in Configure → Hero. */
  live_feed_text: {
    en: " Om Namo Venkateshaya. *** Welcome to Shri Prasannna Venkateshwara Swamy Vaari Brahmotsvalu *** Subharambham on 26th April.",
    te: " ఓం నమో వేంకటేశాయ. *** శ్రీ ప్రసన్న వెంకటేశ్వర స్వామి వారి బ్రహ్మోత్సవాలకు స్వాగతం *** ఏప్రిల్ 26న శుభారంభం."
  },
  /** Home hero footer: horizontal marquee; full schedule from Brahmotsavam flyer (Configure → Hero). */
  home_brahmotsavam_ticker: {
    en:
      "Programs • Apr 26, 2026 (Sun): Ankurarpana • Apr 27, 2026 (Mon): Dhwajarohanam, Sesha Vahanam • Apr 28, 2026 (Tue): Hamsa Vahanam • Apr 29, 2026 (Wed): Simha Vahanam • Apr 30, 2026 (Thu): Hanumantha Vahanam • May 1, 2026 (Fri): Mohini Utsavam, Garuda Vahana Seva • May 2, 2026 (Sat): Gajotsavam • May 3, 2026 (Sun): Kalyana Mahotsavam, Teppotsavam, Rathotsavam • May 4, 2026 (Mon): Ashwa Vahanam • May 5, 2026 (Tue): Dhwaja Avarohanam, Purnahuti • May 6, 2026 (Wed): Chakratheertham, Ekantha Seva • On 3 May 2026, for Swami’s Kalyanotsavam, transport is arranged for devotees coming to Mallavaram. With the cooperation of Nagarjuna Degree College, Ongole, a bus departs from Rajiv Nagar Brahmin Old Age Home at 8:00 AM.",
    te:
      "కార్యక్రమములు • తేది. 26.04.2026 ఆదివారం : అంకురార్పణ • తేది. 27.04.2026 సోమవారం : ధ్వజారోహణము, శేష వాహనము • తేది. 28.04.2026 మంగళవారం : హంస వాహనము • తేది. 29.04.2026 బుధవారం : సింహ వాహనము • తేది. 30.04.2026 గురువారం : హనుమంత వాహనము • తేది. 01.05.2026 శుక్రవారం : మోహినీ ఉత్సవము, గరుడ వాహన సేవ • తేది. 02.05.2026 శనివారం : గజోత్సవము • తేది. 03.05.2026 ఆదివారం : కళ్యాణ మహోత్సవము, తెప్పోత్సవము, రథోత్సవము • తేది. 04.05.2026 సోమవారం : అశ్వ వాహనము • తేది. 05.05.2026 మంగళవారం : ధ్వజ అవరోహణము, పూర్ణాహుతి • తేది. 06.05.2026 బుధవారం : చక్రతీర్థం, ఏకాంత సేవ • 03-05-2026 న స్వామివారి కళ్యాణోత్సవం రోజున మల్లవరం వచ్చు భక్తుల కోసం వాహన సౌకర్యం కల్పించడం అయినది. నాగార్జున డిగ్రీ కాలేజ్ ఒంగోలు వారి సహకారంతో రాజీవ్ నగర్ బ్రాహ్మణ వృద్ధాశ్రమం నుండి ఉదయం 8 గంటలకు బస్సు బయలుదేరును."
  },
  about_title: {
    en: "About Brahmana Satram",
    te: "సంస్థ గురించి"
  },
  about_intro_1: {
    en: "Located in Mallavaram village, Prakasam district, Andhra Pradesh, Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu is a charitable trust dedicated to supporting poor Brahmin families through daily Annadanam, spiritual services, and community support.",
    te: "ఆంధ్రప్రదేశ్, ప్రకాశం జిల్లా, మల్లవరం గ్రామంలో ఉన్న శ్రీ మల్లవరం వెంకటేశ్వర అన్నదాన సమాజం మరియు బ్రాహ్మణ సత్రం అనేది పేద బ్రాహ్మణ కుటుంబాలను అన్నదానం, ఆధ్యాత్మిక సేవలు మరియు సమాజ సహాయం ద్వారా మద్దతు ఇవ్వడానికి అంకితమైన చారిటబుల్ ట్రస్ట్."
  },
  about_intro_2: {
    en: "The satram offers a simple, clean and devotional space where pilgrims, Veda pandits and local families can rest, receive prasadam and participate in traditional dharmic activities with dignity and respect.",
    te: "బ్రాహ్మణ సత్రం ఒక మంచి సాంక్షిప్తమైన మరియు భక్తిపూర్ణమైన స్థలాన్ని అందిస్తుంది, ఇక్కడ యాత్రికులు, వేద పండితులు మరియు స్థానిక కుటుంబాలు విశ్రాంతి పొందవచ్చు, ప్రసాదం పొందవచ్చు మరియు సంప్రదాయ ధార్మిక కార్యకలాపాలలో గౌరవం మరియు మర్యాదతో పాల్గొనవచ్చు."
  },
  about_history_heading: {
    en: "History of Sri Mallavaram Brahmana Satram",
    te: "శ్రీ మల్లవరం బ్రాహ్మణ సత్రం చరిత్ర"
  },
  about_history: {
    en: "The Concept and the need of \"Brahmana Satram\" at Mallavaram came during pre-independence days where Brahmins used to visit Mallavaram for Sri Venkateswara Swamy Brahmostavams and there was no place for them to cook and stay.|In 1950's, Sri Late Gullapalli Gopaiah constructed a permanent Brahmin Satram Facility at the footsteps of Mallavaram hill. From that time, the \"Old Brahmin Satram\" accommodated several Brahmin Families during Brahmostavam days.|Sri Late Gali Venkata Subba Rao (\"Perumallu\") popularised Mallavaram temple and Satram, bringing Varshika Daatalu and itemized funding. He built a strong team of relatives and nurtured young talent.|During 2007, due to the Mallavaram Reservoir project, the old satram was taken by Govt. A new satram was built with 2 rooms, 4 bathrooms and an open hall.|After Covid, a new committee was formed under Sri Gali Narasimha Murthy and Sri Neelamraju Santhiah. They modernized the building, added borewell, toilets, stage, and washing basins.|From 2021 onwards, Karthika Samaradhana with Rudrabhishekam was started. In 2024, monthly \"Annadaana Padhakam\" was initiated.|**** Namo Venkatesaya ****",
    te: "మల్లవరం గ్రామంలో \"బ్రాహ్మణ సత్రం\" అనే ఆలోచన స్వాతంత్ర్యానికి ముందు కాలంలో వచ్చింది. బ్రాహ్మణ కుటుంబాలు బ్రహ్మోత్సవాలకు వచ్చేవారు కానీ వండుకునేందుకు, ఉండేందుకు స్థలం ఉండేది కాదు.|1950 లలో శ్రీ గుళ్ళపల్లి గోపయ్య గారు మల్లవరం కొండ క్రిందన శాశ్వత బ్రాహ్మణ సత్రాన్ని నిర్మించారు. ఆ తరువాత నుండి బ్రహ్మోత్సవాల సమయంలో అనేక కుటుంబాలకు ఆశ్రయం కల్పించింది.|శ్రీ గాలి వెంకట సుబ్బారావు గారు (పెరుమాళ్) మల్లవరం ఆలయం మరియు సత్రాన్ని ప్రజాదరణ పొందేలా చేశారు. వార్షిక దాతలను ఏర్పరచి అన్నదానం కార్యక్రమాన్ని విస్తరించారు.|2007లో రిజర్వాయర్ ప్రాజెక్ట్ కారణంగా పాత సత్రం స్థలం ప్రభుత్వానికి వెళ్లింది. కొత్త సత్రం 2 గదులు, 4 బాత్రూములు మరియు ఓపెన్ హాల్‌తో నిర్మించారు.|కోవిడ్ తరువాత శ్రీ గాలి నరసింహమూర్తి మరియు శ్రీ నీలంరాజు శాంతయ్య గారి మార్గదర్శకత్వంలో కొత్త కమిటీ ఏర్పడింది. సత్రం భవనం ఆధునీకరణ, బోర్‌వెల్, టాయిలెట్లు, స్టేజ్ నిర్మాణం చేశారు.|2021 నుండి కార్తీక సమారాధన రుద్రాభిషేకంతో ప్రారంభించారు. 2024లో నెలవారీ \"అన్నదాన పథకం\" ప్రారంభించారు.|*** నమో వెంకటేశాయ ***"
  },
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
    en: "Cultural & Dharmic Programs",
    te: "సాంస్కృతిక మరియు ధార్మిక కార్యకలాపాలు"
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
  committee_honorary_heading: {
    en: "Honorary Members",
    te: "గౌరవ సభ్యులు"
  },
  committee_working_heading: {
    en: "Working Committee Members",
    te: "కార్యనిర్వహణ కమిటీ సభ్యులు"
  },
  committee_table_designation: {
    en: "Designation",
    te: "హోదా"
  },
  committee_table_name: {
    en: "Name",
    te: "పేరు"
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
    "Hero": ["hero_heading", "live_feed_text", "home_brahmotsavam_ticker"],
  "About": ["about_title", "about_intro_1", "about_intro_2", "about_history_heading", "about_history"],
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
  "Committee": [
    "committee_title",
    "committee_subtitle",
    "committee_honorary_heading",
    "committee_working_heading",
    "committee_table_designation",
    "committee_table_name"
  ],
  "Contact": ["contact_title"]
};

