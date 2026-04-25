// Inserts PR card split-stay keys into all 22 language files.
// No translation API — translations are hardcoded.
// Run: node scripts/add-pr-card-keys.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Insert `newLines` text immediately after the line containing `anchorKey: '...'`
function insertAfterKey(src, anchorKey, newLines) {
  const re = new RegExp(
    `([ \\t]*${anchorKey}\\s*:[ \\t]*(?:"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'),?[ \\t]*\\n)`
  );
  if (!re.test(src)) throw new Error(`Anchor key "${anchorKey}" not found in file`);
  return src.replace(re, `$1${newLines}`);
}

function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ── i18n/prCardNote ───────────────────────────────────────────────────────────
const I18N_NOTE = {
  fr: "Si vous êtes devenu résident permanent alors que vous étiez déjà au Canada avec un autre statut, divisez cette période en deux séjours distincts — l'un se terminant à la date de votre carte de RP, l'autre commençant à partir de cette date. La date imprimée au dos de votre carte de RP est utilisée.",
  es: "Si se convirtió en Residente Permanente mientras ya estaba en Canadá con otro estatus, divida ese período en dos estancias separadas — una que termina en la fecha de su tarjeta de RP y otra que comienza desde esa fecha. Se utiliza la fecha impresa en el reverso de su tarjeta de RP.",
  pt: "Se você se tornou Residente Permanente enquanto já estava no Canadá com outro status, divida esse período em duas estadias separadas — uma terminando na data do seu cartão de RP e outra começando a partir dela. A data impressa no verso do seu cartão de RP é utilizada.",
  de: "Wenn Sie Permanent Resident wurden, während Sie bereits mit einem anderen Status in Kanada waren, teilen Sie diesen Zeitraum in zwei separate Aufenthalte auf — einer endet am Ausstellungsdatum Ihrer PR-Karte, der andere beginnt ab diesem Datum. Das auf der Rückseite Ihrer PR-Karte aufgedruckte Datum wird verwendet.",
  it: "Se sei diventato Residente Permanente mentre eri già in Canada con un altro status, dividi quel periodo in due soggiorni separati — uno che termina alla data della tua carta di RP e uno che inizia da quella data. Viene utilizzata la data stampata sul retro della tua carta di RP.",
  pl: "Jeśli zostałeś Stałym Rezydentem, będąc już w Kanadzie na innym statusie, podziel ten okres na dwa oddzielne pobyty — jeden kończący się w dniu wydania karty PR, drugi rozpoczynający się od tej daty. Używana jest data wydrukowana na odwrocie karty PR.",
  ro: "Dacă ați devenit Rezident Permanent în timp ce vă aflați deja în Canada cu un alt statut, împărțiți acea perioadă în două sejururi separate — unul care se termină la data cardului dvs. de RP și unul care începe de la acea dată. Se folosește data tipărită pe spatele cardului dvs. de RP.",
  ru: "Если вы стали постоянным резидентом, находясь в Канаде на другом статусе, разделите этот период на два отдельных пребывания — одно заканчивается датой выдачи вашей карты PR, другое начинается с этой даты. Используется дата, напечатанная на обратной стороне вашей карты PR.",
  uk: "Якщо ви стали постійним резидентом, перебуваючи в Канаді з іншим статусом, розділіть цей період на два окремих перебування — одне закінчується датою вашої картки PR, інше починається з цієї дати. Використовується дата, надрукована на звороті вашої картки PR.",
  tr: "Kanada'da zaten başka bir statüyle bulunurken Daimi Oturum İzni sahibi olduysanız, bu dönemi iki ayrı kalışa bölün — biri PR kartınızın tarihinde sona eren, diğeri bu tarihten başlayan. PR kartınızın arkasında yazılı olan tarih kullanılır.",
  vi: "Nếu bạn trở thành Thường trú nhân trong khi đã ở Canada với tư cách di trú khác, hãy chia khoảng thời gian đó thành hai lần lưu trú riêng biệt — một lần kết thúc vào ngày trên thẻ PR và một lần bắt đầu từ ngày đó. Ngày in trên mặt sau thẻ PR của bạn được sử dụng.",
  ko: "이미 다른 신분으로 캐나다에 체류하는 동안 영주권자가 되셨다면, 해당 기간을 두 개의 별도 체류로 나누세요 — 하나는 PR 카드 날짜에 끝나고, 다른 하나는 그 날짜부터 시작됩니다. PR 카드 뒷면에 인쇄된 날짜가 사용됩니다.",
  ja: "すでに別のステータスでカナダに滞在中に永住権を取得した場合、その期間を2つの別々の滞在に分けてください — 一方はPRカードの発行日に終わり、もう一方はその日から始まります。PRカードの裏面に印刷された日付が使用されます。",
  zh: "如果您在以其他身份在加拿大期间成为永久居民，请将该期间分成两段独立的居留记录——一段在您的PR卡日期结束，另一段从该日期开始。使用您PR卡背面印刷的日期。",
  hi: "यदि आप पहले से किसी अन्य स्थिति में कनाडा में रहते हुए स्थायी निवासी बने हैं, तो उस अवधि को दो अलग-अलग प्रवासों में विभाजित करें — एक आपके पीआर कार्ड की तारीख पर समाप्त होती है, दूसरी उस तारीख से शुरू होती है। आपके पीआर कार्ड के पीछे मुद्रित तारीख का उपयोग किया जाता है।",
  bn: "যদি আপনি ইতিমধ্যে অন্য কোনো মর্যাদায় কানাডায় থাকাকালীন স্থায়ী বাসিন্দা হয়ে থাকেন, তাহলে সেই সময়কালকে দুটি পৃথক থাকায় বিভক্ত করুন — একটি আপনার পিআর কার্ডের তারিখে শেষ হয়, অন্যটি সেই তারিখ থেকে শুরু হয়। আপনার পিআর কার্ডের পিছনে মুদ্রিত তারিখ ব্যবহার করা হয়।",
  gu: "જો તમે પહેલેથી જ અન્ય દરજ્જા સાથે કેનેડામાં હતા ત્યારે કાયમી નિવાસી બન્યા, તો તે સમયગાળાને બે અલગ-અલગ રોકાણમાં વિભાજિત કરો — એક તમારા PR કાર્ડની તારીખ પર સમાપ્ત થાય છે, બીજો તે તારીખથી શરૂ થાય છે. તમારા PR કાર્ડની પાછળ છાપેલ તારીખ ઉપયોગ કરવામાં આવે છે.",
  pa: "ਜੇ ਤੁਸੀਂ ਪਹਿਲਾਂ ਤੋਂ ਹੀ ਕਿਸੇ ਹੋਰ ਦਰਜੇ ਨਾਲ ਕੈਨੇਡਾ ਵਿੱਚ ਰਹਿੰਦੇ ਹੋਏ ਸਥਾਈ ਨਿਵਾਸੀ ਬਣੇ, ਤਾਂ ਉਸ ਸਮੇਂ ਨੂੰ ਦੋ ਵੱਖ-ਵੱਖ ਠਹਿਰਾਂ ਵਿੱਚ ਵੰਡੋ — ਇੱਕ ਤੁਹਾਡੇ PR ਕਾਰਡ ਦੀ ਤਾਰੀਖ 'ਤੇ ਖਤਮ ਹੁੰਦੀ ਹੈ, ਦੂਜੀ ਉਸ ਤਾਰੀਖ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ। ਤੁਹਾਡੇ PR ਕਾਰਡ ਦੇ ਪਿੱਛੇ ਛਾਪੀ ਗਈ ਤਾਰੀਖ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",
  tl: "Kung naging Permanenteng Residente ka habang nasa Canada ka na sa ibang katayuan, hatiin ang panahon na iyon sa dalawang magkahiwalay na pananatili — isa na nagtatapos sa petsa ng iyong PR card at isa na nagsisimula mula sa petsang iyon. Ginagamit ang petsang nakalimbag sa likod ng iyong PR card.",
  fa: "اگر در حالی که با وضعیت دیگری در کانادا بودید به اقامت دائم دست یافتید، آن دوره را به دو اقامت جداگانه تقسیم کنید — یکی در تاریخ کارت پی‌آر شما پایان می‌یابد و دیگری از آن تاریخ شروع می‌شود. از تاریخ چاپ‌شده در پشت کارت پی‌آر شما استفاده می‌شود.",
  ar: "إذا أصبحت مقيمًا دائمًا بينما كنت بالفعل في كندا بوضع آخر، قسّم تلك الفترة إلى إقامتين منفصلتين — واحدة تنتهي في تاريخ بطاقة الإقامة الدائمة، والأخرى تبدأ من ذلك التاريخ. يُستخدم التاريخ المطبوع على ظهر بطاقة الإقامة الدائمة.",
  ur: "اگر آپ پہلے سے کسی اور ویزے پر کینیڈا میں تھے اور مستقل رہائشی بن گئے، تو اس مدت کو دو الگ الگ قیام میں تقسیم کریں — ایک آپ کے PR کارڈ کی تاریخ پر ختم ہوتا ہے، دوسرا اس تاریخ سے شروع ہوتا ہے۔ آپ کے PR کارڈ کی پشت پر چھپی تاریخ استعمال کی جاتی ہے۔",
};

