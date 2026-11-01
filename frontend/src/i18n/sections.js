// Display translations for the persona cards, the "How it works" timeline and the footer.
// Keys are the English strings used in those components. Anything missing falls back to English.
const D = {
  // personas
  'Who We Serve': ['हम किनकी सेवा करते हैं', 'आम्ही कोणाची सेवा करतो'],
  'People Like These.': ['इन जैसे लोग।', 'अशा लोकांसाठी.'],
  'Real Benefits.': ['असली लाभ।', 'खरे लाभ.'],
  'From widowed farmers in Osmanabad to students in Meerut — BharatSahayak reaches everyone.': [
    'उस्मानाबाद की विधवा किसानों से लेकर मेरठ के विद्यार्थियों तक — भारतसहायक सब तक पहुंचता है।',
    'उस्मानाबादच्या विधवा शेतकऱ्यांपासून मेरठच्या विद्यार्थ्यांपर्यंत — भारतसहाय्यक सर्वांपर्यंत पोहोचते.'],
  'Example profiles, shown for illustration.': ['उदाहरण प्रोफ़ाइल, केवल समझाने के लिए।', 'उदाहरण प्रोफाइल, फक्त स्पष्टीकरणासाठी.'],
  'Widow Farmer': ['विधवा किसान', 'विधवा शेतकरी'],
  'First-Gen Student': ['पहली पीढ़ी का विद्यार्थी', 'पहिल्या पिढीचा विद्यार्थी'],
  'Street Vendor': ['रेहड़ी-पटरी विक्रेता', 'फेरीवाला'],
  'Osmanabad, Maharashtra': ['उस्मानाबाद, महाराष्ट्र', 'उस्मानाबाद, महाराष्ट्र'],
  'Meerut, Uttar Pradesh': ['मेरठ, उत्तर प्रदेश', 'मेरठ, उत्तर प्रदेश'],
  'Jaipur, Rajasthan': ['जयपुर, राजस्थान', 'जयपूर, राजस्थान'],
  '₹48,000/year': ['₹48,000/वर्ष', '₹48,000/वर्ष'],
  '₹2.2L/year (family)': ['₹2.2 लाख/वर्ष (परिवार)', '₹2.2 लाख/वर्ष (कुटुंब)'],
  '₹1.8L/year': ['₹1.8 लाख/वर्ष', '₹1.8 लाख/वर्ष'],
  'Basic Jio keypad': ['साधारण Jio कीपैड', 'साधा Jio कीपॅड'],
  'Android smartphone': ['Android स्मार्टफ़ोन', 'Android स्मार्टफोन'],
  'No smartphone, no internet, no awareness of widow benefits.': ['न स्मार्टफ़ोन, न इंटरनेट, न विधवा लाभों की जानकारी।', 'स्मार्टफोन नाही, इंटरनेट नाही, विधवा लाभांची माहिती नाही.'],
  'WhatsApp Bot on feature phone + Voice Call in Marathi.': ['फ़ीचर फ़ोन पर WhatsApp बॉट + मराठी में वॉइस कॉल।', 'फीचर फोनवर WhatsApp बॉट + मराठीत व्हॉइस कॉल.'],
  'Missed scholarship deadlines due to lack of information.': ['जानकारी की कमी से छात्रवृत्ति की अंतिम तिथियां छूट गईं।', 'माहितीच्या अभावामुळे शिष्यवृत्तीच्या मुदती चुकल्या.'],
  'WhatsApp reminders + Document checklist in Hindi.': ['WhatsApp रिमाइंडर + हिंदी में दस्तावेज़ सूची।', 'WhatsApp स्मरणपत्रे + हिंदीत कागदपत्रांची यादी.'],
  'MUDRA loan rejected twice due to wrong documents.': ['गलत दस्तावेज़ों के कारण MUDRA ऋण दो बार अस्वीकृत हुआ।', 'चुकीच्या कागदपत्रांमुळे MUDRA कर्ज दोनदा नाकारले गेले.'],
  'AI document guide + Loan eligibility checker.': ['AI दस्तावेज़ मार्गदर्शिका + ऋण पात्रता जांच।', 'AI कागदपत्र मार्गदर्शक + कर्ज पात्रता तपासणी.'],
  Farmer: ['किसान', 'शेतकरी'],
  Widow: ['विधवा', 'विधवा'],
  'No Internet': ['इंटरनेट नहीं', 'इंटरनेट नाही'],
  Student: ['विद्यार्थी', 'विद्यार्थी'],
  Youth: ['युवा', 'तरुण'],
  Scholarship: ['छात्रवृत्ति', 'शिष्यवृत्ती'],
  Urban: ['शहरी', 'शहरी'],
  Business: ['व्यवसाय', 'व्यवसाय'],
  'Loan Eligible': ['ऋण के पात्र', 'कर्जासाठी पात्र'],
  Online: ['ऑनलाइन', 'ऑनलाइन'],
  Offline: ['ऑफ़लाइन', 'ऑफलाइन'],
  'Schemes Eligible': ['पात्र योजनाएं', 'पात्र योजना'],
  'Total Benefit': ['कुल लाभ', 'एकूण लाभ'],
  'Annual Income': ['सालाना आय', 'वार्षिक उत्पन्न'],
  Phone: ['फ़ोन', 'फोन'],
  // timeline
  'How It Works': ['यह कैसे काम करता है', 'हे कसे कार्य करते'],
  'Website → Benefits': ['वेबसाइट → लाभ', 'वेबसाइट → लाभ'],
  'in 5 Steps': ['5 चरणों में', '5 पायऱ्यांत'],
  'Open the website, fill a 2-minute form — done. AI does the rest.': ['वेबसाइट खोलें, 2 मिनट का फ़ॉर्म भरें — बस। बाकी काम AI करता है।', 'वेबसाइट उघडा, 2 मिनिटांचा फॉर्म भरा — झाले. बाकी काम AI करतो.'],
  "Start Now — It's Free": ['अभी शुरू करें — यह मुफ़्त है', 'आता सुरू करा — हे मोफत आहे'],
  'No app download · Works on any phone · 2 minutes': ['ऐप डाउनलोड नहीं · किसी भी फ़ोन पर चलता है · 2 मिनट', 'ॲप डाउनलोड नाही · कोणत्याही फोनवर चालते · 2 मिनिटे'],
  'Open BharatSahayak Website': ['भारतसहायक वेबसाइट खोलें', 'भारतसहाय्यक वेबसाइट उघडा'],
  'Open the BharatSahayak website on any browser — mobile or desktop. No app download needed. Works even on slow connections.': ['किसी भी ब्राउज़र पर भारतसहायक वेबसाइट खोलें — मोबाइल या डेस्कटॉप। ऐप डाउनलोड की ज़रूरत नहीं। धीमे कनेक्शन पर भी चलती है।', 'कोणत्याही ब्राउझरवर भारतसहाय्यक वेबसाइट उघडा — मोबाईल किंवा डेस्कटॉप. ॲप डाउनलोडची गरज नाही. संथ कनेक्शनवरही चालते.'],
  'Fully responsive · Works on any phone browser': ['हर स्क्रीन के अनुकूल · किसी भी फ़ोन ब्राउज़र पर चलता है', 'प्रत्येक स्क्रीनला अनुकूल · कोणत्याही फोन ब्राउझरवर चालते'],
  'Click "Check My Benefits"': ['"मेरे लाभ जांचें" पर क्लिक करें', '"माझे फायदे तपासा" वर क्लिक करा'],
  'Tap the Check My Benefits button on the homepage. You go to a simple 2-minute form. No account needed.': ['होमपेज पर "मेरे लाभ जांचें" बटन दबाएं। आप एक आसान 2 मिनट के फ़ॉर्म पर पहुंचेंगे। खाते की ज़रूरत नहीं।', 'होमपेजवरील "माझे फायदे तपासा" बटण दाबा. तुम्ही एका सोप्या 2 मिनिटांच्या फॉर्मवर पोहोचाल. खात्याची गरज नाही.'],
  '2-minute setup · No documents needed upfront': ['2 मिनट में शुरुआत · पहले से दस्तावेज़ नहीं चाहिए', '2 मिनिटांत सुरुवात · आधी कागदपत्रे नको'],
  'React Form': ['React फ़ॉर्म', 'React फॉर्म'],
  'Fill Your Profile Form': ['अपना प्रोफ़ाइल फ़ॉर्म भरें', 'तुमचा प्रोफाइल फॉर्म भरा'],
  'Answer 5 simple questions: age, gender, state, work and family income. Everything else is optional.': ['5 आसान सवालों के जवाब दें: उम्र, लिंग, राज्य, काम और पारिवारिक आय। बाकी सब वैकल्पिक है।', '5 सोप्या प्रश्नांची उत्तरे द्या: वय, लिंग, राज्य, काम आणि कौटुंबिक उत्पन्न. बाकी सर्व ऐच्छिक आहे.'],
  '5 required answers · Tap to choose · No OTP or PIN': ['5 ज़रूरी जवाब · चुनने के लिए टैप करें · कोई OTP या PIN नहीं', '5 आवश्यक उत्तरे · निवडण्यासाठी टॅप करा · OTP किंवा PIN नाही'],
  'AI Finds Your Schemes': ['AI आपकी योजनाएं ढूंढता है', 'AI तुमच्या योजना शोधतो'],
  'Our rules engine matches your answers against the scheme list instantly, then AI explains your top picks. You can also chat with our WhatsApp bot in Hindi, Marathi or English.': ['हमारा नियम इंजन आपके जवाबों को योजना सूची से तुरंत मिलाता है, फिर AI आपकी शीर्ष योजनाएं समझाता है। आप हमारे WhatsApp बॉट से हिंदी, मराठी या अंग्रेज़ी में भी बात कर सकते हैं।', 'आमचे नियम इंजिन तुमची उत्तरे योजनांच्या यादीशी त्वरित जुळवते, मग AI तुमच्या प्रमुख योजना समजावतो. तुम्ही आमच्या WhatsApp बॉटशी हिंदी, मराठी किंवा इंग्रजीत गप्पाही मारू शकता.'],
  'Instant matching · AI explanation · WhatsApp bot': ['तुरंत मिलान · AI व्याख्या · WhatsApp बॉट', 'त्वरित जुळणी · AI स्पष्टीकरण · WhatsApp बॉट'],
  'Track Benefits in Wallet Dashboard': ['वॉलेट डैशबोर्ड में लाभ ट्रैक करें', 'वॉलेट डॅशबोर्डमध्ये लाभ ट्रॅक करा'],
  'Open your Benefit Wallet. See received, pending, and available benefits. See upcoming deadlines. Apply for schemes with one click — direct link to official portals.': ['अपना लाभ वॉलेट खोलें। प्राप्त, लंबित और उपलब्ध लाभ देखें। आने वाली अंतिम तिथियां देखें। एक क्लिक में आवेदन करें — आधिकारिक पोर्टल का सीधा लिंक।', 'तुमचे लाभ वॉलेट उघडा. मिळालेले, प्रलंबित आणि उपलब्ध लाभ पहा. येणाऱ्या मुदती पहा. एका क्लिकमध्ये अर्ज करा — अधिकृत पोर्टलची थेट लिंक.'],
  'Live dashboard · Deadlines · Direct apply links': ['लाइव डैशबोर्ड · अंतिम तिथियां · सीधे आवेदन लिंक', 'लाइव्ह डॅशबोर्ड · मुदती · थेट अर्ज लिंक'],
  Age: ['उम्र', 'वय'],
  Active: ['सक्रिय', 'सक्रिय'],
  Upcoming: ['आगामी', 'येणारे'],
  Future: ['भविष्य', 'भविष्यात'],
  // footer
  Product: ['उत्पाद', 'उत्पादन'],
  Resources: ['संसाधन', 'संसाधने'],
  Company: ['कंपनी', 'कंपनी'],
  Features: ['विशेषताएं', 'वैशिष्ट्ये'],
  Dashboard: ['डैशबोर्ड', 'डॅशबोर्ड'],
  Schemes: ['योजनाएं', 'योजना'],
  'User Journey': ['यूज़र यात्रा', 'वापरकर्त्याचा प्रवास'],
  'Ayushman Bharat': ['आयुष्मान भारत', 'आयुष्मान भारत'],
  'Widow Pension': ['विधवा पेंशन', 'विधवा निवृत्तीवेतन'],
  'All Schemes →': ['सभी योजनाएं →', 'सर्व योजना →'],
  'About Us': ['हमारे बारे में', 'आमच्याबद्दल'],
  Contact: ['संपर्क', 'संपर्क'],
  'AI that finds what the government owes you — before you even know to ask.': ['AI जो वह ढूंढ लाता है जो सरकार आपको देती है — आपके पूछने से पहले ही।', 'सरकार तुम्हाला जे देणे लागते ते AI शोधतो — तुम्ही विचारण्यापूर्वीच.'],
  'Built with': ['इनसे बना', 'यांच्यासह तयार'],
  'Made with': ['प्यार से बनाया', 'प्रेमाने तयार केले'],
  by: ['द्वारा', 'यांनी'],
  '© 2026 BharatSahayak. All rights reserved.': ['© 2026 भारतसहायक। सर्वाधिकार सुरक्षित।', '© 2026 भारतसहाय्यक. सर्व हक्क राखीव.'],
};

export function translate(lang, text) {
  const row = D[text];
  if (!row) return text;
  if (lang === 'hi') return row[0];
  if (lang === 'mr') return row[1];
  return text;
}

// The footer's second tagline was always Hindi; now it follows the chosen language (English keeps the Hindi flourish).
export function footerTagline(lang) {
  if (lang === 'mr') return '"सरकारी योजनांचा फायदा, कटकटीशिवाय."';
  return '"सरकारी योजनाओं का फायदा, बिना झंझट के।"';
}
