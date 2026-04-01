"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";

const historyEn = [
  `The Concept and the need of "Brahmana Satram" at Mallavaram came during pre-independence days where Brahmins used to visit Mallavaram for Sri Venkateswara Swamy Brahmostavams and there was no place for them to cook and stay. We heard that some locals (Named as Gajula vallu) helped them by putting temporary tents for the same need.`,
  `In 1950's, Sri Late Gullapalli Gopaiah played a key role of collecting funds from local Village people, neighbour villages and brahmin families and constructed a permanent Brahmin Satram Facility (We call that as Old Satram) at the footsteps of Mallavaram hill. From that time, Our "Old Brahmin Satram" stood as a facilitator to accommodate several Brahmin Families during Swami Vaari Brahmostavam days and any other Auspicious functions performed at temple or for the individuals. There were multiple people who helped running this Satram during those tough days where funding was not easy and also getting the raw material for cooking (wood, Water, Grocery, Vegetables) and the logistics were definitely challenging.`,
  `Sri Late Gali Satya Narayana Rao (Sattiah Garu) managed that initially and it came to Sri Late Gali Venkata Subba Rao Garu during 1970-80 term. Sri Late Gali Venkata Subba Rao (Called as "Perumallu") played a key role in popularising Mallavaram temple and Satram and took this Annadanam to next level by bringing Varshika Daatalu and also Itemized funding (Rice, Vegetables, Kandipappu) etc. He made a strong team by bringing his Mallavaram relatives Sri Neelamraju Seetha Ramanjaneyulu, Sri Neelamraju Nageswara Rao, Sri Gali Kanchi Raju and Sri Neelamraju Anjaneyulu. He also nurtured some young talent like Addanki Rama Chandra Rao, Vinjanampati Rama Rao, Sri Gali Venkateswarlu etc., not only to sing famous "Tarangalu" in our satram but also to actively participate in Satram activities.`,
  `During 2007, due to Mallavaram Reservoir project, the old satram was taken by Govt as it was coming under the project land. The AP Govt then allocated a separate land to Brahmana Satram in the current place and Sri Late Gullapalli Adinarayana Rao and his son Sri Gullapalli Krishnaiah (Working as Judge that time) really helped getting the land allocated to our Brahmana satram in the current place.`,
  `Sri Gali Venkata Subba Rao ran a marathon funding campaign to build our new satram with 2 rooms, 4 bath rooms and an open hall to begin with. After demise of Sri G.V. Subba Rao garu, the Satram was managed well by Neelamraju Brothers and Sri Gali Rambabu and few relatives pitched in wherever it was required.`,
  `After Covid year, a new committee was formed for the Satram under the guidance of Sri Gali Narasimha Murthy and Sri Neelamraju Santhiah. The New committee was fully energized, brought technology into execution (WhatsApp, QR code etc.) and formalized the process with Govt to get the registration, 80G/12A permission etc. With the blessings of Lord Venkateswara and the encouragement of our Brahmin brothers/sisters all over the world, they were able to get good funding and modernized the existing building and extended it. This includes bringing a dedicated borewell for satram, modernizing the toilets, constructing stage, fitting the washing basins etc.`,
  `From 2021 onwards, Brahmana satram started celebrating Karthika Samaradhana also with Rudrabhishekam followed by lunch along with continuation of dinner and lunch for brahmostavam days.`,
  `In 2024, Satram initiated "Annadaana Padhakam" on monthly basis. Based on this programme, every 2nd Saturday/Sunday lunch is provided at our satram. There is a plan to do this 4 days in a month (every Saturday). There are also plans to do annadanam on Vaikunta Ekadasi and few more auspicious days.`,
  `Our current committee has people with diversified fields who bring lot of value addition to the ideas and execution. We will continue to find/induct them in our committee to expand and serve our Brahmin community who comes and visits our Mallavaram Venkateswara Swamy.`,
  `**** Namo Venkatesaya ****`,
];