// ── help/content — example block ─────────────────────────────────────────────
const HELP_EXAMPLE = {
  fr: {
    title: 'Exemple',
    line1: 'Jan 2023 – Mar 2024 → Sélectionnez « Autre statut » (visa/travail/études). Ces 15 mois comptent au taux de 2 pour 1.',
    line2: 'Mar 2024 – Jan 2026 → Sélectionnez « Résident permanent ». Ces 22 mois comptent intégralement (1:1).',
  },
  es: {
    title: 'Ejemplo',
    line1: 'Ene 2023 – Mar 2024 → Seleccione "Otro estatus" (visa/trabajo/estudio). Estos 15 meses cuentan a la tasa de 2 por 1.',
    line2: 'Mar 2024 – Ene 2026 → Seleccione "Residente Permanente". Estos 22 meses cuentan en su totalidad (1:1).',
  },
  pt: {
    title: 'Exemplo',
    line1: 'Jan 2023 – Mar 2024 → Selecione "Outro Status" (visto/trabalho/estudo). Esses 15 meses contam na proporção de 2 por 1.',
    line2: 'Mar 2024 – Jan 2026 → Selecione "Residente Permanente". Esses 22 meses contam integralmente (1:1).',
  },
  de: {
    title: 'Beispiel',
    line1: 'Jan 2023 – Mrz 2024 → Wählen Sie „Anderer Status" (Visum/Arbeit/Studium). Diese 15 Monate zählen im Verhältnis 2:1.',
    line2: 'Mrz 2024 – Jan 2026 → Wählen Sie „Permanent Resident". Diese 22 Monate zählen vollständig (1:1).',
  },
  it: {
    title: 'Esempio',
    line1: 'Gen 2023 – Mar 2024 → Seleziona "Altro Stato" (visto/lavoro/studio). Questi 15 mesi contano al tasso di 2 a 1.',
    line2: 'Mar 2024 – Gen 2026 → Seleziona "Residente Permanente". Questi 22 mesi contano per intero (1:1).',
  },
  pl: {
    title: 'Przykład',
    line1: 'Sty 2023 – Mar 2024 → Wybierz „Inny status" (wiza/praca/studia). Te 15 miesięcy liczy się w stosunku 2 do 1.',
    line2: 'Mar 2024 – Sty 2026 → Wybierz „Stały Rezydent". Te 22 miesiące liczą się w pełni (1:1).',
  },
  ro: {
    title: 'Exemplu',
    line1: 'Ian 2023 – Mar 2024 → Selectați „Alt statut" (viză/muncă/studii). Aceste 15 luni contează la rata de 2 la 1.',
    line2: 'Mar 2024 – Ian 2026 → Selectați „Rezident Permanent". Aceste 22 de luni contează integral (1:1).',
  },
  ru: {
    title: 'Пример',
    line1: 'Янв 2023 – Мар 2024 → Выберите «Другой статус» (виза/работа/учёба). Эти 15 месяцев засчитываются в соотношении 2:1.',
    line2: 'Мар 2024 – Янв 2026 → Выберите «Постоянный резидент». Эти 22 месяца засчитываются полностью (1:1).',
  },
  uk: {
    title: 'Приклад',
    line1: 'Січ 2023 – Бер 2024 → Виберіть «Інший статус» (віза/робота/навчання). Ці 15 місяців зараховуються у співвідношенні 2:1.',
    line2: 'Бер 2024 – Січ 2026 → Виберіть «Постійний резидент». Ці 22 місяці зараховуються повністю (1:1).',
  },
  tr: {
    title: 'Örnek',
    line1: 'Oca 2023 – Mar 2024 → "Diğer Statü" seçeneğini seçin (vize/çalışma/öğrenci). Bu 15 ay 2\'ye 1 oranında sayılır.',
    line2: 'Mar 2024 – Oca 2026 → "Daimi Oturum İzni" seçeneğini seçin. Bu 22 ay tam olarak sayılır (1:1).',
  },
  vi: {
    title: 'Ví dụ',
    line1: 'Tháng 1/2023 – Tháng 3/2024 → Chọn "Trạng thái khác" (visa/làm việc/học tập). 15 tháng này tính theo tỷ lệ 2 lấy 1.',
    line2: 'Tháng 3/2024 – Tháng 1/2026 → Chọn "Thường trú nhân". 22 tháng này tính đầy đủ (1:1).',
  },
  ko: {
    title: '예시',
    line1: '2023년 1월 – 2024년 3월 → "기타 신분" 선택 (비자/취업/학생). 이 15개월은 2:1 비율로 적용됩니다.',
    line2: '2024년 3월 – 2026년 1월 → "영주권자" 선택. 이 22개월은 전액 인정됩니다 (1:1).',
  },
  ja: {
    title: '例',
    line1: '2023年1月 – 2024年3月 → 「その他のステータス」を選択（ビザ/就労/学生）。この15ヶ月は2分の1のレートでカウントされます。',
    line2: '2024年3月 – 2026年1月 → 「永住者」を選択。この22ヶ月は全てカウントされます（1:1）。',
  },
  zh: {
    title: '示例',
    line1: '2023年1月 – 2024年3月 → 选择"其他身份"（签证/工作/学习）。这15个月按2比1的比例计算。',
    line2: '2024年3月 – 2026年1月 → 选择"永久居民"。这22个月全额计算（1:1）。',
  },
  hi: {
    title: 'उदाहरण',
    line1: 'जन 2023 – मार 2024 → "अन्य स्थिति" चुनें (वीज़ा/कार्य/अध्ययन)। ये 15 महीने 2-से-1 दर पर गिने जाते हैं।',
    line2: 'मार 2024 – जन 2026 → "स्थायी निवासी" चुनें। ये 22 महीने पूर्णतः गिने जाते हैं (1:1)।',
  },
  bn: {
    title: 'উদাহরণ',
    line1: 'জানু 2023 – মার্চ 2024 → "অন্য মর্যাদা" নির্বাচন করুন (ভিসা/কাজ/পড়াশোনা)। এই 15 মাস 2-এর-বিপরীতে-1 হারে গণনা হয়।',
    line2: 'মার্চ 2024 – জানু 2026 → "স্থায়ী বাসিন্দা" নির্বাচন করুন। এই 22 মাস সম্পূর্ণরূপে গণনা হয় (1:1)।',
  },
  gu: {
    title: 'ઉદાહરણ',
    line1: 'જાન 2023 – માર 2024 → "અન્ય દરજ્જો" પસંદ કરો (વિઝા/કામ/અભ્યાસ). આ 15 મહિના 2-થી-1 દરે ગણાય છે.',
    line2: 'માર 2024 – જાન 2026 → "કાયમી નિવાસી" પસંદ કરો. આ 22 મહિના સંપૂર્ણ ગણાય છે (1:1).',
  },
  pa: {
    title: 'ਉਦਾਹਰਨ',
    line1: 'ਜਨ 2023 – ਮਾਰ 2024 → "ਹੋਰ ਦਰਜਾ" ਚੁਣੋ (ਵੀਜ਼ਾ/ਕੰਮ/ਪੜ੍ਹਾਈ)। ਇਹ 15 ਮਹੀਨੇ 2-ਤੋਂ-1 ਦਰ \'ਤੇ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।',
    line2: 'ਮਾਰ 2024 – ਜਨ 2026 → "ਸਥਾਈ ਨਿਵਾਸੀ" ਚੁਣੋ। ਇਹ 22 ਮਹੀਨੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਗਿਣੇ ਜਾਂਦੇ ਹਨ (1:1)।',
  },
  tl: {
    title: 'Halimbawa',
    line1: 'Ene 2023 – Mar 2024 → Piliin ang "Ibang Katayuan" (visa/trabaho/pag-aaral). Ang 15 buwang ito ay binibilang sa 2-para-sa-1 na rate.',
    line2: 'Mar 2024 – Ene 2026 → Piliin ang "Permanenteng Residente". Ang 22 buwang ito ay binibilang nang buo (1:1).',
  },
  fa: {
    title: 'مثال',
    line1: 'ژانویه 2023 – مارس 2024 ← «وضعیت دیگر» را انتخاب کنید (ویزا/کار/تحصیل). این ۱۵ ماه با نرخ ۲ به ۱ محاسبه می‌شود.',
    line2: 'مارس 2024 – ژانویه 2026 ← «اقامت دائم» را انتخاب کنید. این ۲۲ ماه به طور کامل محاسبه می‌شود (۱:۱).',
  },
  ar: {
    title: 'مثال',
    line1: 'يناير 2023 – مارس 2024 ← اختر "وضع آخر" (تأشيرة/عمل/دراسة). تُحسب هذه الـ 15 شهرًا بمعدل 2 مقابل 1.',
    line2: 'مارس 2024 – يناير 2026 ← اختر "مقيم دائم". تُحسب هذه الـ 22 شهرًا بالكامل (1:1).',
  },
  ur: {
    title: 'مثال',
    line1: 'جنوری 2023 – مارچ 2024 ← "دیگر حیثیت" منتخب کریں (ویزہ/کام/تعلیم)۔ یہ 15 ماہ 2 سے 1 کی شرح پر شمار ہوتے ہیں۔',
    line2: 'مارچ 2024 – جنوری 2026 ← "مستقل رہائشی" منتخب کریں۔ یہ 22 ماہ مکمل شمار ہوتے ہیں (1:1)۔',
  },
};

