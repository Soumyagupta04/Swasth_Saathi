/**
 * Local Translation Dictionaries for Swasthya Saathi CG
 * Supports: English (en), Hindi (hi), Chhattisgarhi (cg)
 */

export const translations = {
  en: {
    app_title: 'Swasthya Saathi CG',
    tagline: 'Aapke Saath, Har Kadam Par',
    online: 'Online',
    offline: 'Offline',
    offline_badge: 'Offline Mode Active',
    greeting: 'Welcome to Swasthya Saathi',
    app_desc: 'Helping you find nearby verified doctors, hospitals, and essential healthcare facilities in Raipur district.',
    call_ambulance: '🚑 CALL AMBULANCE (108)',
    call_ambulance_sub: 'Free 24x7 Emergency Service',
    search_placeholder: 'Search doctors, hospitals or health services...',
    card_hospitals_title: 'Hospitals',
    card_hospitals_desc: 'Find government & private hospitals',
    card_doctors_title: 'Doctors',
    card_doctors_desc: 'Find verified specialists near you',
    card_saved_title: 'Saved',
    card_saved_desc: 'Quick access to saved facilities',
    card_pack_title: 'Offline Healthcare Pack',
    card_pack_desc: 'Download hospitals, doctors, and medical stores for offline use',
    
    // Bottom Navigation
    nav_home: 'Home',
    nav_nearby: 'Nearby',
    nav_medical_stores: 'Stores',
    nav_saved: 'Saved',
    nav_more: 'More',

    medical_stores_title: 'Medical Stores',
    medical_stores_sample_notice: 'Temporary sample entries for the app prototype only. These are not real or verified medical stores.',
    medical_store_sample_label: 'Sample only',
    
    // Nearby Sub-tabs
    tab_hospitals: 'Hospitals',
    tab_doctors: 'Doctors',
    filter_all: 'All',
    filter_gov: 'Government',
    filter_pvt: 'Private',
    facility_clinic: 'Clinic',
    refresh_location: 'Refresh Location',
    location_accuracy: 'Location: Raipur District',
    
    // Card buttons & labels
    btn_directions: 'Directions',
    btn_call: 'Call',
    btn_save: 'Save',
    btn_saved: 'Saved',
    btn_details: 'View Details',
    label_distance: 'km away',
    label_specialty: 'Specialty',
    label_hospital: 'Hospital',
    label_address: 'Address',
    label_phone: 'Phone',
    label_emergency: 'Emergency No.',
    label_website: 'Website',
    label_verified: 'Verified Official',
    label_source: 'Source',
    label_last_verified: 'Last Verified',
    label_not_available: 'Not available',
    
    // Saved screen
    saved_title: 'Saved Healthcare Facilities',
    saved_hospitals: 'Saved Hospitals',
    saved_doctors: 'Saved Doctors',
    saved_medical_stores: 'Saved Stores',
    nothing_saved: 'Nothing saved yet.',
    nothing_saved_hint: 'Tap the bookmark icon on any hospital or doctor to save it for quick access offline.',
    
    // Offline Mode Section
    offline_welcome: 'Welcome to Offline Mode',
    offline_explainer: 'You are browsing stored Raipur healthcare data. Basic navigation and contact numbers work without an active internet connection.',
    offline_pack_status: 'Raipur Healthcare Pack Status',
    pack_version: 'Pack Version',
    pack_updated: 'Last Updated',
    pack_downloaded: 'Downloaded on this device',
    pack_not_downloaded: 'Pack not downloaded yet',
    btn_download_pack: 'Download Raipur Healthcare Pack',
    btn_redownload_pack: 'Update Raipur Healthcare Pack',
    pack_downloading: 'Downloading healthcare pack...',
    pack_download_success: 'Raipur Healthcare Pack downloaded successfully!',
    pack_download_error: 'Failed to download pack. Please check backend connection.',
    
    // Emergency numbers
    emergency_title: 'Emergency Contacts (Raipur & CG)',
    em_108: '108 - Emergency Ambulance Service',
    em_102: '102 - Free Maternity & Infant Ambulance',
    em_104: '104 - Chhattisgarh Health Information Helpline',
    em_112: '112 - All-in-One Emergency Helpline',
    
    // About
    about_title: 'About Swasthya Saathi CG',
    about_disclaimer: 'DISCLAIMER: This application provides healthcare navigation only. It DOES NOT provide medical diagnosis, treatment, prescriptions, or AI-generated medical advice.',
    
    // Errors & feedback
    loc_needed: 'Location access is needed to find healthcare near you.',
    loc_denied: 'Location access was declined. Using central Raipur as the default location.',
    loc_fetching: 'Finding your location in Raipur...',
    no_results: 'No matching healthcare facilities found.',
    backend_offline: 'Backend is offline. Switched to offline data mode.',
    item_saved: 'Saved successfully!',
    item_removed: 'Removed from saved items!',
    
    // Voice search
    voice_search: 'Voice Search',
    voice_listening: 'Listening... Speak now',
    voice_not_supported: 'Voice search is not supported in this browser.',
    voice_permission_denied: 'Microphone permission denied.',
    voice_no_speech: 'No speech detected. Please try again.',
    voice_offline: 'Voice search is unavailable in offline mode.',
    voice_insecure_context: 'Voice search requires HTTPS or localhost.',

    // Healthcare pack & version status
    pack_latest_downloaded: 'Latest version already downloaded',
    pack_update_available: 'New update available',
    pack_offline_cannot_check: 'Offline: Cannot check for updates',
    internet_unavailable_offline: 'Internet connection unavailable. Staying in Offline Mode.',
    
    // Auto sync
    sync_updating: 'Updating healthcare information...',
    sync_updated: 'Healthcare information updated',
  },
  
  hi: {
    app_title: 'स्वास्थ्य साथी छ.ग.',
    tagline: 'आपके साथ, हर कदम पर',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    offline_badge: 'ऑफलाइन मोड सक्रिय',
    greeting: 'स्वास्थ्य साथी में आपका स्वागत है',
    app_desc: 'रायपुर जिले में नजदीकी सत्यापित डॉक्टर, अस्पताल और आवश्यक स्वास्थ्य सुविधाएं खोजने में आपकी मदद करता है।',
    call_ambulance: '🚑 एम्बुलेंस बुलाएं (108)',
    call_ambulance_sub: 'निःशुल्क 24x7 आपातकालीन सेवा',
    search_placeholder: 'डॉक्टर, अस्पताल या स्वास्थ्य सेवा खोजें...',
    card_hospitals_title: 'अस्पताल',
    card_hospitals_desc: 'सरकारी और निजी अस्पताल खोजें',
    card_doctors_title: 'डॉक्टर',
    card_doctors_desc: 'अपने पास के विशेषज्ञ डॉक्टर खोजें',
    card_saved_title: 'सहेजे गए',
    card_saved_desc: 'सहेजी गई सुविधाओं तक त्वरित पहुंच',
    card_pack_title: 'ऑफलाइन स्वास्थ्य पैक',
    card_pack_desc: 'ऑफलाइन उपयोग के लिए अस्पताल, डॉक्टर और दवा दुकानों की जानकारी डाउनलोड करें',
    
    nav_home: 'होम',
    nav_nearby: 'नजदीकी',
    nav_medical_stores: 'दवा दुकान',
    nav_saved: 'सहेजे गए',
    nav_more: 'अधिक',

    medical_stores_title: 'दवा की दुकानें',
    medical_stores_sample_notice: 'ये केवल ऐप के नमूने के लिए अस्थायी प्रविष्टियां हैं। ये असली या सत्यापित दवा की दुकानें नहीं हैं।',
    medical_store_sample_label: 'केवल नमूना',
    
    tab_hospitals: 'अस्पताल',
    tab_doctors: 'डॉक्टर',
    filter_all: 'सभी',
    filter_gov: 'सरकारी',
    filter_pvt: 'निजी',
    facility_clinic: 'क्लिनिक',
    refresh_location: 'स्थान रिफ्रेश करें',
    location_accuracy: 'स्थान: रायपुर जिला',
    
    btn_directions: 'दिशा-निर्देश',
    btn_call: 'कॉल करें',
    btn_save: 'सहेजें',
    btn_saved: 'सहेजा गया',
    btn_details: 'विवरण देखें',
    label_distance: 'किमी दूर',
    label_specialty: 'विशेषज्ञता',
    label_hospital: 'अस्पताल',
    label_address: 'पता',
    label_phone: 'फोन',
    label_emergency: 'आपातकालीन नंबर',
    label_website: 'वेबसाइट',
    label_verified: 'सत्यापित आधिकारिक',
    label_source: 'स्रोत',
    label_last_verified: 'अंतिम सत्यापन',
    label_not_available: 'उपलब्ध नहीं',
    
    saved_title: 'सहेजी गई स्वास्थ्य सुविधाएं',
    saved_hospitals: 'सहेजे गए अस्पताल',
    saved_doctors: 'सहेजे गए डॉक्टर',
    saved_medical_stores: 'सहेजी गई दुकानें',
    nothing_saved: 'अभी तक कुछ भी सहेजा नहीं गया है।',
    nothing_saved_hint: 'किसी भी अस्पताल या डॉक्टर के कार्ड पर बुकमार्क आइकन दबाकर उसे ऑफलाइन के लिए सहेजें।',
    
    offline_welcome: 'ऑफलाइन मोड में आपका स्वागत है',
    offline_explainer: 'आप इस डिवाइस पर सहेजा गया रायपुर स्वास्थ्य डेटा देख रहे हैं। आपातकालीन नंबर और बुनियादी जानकारी बिना इंटरनेट काम करती है।',
    offline_pack_status: 'रायपुर स्वास्थ्य पैक स्थिति',
    pack_version: 'पैक संस्करण',
    pack_updated: 'अंतिम अपडेट',
    pack_downloaded: 'इस डिवाइस पर डाउनलोड हो गया',
    pack_not_downloaded: 'स्वास्थ्य पैक डाउनलोड नहीं हुआ है',
    btn_download_pack: 'रायपुर स्वास्थ्य पैक डाउनलोड करें',
    btn_redownload_pack: 'स्वास्थ्य पैक अपडेट करें',
    pack_downloading: 'स्वास्थ्य पैक डाउनलोड हो रहा है...',
    pack_download_success: 'रायपुर स्वास्थ्य पैक सफलतापूर्वक डाउनलोड हो गया!',
    pack_download_error: 'पैक डाउनलोड विफल रहा। कृपया बैकएंड कनेक्शन जांचें।',
    
    emergency_title: 'आपातकालीन नंबर (रायपुर व छ.ग.)',
    em_108: '108 - आपातकालीन एम्बुलेंस सेवा',
    em_102: '102 - महतारी एवं शिशु एम्बुलेंस सेवा',
    em_104: '104 - स्वास्थ्य परामर्श हेल्पलाइन',
    em_112: '112 - एकीकृत आपातकालीन सेवा',
    
    about_title: 'स्वास्थ्य साथी छ.ग. के बारे में',
    about_disclaimer: 'अस्वीकरण: यह एप्लिकेशन केवल स्वास्थ्य नेविगेशन प्रदान करता है। यह कोई चिकित्सीय निदान, उपचार या दवा का सुझाव नहीं देता है।',
    
    loc_needed: 'आपके पास की स्वास्थ्य सुविधाएं खोजने के लिए लोकेशन की अनुमति आवश्यक है।',
    loc_denied: 'स्थान अनुमति अस्वीकार कर दी गई। केंद्रीय रायपुर का उपयोग किया जा रहा है।',
    loc_fetching: 'रायपुर में आपका स्थान खोजा जा रहा है...',
    no_results: 'कोई स्वास्थ्य सुविधा नहीं मिली।',
    backend_offline: 'बैकएंड ऑफलाइन है। ऑफलाइन डेटा मोड में स्विच किया गया।',
    item_saved: 'सफलतापूर्वक सहेज लिया गया!',
    item_removed: 'सहेजी गई सूची से हटा दिया गया।',
    
    // Voice search
    voice_search: 'वॉयस सर्च',
    voice_listening: 'सुन रहे हैं... बोलिए',
    voice_not_supported: 'इस ब्राउज़र में वॉयस सर्च समर्थित नहीं है।',
    voice_permission_denied: 'माइक्रोफोन अनुमति अस्वीकार कर दी गई।',
    voice_no_speech: 'कोई आवाज़ नहीं सुनाई दी। पुनः प्रयास करें।',
    voice_offline: 'ऑफलाइन मोड में वॉयस सर्च उपलब्ध नहीं है।',
    voice_insecure_context: 'वॉयस सर्च के लिए HTTPS या localhost आवश्यक है।',

    // Healthcare pack & version status
    pack_latest_downloaded: 'नवीनतम संस्करण पहले से डाउनलोड है',
    pack_update_available: 'नया अपडेट उपलब्ध है',
    pack_offline_cannot_check: 'ऑफलाइन: नए संस्करण की जांच नहीं की जा सकती',
    internet_unavailable_offline: 'इंटरनेट कनेक्शन उपलब्ध नहीं है। ऑफलाइन मोड में बने हुए हैं।',
    
    // Auto sync
    sync_updating: 'स्वास्थ्य जानकारी अपडेट हो रही है...',
    sync_updated: 'स्वास्थ्य जानकारी अपडेट हो गई',
  },
  
  cg: {
    app_title: 'स्वास्थ्य साथी छ.ग.',
    tagline: 'तुंहर संग, हर कदम म',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    offline_badge: 'ऑफलाइन मोड चालू हे',
    greeting: 'जय जोहार! स्वास्थ्य साथी म तुंहर सुवागत हे',
    app_desc: 'रायपुर जिला म तीर-तखार के जांचे-परखे डॉक्टर, अस्पताल अउ जरूरी स्वास्थ्य सेवा खोजे म तुंहर मदद करही।',
    call_ambulance: '🚑 एम्बुलेंस ला फोन लगाव (108)',
    call_ambulance_sub: 'मुफ्त 24x7 आपातकालीन सेवा',
    search_placeholder: 'डॉक्टर, अस्पताल या स्वास्थ्य सेवा खोजव...',
    card_hospitals_title: 'अस्पताल',
    card_hospitals_desc: 'सरकारी अउ प्राइवेट अस्पताल खोजव',
    card_doctors_title: 'डॉक्टर',
    card_doctors_desc: 'तीर-तखार के बढ़िया डॉक्टर खोजव',
    card_saved_title: 'संजोए हे',
    card_saved_desc: 'संजो के रखे स्वास्थ्य सेवा ला जल्दी देखव',
    card_pack_title: 'ऑफलाइन स्वास्थ्य पैक',
    card_pack_desc: 'बिना नेट अस्पताल, डॉक्टर अउ दवा दुकान के जानकारी डाउनलोड करव',
    
    nav_home: 'घर',
    nav_nearby: 'तीर-तखार',
    nav_medical_stores: 'दवा दुकान',
    nav_saved: 'संजोए',
    nav_more: 'अउ',

    medical_stores_title: 'दवा दुकान',
    medical_stores_sample_notice: 'ये सिरिफ ऐप के नमूना बर अस्थायी जानकारी आय। ये असली या जांचे-परखे दवा दुकान नइं हे।',
    medical_store_sample_label: 'सिरिफ नमूना',
    
    tab_hospitals: 'अस्पताल',
    tab_doctors: 'डॉक्टर',
    filter_all: 'जम्मो',
    filter_gov: 'सरकारी',
    filter_pvt: 'प्राइवेट',
    facility_clinic: 'क्लिनिक',
    refresh_location: 'स्थान नवा करव',
    location_accuracy: 'स्थान: रायपुर जिला',
    
    btn_directions: 'रस्ता देखव',
    btn_call: 'फोन लगाव',
    btn_save: 'संजोव',
    btn_saved: 'संजोए हे',
    btn_details: 'पूरी जानकारी देखव',
    label_distance: 'किमी दूर',
    label_specialty: 'इलाज के विभाग',
    label_hospital: 'अस्पताल',
    label_address: 'पता / ठिकाना',
    label_phone: 'फोन',
    label_emergency: 'इमरजेंसी नंबर',
    label_website: 'वेबसाइट',
    label_verified: 'जांचे-परखे आधिकारिक',
    label_source: 'कहाँ ले मिले हे',
    label_last_verified: 'आखरी जांच',
    label_not_available: 'नइये',
    
    saved_title: 'संजो के रखे स्वास्थ्य सुविधा',
    saved_hospitals: 'संजोए अस्पताल',
    saved_doctors: 'संजोए डॉक्टर',
    saved_medical_stores: 'संजोए दवाई दुकान',
    nothing_saved: 'अभी तक कुछु संजोए नइये।',
    nothing_saved_hint: 'कोनो अस्पताल या डॉक्टर के कार्ड म संजोव बटन दबा के बिना नेट देखे बर रख लेव।',
    
    offline_welcome: 'ऑफलाइन मोड म तुंहर सुवागत हे',
    offline_explainer: 'तुमन मोबाइल म रखे रायपुर के स्वास्थ्य जानकारी ला देखत हव। बिना नेट के घलो फोन नंबर अउ जरूरी जानकारी मिलही।',
    offline_pack_status: 'रायपुर स्वास्थ्य पैक के हाल',
    pack_version: 'पैक संस्करण',
    pack_updated: 'आखरी अपडेट',
    pack_downloaded: 'मोबाइल म डाउनलोड हो गे हे',
    pack_not_downloaded: 'पैक अभी डाउनलोड नइये',
    btn_download_pack: 'रायपुर स्वास्थ्य पैक डाउनलोड करव',
    btn_redownload_pack: 'स्वास्थ्य पैक नवा करव',
    pack_downloading: 'स्वास्थ्य पैक डाउनलोड होवत हे...',
    pack_download_success: 'रायपुर स्वास्थ्य पैक बढ़िया से डाउनलोड हो गे!',
    pack_download_error: 'पैक डाउनलोड नई हो पाइस। बैकएंड ला जांचव।',
    
    emergency_title: 'इमरजेंसी नंबर (रायपुर अउ छ.ग.)',
    em_108: '108 - मुफ्त आपातकालीन एम्बुलेंस',
    em_102: '102 - महतारी अउ लइका एम्बुलेंस',
    em_104: '104 - स्वास्थ्य सलाह फोन सेवा',
    em_112: '112 - जम्मो इमरजेंसी खातिर',
    
    about_title: 'स्वास्थ्य साथी छ.ग. के बारे म',
    about_disclaimer: 'सूचना: ये एप सिरिफ स्वास्थ्य सुविधा खोजे म मदद करथे। ये कोनो दवाई, बीमारी जांच या इलाज नई बतावय।',
    
    loc_needed: 'तुंहर तीर-तखार के स्वास्थ्य सुविधा खोजे बर लोकेशन के अनुमति चाही।',
    loc_denied: 'स्थान के अनुमति नई मिलिस। रायपुर शहर के केंद्र ले खोजत हन।',
    loc_fetching: 'रायपुर म तुंहर जगह खोजत हन...',
    no_results: 'कोनो स्वास्थ्य सुविधा नई मिलिस।',
    backend_offline: 'बैकएंड ऑफलाइन हे। फोन म रखे डेटा ला देखावत हन।',
    item_saved: 'संजो के रख लीन!',
    item_removed: 'संजोए सूची ले हटा दीन।',
    
    // Voice search
    voice_search: 'आवाज ले खोजव',
    voice_listening: 'सुनत हन... बोलव',
    voice_not_supported: 'ये ब्राउजर म आवाज ले खोजे के सुविधा नइये।',
    voice_permission_denied: 'माइक के अनुमति नई मिलिस।',
    voice_no_speech: 'कोनो आवाज नई सुनइस। फेर बोलव।',
    voice_offline: 'ऑफलाइन मोड म आवाज ले खोजे के सुविधा नइये।',
    voice_insecure_context: 'आवाज ले खोजे बर HTTPS या localhost जरूरी हे।',

    // Healthcare pack & version status
    pack_latest_downloaded: 'नवा संस्करण पहिली ले डाउनलोड हे',
    pack_update_available: 'नवा अपडेट मिलत हे',
    pack_offline_cannot_check: 'ऑफलाइन: नवा संस्करण के जांच नई हो सकय',
    internet_unavailable_offline: 'इंटरनेट नइये। ऑफलाइन मोड म बने हवन।',
    
    // Auto sync
    sync_updating: 'स्वास्थ्य जानकारी नवा होवत हे...',
    sync_updated: 'स्वास्थ्य जानकारी नवा हो गे',
  },
};

let currentLang = 'en';

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
  }
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  const dict = translations[currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