const historyTe = [
  `మల్లవరం గ్రామంలో, స్వామి సన్నిధానం దగ్గర "బ్రాహ్మణ సత్రం" అనే ఆలోచన స్వాతంత్ర్యానికి ముందు కాలంలో వచ్చింది. అప్పట్లో బ్రాహ్మణ కుటుంబాలు వేరే ప్రాంతాల నుండి మల్లవరం శ్రీ వెంకటేశ్వర స్వామి బ్రహ్మోత్సవాలకు వచ్చేవారు. కానీ వారికి వండుకునేందుకు, ఉండేందుకు సరైన స్థలం ఉండేది కాదు. ఆ సమయంలో కొంతమంది స్థానికులు (గాజుల వారు) తాత్కాలిక గుడారాలు ఏర్పాటు చేసి సహాయం చేసినట్లు తెలిసినది.`,
  `1950 లలో శ్రీ గుళ్ళపల్లి గోపయ్య గారు గ్రామ ప్రజలు, పరిసర గ్రామాలు మరియు బ్రాహ్మణ కుటుంబాల నుండి విరాళాలు సేకరించి, మల్లవరం కొండ క్రిందన శాశ్వత బ్రాహ్మణ సత్రాన్ని నిర్మించారు (దీనిని "పాత సత్రం" అని పిలుస్తాము). ఆ తరువాత నుండి ఈ పాత సత్రం, స్వామివారి బ్రహ్మోత్సవాల సమయంలో మరియు ఇతర శుభకార్యాల కోసం వచ్చిన అనేక బ్రాహ్మణ కుటుంబాలకు ఆశ్రయం కల్పించింది. ఆ రోజుల్లో నిధులు సేకరించడం, వంట కోసం కావలసిన సామగ్రి (వంట చెరుకు, నీరు, కూరగాయలు, సరుకులు) పొందడం చాలా కష్టంగా ఉండేది. అయినప్పటికీ అనేక మంది సహకరించారు.`,
  `శ్రీ గాలి సత్యనారాయణ రావు గారు (సత్తయ్య గారు) మొదట ఈ సత్రాన్ని నిర్వహించారు. తరువాత 1970-80 మధ్య కాలంలో శ్రీ గాలి వెంకట సుబ్బారావు గారు (పెరుమాళ్) బాధ్యతలు తీసుకున్నారు. ఆయన మల్లవరం ఆలయం మరియు సత్రాన్ని ప్రజాదరణ పొందేలా చేశారు. వార్షిక దాతలను ఏర్పరచడం, బియ్యం, కూరగాయలు, కందిపప్పు వంటి పదార్థాల రూపంలో విరాళాలను పొందటం ద్వారా అన్నదానం కార్యక్రమాన్ని విస్తరించారు. ఆయన తన సమీప బ్రాహ్మణ బంధువులను కూడా ఈ సేవలో భాగస్వామ్యం చేశారు — శ్రీ నీలంరాజు సీతారామాంజనేయులు గారు, శ్రీ నీలంరాజు నాగేశ్వరరావు గారు, శ్రీ గాలి కంచి వరదరాజు గారు మరియు శ్రీ నీలంరాజు ఆంజనేయులు గారు. అలాగే శ్రీ అద్దంకి రామచంద్రరావు, శ్రీ వింజనంపాటి రామారావు, శ్రీ గాలి వెంకటేశ్వర్లు వంటి వారిని "తరంగాలు" పాడేందుకు మరియు సత్ర సేవల్లో పాల్గొనడానికి ప్రోత్సహించారు.`,
  `2007లో మల్లవరం రిజర్వాయర్ ప్రాజెక్ట్ కారణంగా పాత సత్రం స్థలం ప్రభుత్వానికి వెళ్లింది. తరువాత ఆంధ్రప్రదేశ్ ప్రభుత్వం కొత్త స్థలాన్ని కేటాయించింది. ఈ భూమి కేటాయింపులో శ్రీ గుళ్ళపల్లి ఆదినారాయణ రావు గారు మరియు ఆయన కుమారుడు శ్రీ గుళ్ళపల్లి కృష్ణయ్య గారు (ఆ సమయంలో న్యాయమూర్తి) ముఖ్య పాత్ర పోషించారు.`,
  `శ్రీ గాలి వెంకట సుబ్బారావు గారు నూతన సత్ర నిర్మాణానికి విస్తృతంగా నిధులు సేకరించారు. ప్రారంభంలో 2 గదులు, 4 బాత్రూములు మరియు ఓపెన్ హాల్‌తో నిర్మించారు. ఆయన మరణానంతరం, శ్రీ నీలంరాజు సోదరులు, శ్రీ గాలి రాంబాబు గారు మరియు ఇతర బ్రాహ్మణ బంధువులు సత్రాన్ని సమర్థంగా నిర్వహించారు.`,
  `కోవిడ్ మహమ్మారి తరువాత, శ్రీ గాలి నరసింహమూర్తి గారు మరియు శ్రీ నీలంరాజు శాంతయ్య గారి మార్గదర్శకత్వంలో కొత్త కమిటీ ఏర్పడింది. వారు కమిటీని official గా register చేయడం, WhatsApp/UPI వినియోగం, 80G/12A అనుమతులు పొందడం మరియు నిధుల సేకరణను మెరుగు పరచడం వంటి పనులు చేశారు. ఈ నిధులతో సత్రం భవనం విస్తరణ, బోర్‌వెల్ ఏర్పాటు, టాయిలెట్ల ఆధునీకరణ, స్టేజ్ నిర్మాణం, వాష్ బేసిన్లు ఏర్పాటు చేశారు.`,
  `2021 నుండి "కార్తీక సమారాధన" కూడా ప్రారంభించారు — రుద్రాభిషేకం అనంతరం అన్నదానం నిర్వహిస్తున్నారు. బ్రహ్మోత్సవాల సమయంలో ఏనుగు ఉత్సవం రాత్రి మరియు కళ్యాణం రోజు అల్పాహారం మరియు మధ్యాహ్న భోజనం అన్నదాన ప్రసాదంగా అందిస్తున్నారు.`,
  `2024లో "అన్నదాన పథకం" ప్రారంభించారు. ప్రతి నెల 2వ శనివారము మరియు ఆదివారము రోజులలో మల్లవరం బ్రాహ్మణ సత్రంలో అన్న ప్రసాద వినియోగం జరుగుతున్నది. భవిష్యత్తులో ప్రతి శనివారం (నెలకు 4 సార్లు) నిర్వహించే ప్రణాళిక ఉన్నది. వైకుంఠ ఏకాదశి మరియు ఇతర శుభ దినాల్లో కూడా అన్నప్రసాద వినియోగం నిర్వహించాలనే యోచన ఉంది.`,
  `ప్రస్తుతం కమిటీలో వివిధ రంగాలకు చెందిన వ్యక్తులు ఉన్నారు. వారు తమ అనుభవంతో కొత్త ఆలోచనలు తీసుకువచ్చి విజయవంతంగా అమలు చేస్తున్నారు. భవిష్యత్తులో కూడా కొత్త సభ్యులను చేర్చుకుని, మల్లవరం శ్రీ వెంకటేశ్వర స్వామి గుడి గురించి విస్తృత సమాచారం అందించుట మరియు దర్శనానికి వచ్చే బ్రాహ్మణులకు సేవలను విస్తరించాలనే లక్ష్యంతో ముందుకు సాగుతున్నారు.`,
  `*** నమో వెంకటేశాయ ***`,
];