// ── patch i18n files ──────────────────────────────────────────────────────────
const i18nDir = resolve(__dirname, '..', 'src/i18n');

for (const [lang, text] of Object.entries(I18N_NOTE)) {
  const file = resolve(i18nDir, `${lang}.ts`);
  let src = readFileSync(file, 'utf8');
  if (src.includes('prCardNote')) { console.log(`i18n/${lang}: already patched, skipping`); continue; }
  src = insertAfterKey(src, 'how4', `  prCardNote: '${esc(text)}',\n`);
  writeFileSync(file, src, 'utf8');
  console.log(`i18n/${lang}: done`);
}

// ── patch help/content files ──────────────────────────────────────────────────
const helpDir = resolve(__dirname, '..', 'src/app/help/content');

for (const [lang, { title, line1, line2 }] of Object.entries(HELP_EXAMPLE)) {
  const file = resolve(helpDir, `${lang}.ts`);
  let src = readFileSync(file, 'utf8');
  if (src.includes('a2ExampleTitle')) { console.log(`help/${lang}: already patched, skipping`); continue; }
  const lines =
    `    a2ExampleTitle: '${esc(title)}',\n` +
    `    a2ExampleLine1: '${esc(line1)}',\n` +
    `    a2ExampleLine2: '${esc(line2)}',\n`;
  src = insertAfterKey(src, 'a2', lines);
  writeFileSync(file, src, 'utf8');
  console.log(`help/${lang}: done`);
}

console.log('\nAll done.');
