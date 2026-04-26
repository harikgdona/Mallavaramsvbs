/**
 * Restores committee members to Firestore using the REST API.
 * Run with: node scripts/restore-committee.mjs
 * 
 * NOTE: This uses the public API key - it will only work if Firestore rules
 * allow writes (admin must be authenticated). Since we can't auth here,
 * we'll use the PATCH with updateMask to only touch committeeMembers.
 */

const API_KEY = "AIzaSyCx1URqykD4zlQT3k2m8wNYmrGJ3kL3ex4";
const PROJECT_ID = "mallavaramsvbs";
const DOC_PATH = "config/siteContent";

const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${DOC_PATH}`;

const committeeMembers = [
  { src: "", nameEn: "Sri Gali Narasimha Murthy", nameTe: "శ్రీ గాలి నరసింహ మూర్తి", designationEn: "Honorary President", designationTe: "గౌరవ అధ్యక్షుడు", group: "honorary" },
  { src: "", nameEn: "Sri Doddavarapu Srinivas Siva Rama Krishna", nameTe: "శ్రీ దొడ్డవరపు శ్రీనివాస శివరామకృష్ణ", designationEn: "Honorary Vice President", designationTe: "గౌరవ ఉపాధ్యక్షుడు", group: "honorary" },
  { src: "", nameEn: "Sri Neelamraju Venkata Subba Rao", nameTe: "శ్రీ నీలంరాజు వెంకట సుబ్బా రావు", designationEn: "Honorary Vice President", designationTe: "గౌరవ ఉపాధ్యక్షుడు", group: "honorary" },
  { src: "", nameEn: "Sri Neelamraju Pavan Kumar", nameTe: "శ్రీ నీలంరాజు పవన్ కుమార్", designationEn: "Honorary Vice President", designationTe: "గౌరవ ఉపాధ్యక్షుడు", group: "honorary" },
  { src: "", nameEn: "Sri Neelamraju Subba Santha Rao", nameTe: "శ్రీ నీలంరాజు సుబ్బ శాంతారావు", designationEn: "President", designationTe: "అధ్యక్షుడు", group: "working" },
  { src: "", nameEn: "Sri Gali Venkata Rambabu", nameTe: "శ్రీ గాలి వెంకట రాంబాబు", designationEn: "Vice President", designationTe: "ఉపాధ్యక్షుడు", group: "working" },
  { src: "", nameEn: "Sri Damaraju Venkata Laxmi Raghava Rao", nameTe: "శ్రీ దామరాజు వెంకట లక్ష్మి రాఘవ రావు", designationEn: "Vice President", designationTe: "ఉపాధ్యక్షుడు", group: "working" },
  { src: "", nameEn: "Sri Gali Suneel", nameTe: "శ్రీ గాలి సునీల్", designationEn: "Vice President", designationTe: "ఉపాధ్యక్షుడు", group: "working" },
  { src: "", nameEn: "Sri Rachapudi Sri Krishna", nameTe: "శ్రీ రాచపూడి శ్రీ కృష్ణ", designationEn: "Secretary", designationTe: "సెక్రటరీ", group: "working" },
  { src: "", nameEn: "Sri Gali Satya Rama Koteswara Rao", nameTe: "శ్రీ గాలి సత్యరామ కోటేశ్వర రావు", designationEn: "Treasurer", designationTe: "ఖజానచీ", group: "working" },
  { src: "", nameEn: "Sri Dhenuvakonda Seshagiri Rao", nameTe: "శ్రీ దేనువకొండ శేషగిరి రావు", designationEn: "Joint Secretary", designationTe: "సంయుక్త సెక్రటరీ", group: "working" },
  { src: "", nameEn: "Sri Neelamraju Rama Krishna", nameTe: "శ్రీ నీలంరాజు రామ కృష్ణ", designationEn: "Joint Secretary", designationTe: "సంయుక్త సెక్రటరీ", group: "working" },
  { src: "", nameEn: "Sri Vavilala Gurucharan Das", nameTe: "శ్రీ వావిలాల గురుచరణ దాస్", designationEn: "Member", designationTe: "సభ్యుడు", group: "working" },
  { src: "", nameEn: "Sri Pamidighantam Ranga Rao", nameTe: "శ్రీ పమిడిఘంటం రంగారావు", designationEn: "Member", designationTe: "సభ్యుడు", group: "working" },
  { src: "", nameEn: "Sri Mallavarapu Balakrishna", nameTe: "శ్రీ మల్లవరపు బాలకృష్ణ", designationEn: "Member", designationTe: "సభ్యుడు", group: "working" },
  { src: "", nameEn: "Sri Sakshi Satya Narayana", nameTe: "శ్రీ సాక్షి సత్య నారాయణ", designationEn: "Member", designationTe: "సభ్యుడు", group: "working" },
  { src: "", nameEn: "Sri Guda Chidambara Sastry", nameTe: "శ్రీ గూడ చిదంబర శాస్త్రి", designationEn: "Member", designationTe: "సభ్యుడు", group: "working" },
  { src: "", nameEn: "Sri G.V.S. Chalapathi", nameTe: "శ్రీ జి.వి.ఎస్. చలపతి", designationEn: "Member", designationTe: "సభ్యుడు", group: "working" },
  { src: "", nameEn: "Sri Addanki Venkata Ramana Kiran", nameTe: "శ్రీ అద్దంకి వెంకట రమణ కిరణ్", designationEn: "Member", designationTe: "సభ్యుడు", group: "working" }
];

// Convert to Firestore REST API format
function toFirestoreValue(val) {
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") return { integerValue: String(val) };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === "object" && val !== null) {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

async function run() {
  console.log("Restoring committee members to Firestore...");

  const firestoreMembers = committeeMembers.map(m => toFirestoreValue(m));

  const body = {
    fields: {
      committeeMembers: {
        arrayValue: { values: firestoreMembers }
      }
    }
  };

  const updateMask = "updateMask.fieldPaths=committeeMembers";
  const url = `${BASE_URL}?${updateMask}&key=${API_KEY}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Failed:", err);
    process.exit(1);
  }

  console.log(`✓ Successfully restored ${committeeMembers.length} committee members!`);
  console.log("  - 4 Honorary members");
  console.log("  - 15 Working committee members");
  console.log("\nRefresh the website to see the changes.");
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
