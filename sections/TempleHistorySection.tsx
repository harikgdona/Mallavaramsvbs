"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useLanguage } from "@/components/LanguageProvider";

const historyTe = [
  `నారదుడు ప్రతిష్టించిన నారాయణుడు కలియుగ వరదుడైన శ్రీ వేంకటేశ్వరుడు ఎన్నో క్షేత్రాలలో కొలువు తీరి భక్తులకు వరప్రదాయనునిగా దర్శమిస్తున్నారు. మన దేశంలోనే కాదు విదేశాలలో కూడా స్వామి స్థానం ఏర్పరచుకున్నారు.`,
  `మన రాష్ట్రంలోనే ఉన్న అనేక శ్రీనివాసుని కోవెలల విషయం మనలో చాలా మందికి తెలియదు. అలాంటి ఒక పుణ్య తీర్ధ క్షేత్రం ప్రకాశం జిల్లాలోని మల్లవరం. నాలుగు యుగాలలో ప్రసిద్ధికెక్కిన క్షేత్రం మల్లవరం. చరిత్రలో స్థానం పొందిన ప్రదేశం మల్లవరం. భక్తులకు దర్శనీయ ఆలయం మల్లవరం.`,
  `ఒకనాడు గరుడవాహనుడు ఆకాశ మార్గాన వెళుతూ నదీతీరంలో పచ్చని ఫలవృక్షాలతో నిండిన పర్వత శోభను చూసి దిగి కొంతసేపు విహరించారట. ఈ ఉదంతాన్ని లోకసంచారి నిరంతర నారాయణ మంత్ర జపధారి అయిన నారద మహర్షి ఇక్కడ తపస్సు చేసుకొంటున్న మునులకు తెలియచేశారట.`,
  `మునివాటికగా ప్రసిద్ధికెక్కిన నదీతీరం లోని మహర్షులకు ఎవరిని అర్చామూర్తిగా స్థాపించుకోవాలి అన్న సందేహం తలెత్తిన సందర్భంలో నారద మహర్షి నారాయణుడు సంచరించిన ప్రదేశంలో శ్రీ మన్నారాయణుని శ్రీ వెంకటేశ్వర రూపంలో ప్రతిష్టించుకోవడం ఉచితం అని మార్గదర్శకత్వం చేశారట. ఆయనే మునుల కోరిక మేరకు శ్రీవారి మూలవిరాట్టును ప్రతిష్టించారట. ఆ విధంగా వైకుంఠవాసుడు గుండ్లకమ్మ తీరవాసి అయ్యారు.`,
  `పదునాల్గవ శతాబ్దంలో అద్దంకి రాజధానిగా రెడ్డి రాజ్యాన్ని స్థాపించిన ప్రోలయ వేమా రెడ్డి తన తమ్ముడు మల్లారెడ్డి నేతృత్వంలో కందుకూరు దుర్గం మీదకు సేనను పంపారు. యుద్ధంలో గెలిచారు. కానీ చోటు చేసుకున్న అనవసర ప్రాణనష్టం మల్లారెడ్డిని బాధ పెట్టినది.`,
  `వేమా రెడ్డి తమ్ముడిలో ఏర్పడిన ఉదాసీనతను తొలగించడానికి గుండ్లకమ్మ తీరంలో అతని పేరు మీద ఒక గ్రామాన్ని ఏర్పాటు చేసారు. అక్కడ కొండ మీద నెలకొనివున్న పురాతన శ్రీ వెంకటేశ్వర స్వామి ఆలయాన్ని పునః నిర్మించే బాధ్యతలను అప్పగించారు. శ్రీవారి సేవలో మల్లా రెడ్డిలో అపరాధభావం తొలగిపోయింది. ఆ విధంగా మల్లవరం గ్రామం ఏర్పడింది.`,
  `గుండ్లకమ్మ నది నల్లమల అడవులలో గుండ్ల బ్రహ్మశ్వరం వద్ద జన్మించి సుమారు రెండువందల కిలోమీటర్ల దూరం ప్రవహించి ప్రకాశం జిల్లా లోని ఉలిచి వద్ద సాగరంతో సంగమిస్తుంది.`,
  `చిన్న పర్వతం మీద ఉన్న ఆలయం వద్దకు చేరుకోడానికి రహదారి మార్గం ఉన్నది. పర్వత పాదాల వద్ద శ్రీ గణపతి సన్నిధి మరియు క్షేత్రపాలకుడైన శ్రీ దాసాంజనేయ స్వామి సన్నిధి ఉంటాయి. మెట్లకు ఇరుపక్కలా శ్రీ అంజనా తనయుడు మరియు శ్రీ వినుతా సుతుడు ముకుళిత హస్తాలతో భక్తులకు దర్శనమిస్తారు.`,
  `అయిదు అంతస్థుల రాజగోపురం గుండా ప్రాంగణం లోనికి ప్రవేశిస్తే ఎత్తైన ధ్వజస్థంభం, బలిపీఠాలు మరియు శ్రీ గరుత్మంతుని సన్నిధి కనిపిస్తాయి. గర్భాలయంలో రమణీయ పుష్ప స్వర్ణాభరణ అలంకరణలో కలియుగ దైవం శ్రీ వెంకటేశ్వర స్వామి స్థానక భంగిమలో నయానందకరమైన దర్శనాన్ని ప్రసాదిస్తారు.`,
  `నిత్యం నాలుగు పూజలు జరిగే ఆలయంలో వినాయక చవితి, హనుమజ్జయంతి, తొలి ఏకాదశి, వైకుంఠ ఏకాదశి, ధనుర్మాస పూజలు, శ్రీ రామనవమి, శ్రీ కృష్ణ జన్మాష్టమి, ఉగాది ఆస్థానం ఘనంగా నిర్వహిస్తారు. చైత్రమాసంలో ఆలయ ఉత్సవాలు రంగరంగ వైభవంగా జరుపుతారు.`,
  `ఆలయం ఉదయం ఆరు నుండి పన్నెండు వరకు, సాయంత్రం నాలుగు నుండి రాత్రి ఎనిమిది వరకు తెరిచి ఉంటుంది. మల్లవరం కు ఒంగోలు పట్టణం నుండి సులభంగా రోడ్డు మార్గంలో చేరుకోవచ్చును (ఇరవై కిలోమీటర్లు).`,
  `ఓం నమో నారాయణాయ!`,
];

