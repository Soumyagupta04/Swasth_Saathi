/**
 * UI Renderer and View Controller for Swasthya Saathi CG.
 * Handles DOM updates, views, modals, card rendering, and user interactions.
 */

import { t, getLanguage, setLanguage } from './translations.js';
import {
  saveHospital,
  removeHospital,
  getSavedHospitals,
  isHospitalSaved,
  saveDoctor,
  removeDoctor,
  getSavedDoctors,
  isDoctorSaved,
  saveMedicalStore,
  removeMedicalStore,
  getSavedMedicalStores,
  isMedicalStoreSaved,
  getHealthcarePack,
  setSetting,
} from './db.js';
import { getNearbyHospitals, getNearbyDoctors, getNearbyMedicalStores } from './api.js';
import { getUserLocation } from './location.js';
import { isOnline, setOnlineMode, downloadRaipurPack, getOfflineHospitals, getOfflineDoctors, getOfflineMedicalStores, checkNetworkConnectivity, verifyConnectivity } from './offline.js';

let currentTab = 'home';
let currentNearbySubTab = 'hospitals'; // 'hospitals' | 'doctors'
let currentSavedSubTab = 'hospitals';  // 'hospitals' | 'doctors' | 'medical-stores'
let hospitalFilterType = 'all'; // 'all' | 'government' | 'private'
let searchQuery = '';

/**
 * Initialize UI elements and listeners
 */
export function initUI() {
  bindNavigation();
  bindHeaderControls();
  bindSearch();
  bindVoiceSearch();
  bindSubTabs();
  bindModals();
  applyTranslations();
  renderCurrentView();
}

/**
 * Bind bottom navigation tabs
 */