export function About() {
  const t = useTranslate();
  const { language } = useLanguage();
  const history = language === "te" ? historyTe : historyEn;

  return (
    <SectionContainer id="about">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="section-heading">{t("about_title")}</h2>
          <p className="section-subtitle mb-4">
            {t("about_body")}
          </p>
          <p className="text-sm md:text-base text-text-dark/80">
            The satram offers a simple, clean and devotional space where pilgrims,
            Veda pandits and local families can rest, receive prasadam and participate
            in traditional dharmic activities with dignity and respect.
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-md border border-maroon/10 p-5 md:p-6">
          <h3 className="font-heading text-lg md:text-xl text-maroon mb-3">
            Mallavaram – A Village of Dharma
          </h3>
          <p className="text-sm md:text-base text-text-dark/80 mb-3">
            Mallavaram is a small village in Prakasam district, Andhra Pradesh, with
            a rich tradition of Vedic learning and temple worship. Many elderly and
            poor Brahmin families reside here with limited income.
          </p>
          <p className="text-sm md:text-base text-text-dark/80">
            Through this trust, devotees across India and abroad can directly support
            these families and sustain the dharmic atmosphere of the village.
          </p>
        </div>
      </div>

      {/* History section */}
      <div className="mt-10 bg-white rounded-3xl border border-maroon/10 shadow-sm p-5 md:p-8">
        <h3 className="font-heading text-lg md:text-xl text-maroon mb-5">
          {language === "te"
            ? "శ్రీ మల్లవరం బ్రాహ్మణ సత్రం చరిత్ర"
            : "History of Sri Mallavaram Brahmana Satram"}
        </h3>
        <div className="space-y-4 text-sm md:text-base text-text-dark/85 leading-relaxed">
          {history.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