const historyEn = [
  `Sri Venkateswara Swami, installed by Sage Narada himself, graces devotees across countless sacred sites as the benevolent deity of Kali Yuga. His divine presence extends not only across India but also to temples abroad.`,
  `Among the many Srinivasa temples in our state, one sacred pilgrimage site stands out in Prakasam district: Mallavaram. A place renowned across all four Yugas, a place that has earned its mark in history, a temple that every devotee must visit.`,
  `According to legend, Lord Vishnu on his Garuda mount once descended upon seeing the lush green hills along the riverbank. Sage Narada, the eternal wanderer and chanter of Narayana mantra, informed the sages performing penance here about this divine visit.`,
  `When the sages wondered which deity to install, Narada guided them to consecrate Lord Narayana in the form of Sri Venkateswara at the very spot where the Lord had visited. Narada himself installed the Moola Virat (original deity). Thus, the Lord of Vaikunta became the resident of the Gundlakamma riverbank.`,
  `In the 14th century, Prolaya Vema Reddy, who established the Reddy kingdom with Addanki as capital, sent his brother Malla Reddy to conquer Kandukur fort. Though victorious, the unnecessary loss of life deeply troubled Malla Reddy.`,
  `To lift his brother's spirits, Vema Reddy established a village in his name along the Gundlakamma river and entrusted him with rebuilding the ancient Sri Venkateswara Swami temple atop the hill. Through service to the Lord, Malla Reddy found peace. Thus the village of Mallavaram was born.`,
  `The Gundlakamma river originates in the Nallamala forests at Gundla Brahmeswaram and flows approximately 200 kilometers before merging with the sea near Ulichi in Prakasam district.`,
  `The temple sits atop a small hill accessible by road. At the foot of the hill are the shrines of Sri Ganapati and Sri Dasanjaneya Swami (the Kshetrapalaka). Steps lead up to the temple with Sri Anjana Tanayudu and Sri Vinuta Sutudu greeting devotees with folded hands on either side.`,
  `Entering through the five-storied Rajagopuram, one sees the tall Dhwajasthambham, Balipeethas, and the shrine of Sri Garutmantudu. In the sanctum sanctorum, the Kali Yuga deity Sri Venkateswara Swami stands in a magnificent posture adorned with flowers and golden ornaments, blessing all who seek his darshan.`,
  `The temple conducts four daily pujas and celebrates Vinayaka Chavithi, Hanuman Jayanti, Toli Ekadashi, Vaikuntha Ekadashi, Dhanurmas Pujas, Sri Rama Navami, Sri Krishna Janmashtami, and Ugadi with great grandeur. The annual Brahmotsavams in Chaitra month are celebrated with spectacular splendor.`,
  `The temple is open from 6 AM to 12 PM and 4 PM to 8 PM. Mallavaram is easily accessible by road from Ongole town (20 kilometers).`,
  `Om Namo Narayanaya!`,
];

export function TempleHistorySection() {
  const { language } = useLanguage();
  const history = language === "te" ? historyTe : historyEn;

  return (
    <SectionContainer id="temple-history">
      <h2 className="section-heading">
        {language === "te"
          ? "శ్రీ వెంకటేశ్వర స్వామి ఆలయ చరిత్ర"
          : "Sri Venkateswara Swami Temple History"}
      </h2>
      <p className="section-subtitle mb-6">
        {language === "te"
          ? "మల్లవరం, ప్రకాశం జిల్లా"
          : "Mallavaram, Prakasam District"}
      </p>
      <div className="bg-white rounded-3xl border border-maroon/10 shadow-sm p-5 md:p-8">
        <div className="space-y-4 text-sm md:text-base text-text-dark/85 leading-relaxed">
          {history.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