function bindNavigation() {
  const navItems = document.querySelectorAll('.bottom-nav-item');
  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navigateTo(targetTab);
    });
  });

  // Home card triggers
  document.getElementById('home-card-hospitals')?.addEventListener('click', () => {
    currentNearbySubTab = 'hospitals';
    navigateTo('nearby');
  });

  document.getElementById('home-card-doctors')?.addEventListener('click', () => {
    currentNearbySubTab = 'doctors';
    navigateTo('nearby');
  });

  document.getElementById('home-card-saved')?.addEventListener('click', () => {
    navigateTo('saved');
  });

  document.getElementById('home-card-pack')?.addEventListener('click', () => {
    navigateTo('more');
    const packSection = document.getElementById('offline-pack-section');
    if (packSection) {
      packSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.getElementById('refresh-medical-stores-location-btn')?.addEventListener('click', () => {
    renderMedicalStoresView(true);
  });
}

/**
 * Switch active view tab
 */
export function navigateTo(tabName) {
  currentTab = tabName;

  // Update navigation bar highlights
  document.querySelectorAll('.bottom-nav-item').forEach((item) => {
    if (item.getAttribute('data-tab') === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle view visibility
  document.querySelectorAll('.view-container').forEach((view) => {
    if (view.id === `view-${tabName}`) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
  renderCurrentView();
}

/**
 * Bind header language selector and online/offline toggle
 */
function bindHeaderControls() {
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = getLanguage();
    langSelect.addEventListener('change', async (e) => {
      const newLang = e.target.value;
      setLanguage(newLang);
      await setSetting('preferred_language', newLang);
      applyTranslations();
      renderCurrentView();
      showToast(`Language updated to ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // iOS-style toggle checkbox
  const modeCheckbox = document.getElementById('mode-toggle-checkbox');
  let isToggleBusy = false;

  if (modeCheckbox) {
    modeCheckbox.checked = isOnline();
    modeCheckbox.setAttribute('aria-checked', String(isOnline()));

    modeCheckbox.addEventListener('change', async (e) => {
      const wantOnline = modeCheckbox.checked;

      if (!wantOnline) {
        // User switched to offline: allowed immediately
        setOnlineMode(false, true);
        return;
      }

      // User wants to switch to online mode
      if (isToggleBusy) {
        modeCheckbox.checked = false;
        modeCheckbox.setAttribute('aria-checked', 'false');
        return;
      }

      // Immediately keep checkbox visually unchecked while connectivity is being verified
      modeCheckbox.checked = false;
      modeCheckbox.setAttribute('aria-checked', 'false');

      // Check device network status
      if (!checkNetworkConnectivity()) {
        updateModeToggleUI(false);
        showToast(getLanguage() === 'en' ? 'A stable internet connection is required to switch to online mode.' : t('internet_unavailable_offline'));
        return;
      }

      isToggleBusy = true;

      try {
        const isReachable = await verifyConnectivity();
        if (isReachable) {
          setOnlineMode(true, true);
        } else {
          updateModeToggleUI(false);
          showToast(getLanguage() === 'en' ? 'A stable internet connection is required to switch to online mode.' : t('internet_unavailable_offline'));
        }
      } catch (err) {
        updateModeToggleUI(false);
        showToast(getLanguage() === 'en' ? 'A stable internet connection is required to switch to online mode.' : t('internet_unavailable_offline'));
      } finally {
        isToggleBusy = false;
      }
    });
  }
}

/**
 * Update visual state of header online/offline toggle
 */
export function updateModeToggleUI(online) {
  const container = document.getElementById('mode-toggle-btn');
  const checkbox = document.getElementById('mode-toggle-checkbox');
  const textSpan = document.getElementById('mode-toggle-text');
  const banner = document.getElementById('offline-status-banner');

  if (checkbox) {
    checkbox.checked = Boolean(online);
    checkbox.setAttribute('aria-checked', String(Boolean(online)));
  }

  if (container) {
    if (online) {
      container.classList.remove('offline');
      container.classList.add('online');
    } else {
      container.classList.remove('online');
      container.classList.add('offline');
    }
  }

  if (textSpan) {
    textSpan.textContent = t(online ? 'online' : 'offline');
    textSpan.className = `mode-text-badge ${online ? 'online' : 'offline'}`;
  }

  if (banner) {
    if (online) {
      banner.classList.add('hidden');
      banner.style.display = 'none';
    } else {
      banner.classList.remove('hidden');
      banner.style.display = 'flex';
    }
  }
}

let speechRecognitionInstance = null;
let isVoiceListening = false;

/**
 * Bind global search bar with strict event isolation
 */
function bindSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('global-search-input');
  const clearBtn = document.getElementById('search-clear-btn');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleSearchQueryChange();
      return false;
    });
  }

  if (searchInput) {
    // Normal text input behavior with search execution
    searchInput.addEventListener('input', (e) => {
      e.stopPropagation();
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'flex' : 'none';
      }
      handleSearchQueryChange();
    });

    // Prevent enter or keyboard events from bubbling or triggering tabs/forms/mode toggle
    searchInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchQueryChange();
      }
    });

    searchInput.addEventListener('keyup', (e) => {
      e.stopPropagation();
    });

    searchInput.addEventListener('keypress', (e) => {
      e.stopPropagation();
    });

    clearBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      handleSearchQueryChange();
      searchInput.focus();
    });
  }
}

/**
 * Bind voice search microphone button using Web Speech API
 */
function bindVoiceSearch() {
  const voiceBtn = document.getElementById('voice-search-btn');
  const searchInput = document.getElementById('global-search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  if (!voiceBtn || !searchInput) return;

  voiceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    if (!SpeechRecognition) {
      showToast(t('voice_not_supported'));
      return;
    }

    if (isVoiceListening && speechRecognitionInstance) {
      try {
        speechRecognitionInstance.stop();
      } catch (_) {}
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      speechRecognitionInstance = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Select speech recognition language according to application language
      const lang = getLanguage();
      if (lang === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (lang === 'cg') {
        // Standard Web Speech API does not officially recognize 'hne-IN' in browsers.
        // Fall back gracefully to regional Hindi (hi-IN) while processing speech.
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        isVoiceListening = true;
        voiceBtn.classList.add('listening');
        voiceBtn.setAttribute('aria-label', t('voice_listening'));
        searchInput.setAttribute('placeholder', t('voice_listening'));
        showToast(t('voice_listening'));
      };

      recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          searchInput.value = transcript;
          searchQuery = transcript.trim().toLowerCase();
          if (clearBtn) {
            clearBtn.style.display = 'flex';
          }
          handleSearchQueryChange();
          showToast(`🎤 "${transcript}"`);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          showToast(t('voice_permission_denied'));
        } else if (event.error === 'no-speech') {
          showToast(t('voice_no_speech'));
        } else {
          showToast(t('voice_not_supported'));
        }
      };

      recognition.onend = () => {
        isVoiceListening = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.setAttribute('aria-label', t('voice_search'));
        searchInput.setAttribute('placeholder', t('search_placeholder'));
      };

      recognition.start();
    } catch (err) {
      console.warn('Voice recognition start failed:', err);
      showToast(t('voice_not_supported'));
      isVoiceListening = false;
      voiceBtn.classList.remove('listening');
    }
  });
}

/**
 * Handle query change without ever switching tabs
 */
function handleSearchQueryChange() {
  if (currentTab === 'home') {
    renderHomeSearchResults();
  } else if (currentTab === 'nearby') {
    renderNearbyView();
  } else if (currentTab === 'saved') {
    renderSavedView();
  }
}

/**
 * Render live search results directly on the Home view without tab switching
 */
async function renderHomeSearchResults() {
  const container = document.getElementById('home-search-results');
  const cardsGrid = document.querySelector('.home-cards-grid');
  if (!container) return;

  if (!searchQuery) {
    container.innerHTML = '';
    container.classList.add('hidden');
    container.style.display = 'none';
    if (cardsGrid) {
      cardsGrid.classList.remove('hidden');
      cardsGrid.style.display = 'grid';
    }
    return;
  }

  // Active query: hide cards grid and show search results
  if (cardsGrid) {
    cardsGrid.classList.add('hidden');
    cardsGrid.style.display = 'none';
  }
  container.classList.remove('hidden');
  container.style.display = 'flex';
  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>${t('loc_fetching')}</p></div>`;

  try {
    const location = await getUserLocation();
    let hospitals = [];
    let doctors = [];
    let medicalStores = [];

    if (isOnline()) {
      try {
        const [hospData, docData, storeData] = await Promise.all([
          getNearbyHospitals(location.lat, location.lng),
          getNearbyDoctors(location.lat, location.lng),
          getNearbyMedicalStores(location.lat, location.lng),
        ]);
        hospitals = hospData;
        doctors = docData;
        medicalStores = storeData;
      } catch (err) {
        console.warn('Online search fetch failed, falling back to cached pack:', err);
        [hospitals, doctors, medicalStores] = await Promise.all([
          getOfflineHospitals(location.lat, location.lng),
          getOfflineDoctors(location.lat, location.lng),
          getOfflineMedicalStores(location.lat, location.lng),
        ]);
      }
    } else {
      [hospitals, doctors, medicalStores] = await Promise.all([
        getOfflineHospitals(location.lat, location.lng),
        getOfflineDoctors(location.lat, location.lng),
        getOfflineMedicalStores(location.lat, location.lng),
      ]);
    }

    // Filter matching hospitals across all searchable fields
    const matchingHospitals = hospitals.filter((h) => {
      const nameMatch = h.name && h.name.toLowerCase().includes(searchQuery);
      const addrMatch = h.address && h.address.toLowerCase().includes(searchQuery);
      const typeMatch = h.type && h.type.toLowerCase().includes(searchQuery);
      const specMatch = Array.isArray(h.specialties) &&
        h.specialties.some((s) => s.toLowerCase().includes(searchQuery));
      const servMatch = Array.isArray(h.services) &&
        h.services.some((s) => s.toLowerCase().includes(searchQuery));
      return nameMatch || addrMatch || typeMatch || specMatch || servMatch;
    });

    // Filter matching doctors across all searchable fields
    const matchingDoctors = doctors.filter((d) => {
      const nameMatch = d.name && d.name.toLowerCase().includes(searchQuery);
      const specMatch = d.specialty && d.specialty.toLowerCase().includes(searchQuery);
      const hospMatch = d.hospitalName && d.hospitalName.toLowerCase().includes(searchQuery);
      const qualMatch = d.qualifications && d.qualifications.toLowerCase().includes(searchQuery);
      const desigMatch = d.designation && d.designation.toLowerCase().includes(searchQuery);
      return nameMatch || specMatch || hospMatch || qualMatch || desigMatch;
    });

    // Include medical stores in the same results for typed and voice searches.
    const matchingMedicalStores = medicalStores.filter((store) => {
      const nameMatch = store.name && store.name.toLowerCase().includes(searchQuery);
      const addrMatch = store.address && store.address.toLowerCase().includes(searchQuery);
      const serviceMatch = Array.isArray(store.services) &&
        store.services.some((service) => service.toLowerCase().includes(searchQuery));
      return nameMatch || addrMatch || serviceMatch;
    });

    if (matchingHospitals.length === 0 && matchingDoctors.length === 0 && matchingMedicalStores.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>${t('no_results')}</h3>
          <p>${!isOnline() ? t('offline_explainer') : 'Try adjusting your search terms.'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    // Results count header
    const totalCount = matchingHospitals.length + matchingDoctors.length + matchingMedicalStores.length;
    const countHeader = document.createElement('div');
    countHeader.style.cssText = 'font-size: 0.85rem; font-weight: 600; color: #64748b; padding: 4px 6px;';
    countHeader.textContent = `${totalCount} results found for "${searchQuery}"`;
    container.appendChild(countHeader);

    // Render hospitals
    for (const h of matchingHospitals) {
      const saved = await isHospitalSaved(h.id);
      container.appendChild(createHospitalCard(h, saved));
    }

    // Render doctors
    for (const d of matchingDoctors) {
      const saved = await isDoctorSaved(d.id);
      container.appendChild(createDoctorCard(d, saved));
    }

    for (const store of matchingMedicalStores) {
      const saved = await isMedicalStoreSaved(store.id);
      container.appendChild(createMedicalStoreCard(store, saved));
    }
  } catch (err) {
    console.error('Search render error:', err);
    container.innerHTML = `
      <div class="empty-state error">
        <div class="empty-icon">⚠️</div>
        <h3>Error searching</h3>
        <p>${err.message || 'Unable to perform search.'}</p>
      </div>
    `;
  }
}

/**
 * Bind sub-tabs in Nearby and Saved views
 */
function bindSubTabs() {
  // Nearby subtabs
  const nearbyTabs = document.querySelectorAll('.nearby-sub-tab');
  nearbyTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      nearbyTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentNearbySubTab = tab.getAttribute('data-subtab');
      renderNearbyView();
    });
  });

  // Nearby hospital type filters
  const filterBtns = document.querySelectorAll('.type-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      hospitalFilterType = btn.getAttribute('data-filter');
      renderNearbyView();
    });
  });

  // Location refresh button
  document.getElementById('refresh-location-btn')?.addEventListener('click', async () => {
    showToast(t('loc_fetching'));
    await getUserLocation(true);
    renderNearbyView();
    showToast('Location updated!');
  });

  // Saved subtabs
  const savedTabs = document.querySelectorAll('.saved-sub-tab');
  savedTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      savedTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentSavedSubTab = tab.getAttribute('data-subtab');
      renderSavedView();
    });
  });
}

/**
 * Bind modal dialog close listeners
 */
function bindModals() {
  const modal = document.getElementById('details-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  closeBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

/**
 * Apply translations to DOM elements with data-i18n attributes
 */
export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  updateModeToggleUI(isOnline());
}

/**
 * Route rendering to active view
 */
export function renderCurrentView() {
  if (currentTab === 'home') {
    renderHomeView();
    if (searchQuery) {
      renderHomeSearchResults();
    } else {
      const container = document.getElementById('home-search-results');
      const cardsGrid = document.querySelector('.home-cards-grid');
      if (container) {
        container.innerHTML = '';
        container.classList.add('hidden');
        container.style.display = 'none';
      }
      if (cardsGrid) {
        cardsGrid.classList.remove('hidden');
        cardsGrid.style.display = 'grid';
      }
    }
  } else if (currentTab === 'nearby') {
    renderNearbyView();
  } else if (currentTab === 'medical-stores') {
    renderMedicalStoresView();
  } else if (currentTab === 'saved') {
    renderSavedView();
  } else if (currentTab === 'more') {
    renderMoreView();
  }
}

// ----------------------------------------------------
// HOME VIEW
// ----------------------------------------------------

async function renderHomeView() {
  const pack = await getHealthcarePack();
  const packBadge = document.getElementById('home-pack-status-badge');
  if (packBadge) {
    if (pack) {
      packBadge.textContent = `✓ Raipur Pack v${pack.version} Installed`;
      packBadge.className = 'status-pill status-pill-success';
    } else {
      packBadge.textContent = 'Offline Pack Not Downloaded';
      packBadge.className = 'status-pill status-pill-warning';
    }
  }

  // Update saved count badge
  const savedHosp = await getSavedHospitals();
  const savedDocs = await getSavedDoctors();
  const savedStores = await getSavedMedicalStores();
  const savedCountBadge = document.getElementById('home-saved-count');
  if (savedCountBadge) {
    savedCountBadge.textContent = `${savedHosp.length + savedDocs.length + savedStores.length} saved`;
  }
}

// ----------------------------------------------------
// NEARBY VIEW
// ----------------------------------------------------

async function renderNearbyView() {
  const container = document.getElementById('nearby-results-list');
  const statusMsg = document.getElementById('nearby-location-status');
  if (!container) return;

  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>${t('loc_fetching')}</p></div>`;

  const location = await getUserLocation();
  if (statusMsg) {
    statusMsg.textContent = location.isFallback
      ? `${t('location_accuracy')} (${location.message || 'Raipur'})`
      : `GPS Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  }

  // Show/hide hospital type filters based on current sub-tab
  const filterBar = document.getElementById('nearby-filter-bar');
  if (filterBar) {
    filterBar.style.display = currentNearbySubTab === 'hospitals' ? 'flex' : 'none';
  }

  try {
    let items = [];

    if (isOnline()) {
      if (currentNearbySubTab === 'hospitals') {
        items = await getNearbyHospitals(location.lat, location.lng);
      } else {
        items = await getNearbyDoctors(location.lat, location.lng);
      }
    } else {
      // Offline fallback from IndexedDB
      if (currentNearbySubTab === 'hospitals') {
        items = await getOfflineHospitals(location.lat, location.lng);
      } else {
        items = await getOfflineDoctors(location.lat, location.lng);
      }
    }

    // Apply Hospital Type filter
    if (currentNearbySubTab === 'hospitals' && hospitalFilterType !== 'all') {
      items = items.filter((h) => h.type && h.type.toLowerCase() === hospitalFilterType);
    }

    // Apply Search Query filter across all searchable fields
    if (searchQuery) {
      items = items.filter((item) => {
        const nameMatch = item.name && item.name.toLowerCase().includes(searchQuery);
        const specMatch = item.specialty && item.specialty.toLowerCase().includes(searchQuery);
        const specsMatch = Array.isArray(item.specialties) &&
          item.specialties.some((s) => s.toLowerCase().includes(searchQuery));
        const servMatch = Array.isArray(item.services) &&
          item.services.some((s) => s.toLowerCase().includes(searchQuery));
        const addressMatch = item.address && item.address.toLowerCase().includes(searchQuery);
        const hospNameMatch = item.hospitalName && item.hospitalName.toLowerCase().includes(searchQuery);
        const qualMatch = item.qualifications && item.qualifications.toLowerCase().includes(searchQuery);
        const desigMatch = item.designation && item.designation.toLowerCase().includes(searchQuery);
        return nameMatch || specMatch || specsMatch || servMatch || addressMatch || hospNameMatch || qualMatch || desigMatch;
      });
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏥</div>
          <h3>${t('no_results')}</h3>
          <p>${!isOnline() ? t('offline_explainer') : 'Try adjusting your search or filters.'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    for (const item of items) {
      if (currentNearbySubTab === 'hospitals') {
        const saved = await isHospitalSaved(item.id);
        container.appendChild(createHospitalCard(item, saved));
      } else {
        const saved = await isDoctorSaved(item.id);
        container.appendChild(createDoctorCard(item, saved));
      }
    }
  } catch (err) {
    console.error('Error fetching nearby data:', err);
    if (isOnline()) {
      setOnlineMode(false, false);
      return;
    }
    container.innerHTML = `
      <div class="empty-state error">
        <div class="empty-icon">⚠️</div>
        <h3>${t('backend_offline')}</h3>
        <p>${err.message || 'Unable to connect to healthcare server.'}</p>
        <button id="retry-nearby-btn" class="btn btn-outline" style="margin-top: 12px;">Retry</button>
      </div>
    `;
    document.getElementById('retry-nearby-btn')?.addEventListener('click', () => renderNearbyView());
  }
}

// ----------------------------------------------------
// MEDICAL STORES VIEW
// ----------------------------------------------------

async function renderMedicalStoresView(forceRefreshLocation = false) {
  const container = document.getElementById('medical-stores-results-list');
  const statusMsg = document.getElementById('medical-stores-location-status');
  if (!container) return;

  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>${t('loc_fetching')}</p></div>`;

  const location = await getUserLocation(forceRefreshLocation);
  if (statusMsg) {
    statusMsg.textContent = location.isFallback
      ? `${t('location_accuracy')} (${location.message || 'Raipur'})`
      : `GPS Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  }

  try {
    const stores = isOnline()
      ? await getNearbyMedicalStores(location.lat, location.lng)
      : await getOfflineMedicalStores(location.lat, location.lng);

    if (stores.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">💊</div>
          <h3>${t('no_results')}</h3>
          <p>${!isOnline() ? t('offline_explainer') : 'No sample store entries are available.'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    for (const store of stores) {
      container.appendChild(createMedicalStoreCard(store, await isMedicalStoreSaved(store.id)));
    }
  } catch (err) {
    console.error('Error fetching nearby medical stores:', err);
    if (isOnline()) {
      setOnlineMode(false, false);
      return;
    }
    container.innerHTML = `
      <div class="empty-state error">
        <div class="empty-icon">⚠️</div>
        <h3>${t('backend_offline')}</h3>
        <p>${err.message || 'Unable to load the downloaded medical-store list.'}</p>
        <button id="retry-medical-stores-btn" class="btn btn-outline" style="margin-top: 12px;">Retry</button>
      </div>
    `;
    document.getElementById('retry-medical-stores-btn')?.addEventListener('click', () => renderMedicalStoresView());
  }
}

function createMedicalStoreCard(store, isSaved = false, isSavedTab = false) {
  const card = document.createElement('article');
  card.className = 'facility-card';

  const distanceHtml = typeof store.distanceKm === 'number'
    ? `<span class="distance-badge">📍 ${store.distanceKm} ${t('label_distance')}</span>`
    : '';
  const serviceTags = Array.isArray(store.services) && store.services.length > 0
    ? `<div class="card-tags">${store.services.map((service) => `<span class="tag">${service}</span>`).join('')}</div>`
    : '';
  const mapQuery = encodeURIComponent(`${store.name} ${store.address || 'Raipur Chhattisgarh'}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const callAction = store.phone
    ? `<a href="tel:${encodeURIComponent(store.phone)}" class="card-btn btn-call" title="${t('btn_call')}">📞 ${store.phone}</a>`
    : `<span class="text-muted">${t('label_not_available')}</span>`;

  card.innerHTML = `
    <div class="card-top">
      <span class="sample-data-badge">${t('medical_store_sample_label')}</span>
      ${distanceHtml}
    </div>
    <h3 class="card-title">${store.name}</h3>
    <p class="card-address">🏢 ${store.address || t('label_not_available')}</p>
    ${serviceTags}
    <div class="card-actions">
      ${callAction}
      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="card-btn btn-directions">
        🗺️ ${t('btn_directions')}
      </a>
      <button type="button" class="card-btn btn-save ${isSaved ? 'saved' : ''}">
        ${isSaved ? '🔖 ' + t('btn_saved') : '📑 ' + t('btn_save')}
      </button>
    </div>
  `;

  card.querySelector('.btn-save')?.addEventListener('click', async (event) => {
    event.stopPropagation();
    const saveButton = event.currentTarget;
    if (saveButton.classList.contains('saved')) {
      await removeMedicalStore(store.id);
      showToast(t('item_removed'));
      if (isSavedTab) {
        card.remove();
        renderSavedView();
      } else {
        saveButton.classList.remove('saved');
        saveButton.textContent = '📑 ' + t('btn_save');
      }
    } else {
      await saveMedicalStore(store);
      saveButton.classList.add('saved');
      saveButton.textContent = '🔖 ' + t('btn_saved');
      showToast(t('item_saved'));
    }
    if (currentTab !== 'saved') renderHomeView();
  });

  return card;
}

// ----------------------------------------------------
// SAVED VIEW
// ----------------------------------------------------

async function renderSavedView() {
  const container = document.getElementById('saved-results-list');
  if (!container) return;

  container.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;

  if (currentSavedSubTab === 'hospitals') {
    let hospitals = await getSavedHospitals();
    if (searchQuery) {
      hospitals = hospitals.filter((h) => {
        const nameMatch = h.name && h.name.toLowerCase().includes(searchQuery);
        const addrMatch = h.address && h.address.toLowerCase().includes(searchQuery);
        const typeMatch = h.type && h.type.toLowerCase().includes(searchQuery);
        const specMatch = Array.isArray(h.specialties) &&
          h.specialties.some((s) => s.toLowerCase().includes(searchQuery));
        const servMatch = Array.isArray(h.services) &&
          h.services.some((s) => s.toLowerCase().includes(searchQuery));
        return nameMatch || addrMatch || typeMatch || specMatch || servMatch;
      });
    }

    if (hospitals.length === 0) {
      container.innerHTML = renderEmptySavedState();
      return;
    }
    container.innerHTML = '';
    hospitals.forEach((h) => {
      container.appendChild(createHospitalCard(h, true, true));
    });
  } else if (currentSavedSubTab === 'doctors') {
    let doctors = await getSavedDoctors();
    if (searchQuery) {
      doctors = doctors.filter((d) => {
        const nameMatch = d.name && d.name.toLowerCase().includes(searchQuery);
        const specMatch = d.specialty && d.specialty.toLowerCase().includes(searchQuery);
        const hospMatch = d.hospitalName && d.hospitalName.toLowerCase().includes(searchQuery);
        const qualMatch = d.qualifications && d.qualifications.toLowerCase().includes(searchQuery);
        const desigMatch = d.designation && d.designation.toLowerCase().includes(searchQuery);
        return nameMatch || specMatch || hospMatch || qualMatch || desigMatch;
      });
    }

    if (doctors.length === 0) {
      container.innerHTML = renderEmptySavedState();
      return;
    }
    container.innerHTML = '';
    doctors.forEach((d) => {
      container.appendChild(createDoctorCard(d, true, true));
    });
  } else {
    let stores = await getSavedMedicalStores();
    if (searchQuery) {
      stores = stores.filter((store) => {
        const nameMatch = store.name && store.name.toLowerCase().includes(searchQuery);
        const addressMatch = store.address && store.address.toLowerCase().includes(searchQuery);
        const servicesMatch = Array.isArray(store.services) &&
          store.services.some((service) => service.toLowerCase().includes(searchQuery));
        return nameMatch || addressMatch || servicesMatch;
      });
    }
    if (stores.length === 0) {
      container.innerHTML = renderEmptySavedState();
      return;
    }
    container.innerHTML = '';
    stores.forEach((store) => container.appendChild(createMedicalStoreCard(store, true, true)));
  }
}

function renderEmptySavedState() {
  return `
    <div class="empty-state">
      <div class="empty-icon">🔖</div>
      <h3>${t('nothing_saved')}</h3>
      <p>${t('nothing_saved_hint')}</p>
      <button class="btn btn-primary" id="explore-nearby-btn" style="margin-top: 16px;">
        ${t('nav_nearby')}
      </button>
    </div>
  `;
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'explore-nearby-btn') {
    navigateTo('nearby');
  }
});

// ----------------------------------------------------
// MORE VIEW
// ----------------------------------------------------

async function renderMoreView() {
  const packStatusContainer = document.getElementById('pack-details-container');
  const downloadBtn = document.getElementById('btn-download-pack-action');
  if (!packStatusContainer) return;

  const pack = await getHealthcarePack();

  if (pack) {
    packStatusContainer.innerHTML = `
      <div class="pack-status-card installed">
        <div class="status-header">
          <span class="status-icon">✓</span>
          <strong>${t('pack_downloaded')}</strong>
        </div>
        <div class="pack-meta-grid">
          <div><small>${t('pack_version')}</small><br><strong>${pack.version}</strong></div>
          <div><small>${t('pack_updated')}</small><br><strong>${pack.lastUpdated}</strong></div>
          <div><small>Hospitals</small><br><strong>${pack.hospitals ? pack.hospitals.length : 0}</strong></div>
          <div><small>Doctors</small><br><strong>${pack.doctors ? pack.doctors.length : 0}</strong></div>
          <div><small>${t('medical_stores_title')}</small><br><strong>${Array.isArray(pack.medicalStores) ? pack.medicalStores.length : 0}</strong></div>
        </div>
      </div>
    `;
    if (downloadBtn) {
      downloadBtn.textContent = t('btn_redownload_pack');
    }
  } else {
    packStatusContainer.innerHTML = `
      <div class="pack-status-card missing">
        <div class="status-header">
          <span class="status-icon">ℹ️</span>
          <strong>${t('pack_not_downloaded')}</strong>
        </div>
        <p style="font-size: 0.9rem; color: #64748b; margin-top: 6px;">
          ${t('card_pack_desc')}.
        </p>
      </div>
    `;
    if (downloadBtn) {
      downloadBtn.textContent = t('btn_download_pack');
    }
  }

  if (downloadBtn) {
    downloadBtn.onclick = async () => {
      downloadBtn.disabled = true;
      downloadBtn.textContent = t('pack_downloading');

      try {
        await downloadRaipurPack((step) => {
          downloadBtn.textContent = step;
        });
        showToast(t('pack_download_success'));
        await renderMoreView();
      } catch (err) {
        console.error('Pack download failed:', err);
        showToast(t('pack_download_error'));
      } finally {
        downloadBtn.disabled = false;
      }
    };
  }
}

// ----------------------------------------------------
// CARD GENERATORS
// ----------------------------------------------------

export function createHospitalCard(hospital, isSaved = false, isSavedTab = false) {
  const card = document.createElement('div');
  card.className = 'facility-card';

  const typeClass = (hospital.type || '').toLowerCase() === 'government' ? 'badge-gov' : 'badge-pvt';
  const typeLabel = hospital.facilityKind === 'clinic'
    ? t('facility_clinic')
    : (hospital.type || '').toLowerCase() === 'government' ? t('filter_gov') : t('filter_pvt');

  const distanceHtml = typeof hospital.distanceKm === 'number'
    ? `<span class="distance-badge">📍 ${hospital.distanceKm} ${t('label_distance')}</span>`
    : '';

  const phoneLink = hospital.phone
    ? `<a href="tel:${hospital.phone}" class="card-btn btn-call" title="${t('btn_call')}">📞 ${hospital.phone}</a>`
    : `<span class="text-muted">${t('label_not_available')}</span>`;

  const mapQuery = encodeURIComponent(`${hospital.name} ${hospital.address || 'Raipur Chhattisgarh'}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  card.innerHTML = `
    <div class="card-top">
      <span class="type-badge ${typeClass}">${typeLabel}</span>
      ${distanceHtml}
    </div>
    <h3 class="card-title">${hospital.name}</h3>
    <p class="card-address">🏢 ${hospital.address || t('label_not_available')}</p>
    
    ${Array.isArray(hospital.specialties) && hospital.specialties.length > 0 ? `
      <div class="card-tags">
        ${hospital.specialties.slice(0, 3).map((s) => `<span class="tag">${s}</span>`).join('')}
        ${hospital.specialties.length > 3 ? `<span class="tag-more">+${hospital.specialties.length - 3}</span>` : ''}
      </div>
    ` : ''}

    <div class="card-actions">
      ${phoneLink}
      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="card-btn btn-directions">
        🗺️ ${t('btn_directions')}
      </a>
      <button class="card-btn btn-save ${isSaved ? 'saved' : ''}" data-id="${hospital.id}">
        ${isSaved ? '🔖 ' + t('btn_saved') : '📑 ' + t('btn_save')}
      </button>
      <button class="card-btn btn-details" data-id="${hospital.id}">
        ℹ️
      </button>
    </div>
  `;

  // Save toggle event
  const saveBtn = card.querySelector('.btn-save');
  saveBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const currentlySaved = saveBtn.classList.contains('saved');
    if (currentlySaved) {
      await removeHospital(hospital.id);
      saveBtn.classList.remove('saved');
      saveBtn.textContent = '📑 ' + t('btn_save');
      showToast(t('item_removed'));
      if (isSavedTab) {
        card.remove();
        renderSavedView();
      }
    } else {
      await saveHospital(hospital);
      saveBtn.classList.add('saved');
      saveBtn.textContent = '🔖 ' + t('btn_saved');
      showToast(t('item_saved'));
    }
  });

  // Details button
  card.querySelector('.btn-details')?.addEventListener('click', () => {
    openHospitalDetailsModal(hospital);
  });

  return card;
}

export function createDoctorCard(doctor, isSaved = false, isSavedTab = false) {
  const card = document.createElement('div');
  card.className = 'facility-card doctor-card';

  const distanceHtml = typeof doctor.distanceKm === 'number'
    ? `<span class="distance-badge">📍 ${doctor.distanceKm} ${t('label_distance')}</span>`
    : '';

  const mapQuery = encodeURIComponent(`${doctor.hospitalName || doctor.name} Raipur Chhattisgarh`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  card.innerHTML = `
    <div class="card-top">
      <span class="type-badge badge-doc">🩺 ${doctor.specialty || 'General Practitioner'}</span>
      ${distanceHtml}
    </div>
    <h3 class="card-title">${doctor.name}</h3>
    ${(doctor.designation || doctor.qualifications) ? `<p class="card-subtitle">${[doctor.designation, doctor.qualifications].filter(Boolean).join(' • ')}</p>` : ''}
    <p class="card-address">🏥 ${doctor.hospitalName || 'Affiliated Hospital'}</p>
    ${doctor.visitingSchedule ? `<p class="card-address">🕒 ${doctor.visitingSchedule}</p>` : ''}

    <div class="card-actions">
      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="card-btn btn-directions">
        🗺️ ${t('btn_directions')}
      </a>
      <button class="card-btn btn-save ${isSaved ? 'saved' : ''}" data-id="${doctor.id}">
        ${isSaved ? '🔖 ' + t('btn_saved') : '📑 ' + t('btn_save')}
      </button>
      <button class="card-btn btn-details" data-id="${doctor.id}">
        ℹ️
      </button>
    </div>
  `;

  // Save toggle event
  const saveBtn = card.querySelector('.btn-save');
  saveBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const currentlySaved = saveBtn.classList.contains('saved');
    if (currentlySaved) {
      await removeDoctor(doctor.id);
      saveBtn.classList.remove('saved');
      saveBtn.textContent = '📑 ' + t('btn_save');
      showToast(t('item_removed'));
      if (isSavedTab) {
        card.remove();
        renderSavedView();
      }
    } else {
      await saveDoctor(doctor);
      saveBtn.classList.add('saved');
      saveBtn.textContent = '🔖 ' + t('btn_saved');
      showToast(t('item_saved'));
    }
  });

  // Details button
  card.querySelector('.btn-details')?.addEventListener('click', () => {
    openDoctorDetailsModal(doctor);
  });

  return card;
}

// ----------------------------------------------------
// DETAILS MODAL
// ----------------------------------------------------

function openHospitalDetailsModal(h) {
  const modal = document.getElementById('details-modal');
  const body = document.getElementById('modal-body-content');
  if (!modal || !body) return;

  const mapQuery = encodeURIComponent(`${h.name} ${h.address || 'Raipur'}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  body.innerHTML = `
    <div class="modal-header-section">
      <span class="type-badge ${h.type === 'government' ? 'badge-gov' : 'badge-pvt'}">${h.type || 'Hospital'}</span>
      <h2>${h.name}</h2>
    </div>

    <div class="detail-row">
      <span class="detail-label">🏢 ${t('label_address')}</span>
      <span class="detail-value">${h.address || t('label_not_available')}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">📞 ${t('label_phone')}</span>
      <span class="detail-value">
        ${h.phone ? `<a href="tel:${h.phone}">${h.phone}</a>` : t('label_not_available')}
      </span>
    </div>

    <div class="detail-row">
      <span class="detail-label">🚨 ${t('label_emergency')}</span>
      <span class="detail-value">
        ${h.emergencyPhone ? `<a href="tel:${h.emergencyPhone}" style="color: #dc2626; font-weight: 600;">${h.emergencyPhone}</a>` : '108 (Standard)'}
      </span>
    </div>

    ${h.website ? `
      <div class="detail-row">
        <span class="detail-label">🌐 ${t('label_website')}</span>
        <span class="detail-value">
          <a href="${h.website}" target="_blank" rel="noopener noreferrer">${h.website}</a>
        </span>
      </div>
    ` : ''}

    ${Array.isArray(h.specialties) && h.specialties.length > 0 ? `
      <div class="detail-section">
        <h4>${t('label_specialty')} (${h.specialties.length})</h4>
        <div class="chips-container">
          ${h.specialties.map((s) => `<span class="chip">${s}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    ${Array.isArray(h.services) && h.services.length > 0 ? `
      <div class="detail-section">
        <h4>Services Available (${h.services.length})</h4>
        <div class="chips-container">
          ${h.services.map((s) => `<span class="chip chip-service">${s}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    <div class="detail-meta">
      <small><strong>${t('label_source')}:</strong> ${h.source || 'Official Registry'}</small><br>
      <small><strong>${t('label_last_verified')}:</strong> ${h.lastVerified || 'Recent'}</small>
    </div>

    <div class="modal-footer-actions">
      ${h.phone ? `<a href="tel:${h.phone}" class="btn btn-call-primary">📞 Call Hospital</a>` : ''}
      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">🗺️ ${t('btn_directions')}</a>
    </div>
  `;

  modal.classList.remove('hidden');
}

function openDoctorDetailsModal(d) {
  const modal = document.getElementById('details-modal');
  const body = document.getElementById('modal-body-content');
  if (!modal || !body) return;

  const mapQuery = encodeURIComponent(`${d.hospitalName || d.name} Raipur`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  body.innerHTML = `
    <div class="modal-header-section">
      <span class="type-badge badge-doc">🩺 ${d.specialty || 'General Practitioner'}</span>
      <h2>${d.name}</h2>
      ${(d.designation || d.qualifications) ? `<p class="text-muted">${[d.designation, d.qualifications].filter(Boolean).join(' • ')}</p>` : ''}
    </div>

    <div class="detail-row">
      <span class="detail-label">🏥 ${t('label_hospital')}</span>
      <span class="detail-value">${d.hospitalName || 'Affiliated Hospital'}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">🩺 ${t('label_specialty')}</span>
      <span class="detail-value">${d.specialty || t('label_not_available')}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">🎓 Qualifications</span>
      <span class="detail-value">${d.qualifications || t('label_not_available')}</span>
    </div>

    ${d.visitingSchedule ? `
      <div class="detail-row">
        <span class="detail-label">🕒 Visiting schedule</span>
        <span class="detail-value">${d.visitingSchedule}${d.scheduleSourceUrl ? ` <a href="${d.scheduleSourceUrl}" target="_blank" rel="noopener noreferrer">Source</a>` : ''}</span>
      </div>
    ` : ''}

    <div class="detail-meta">
      <small><strong>${t('label_source')}:</strong> ${d.sourceUrl ? `<a href="${d.sourceUrl}" target="_blank" rel="noopener noreferrer">${d.source || 'Public directory'}</a>` : (d.source || 'Public directory')}</small><br>
      <small><strong>${t('label_last_verified')}:</strong> ${d.lastVerified || 'Recent'}</small>
    </div>

    <div class="modal-footer-actions">
      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">🗺️ ${t('btn_directions')}</a>
    </div>
  `;

  modal.classList.remove('hidden');
}

// ----------------------------------------------------
// TOAST NOTIFICATIONS
// ----------------------------------------------------

let toastTimeout = null;
export function showToast(message) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('visible');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}
