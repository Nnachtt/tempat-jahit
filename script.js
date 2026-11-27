/**
 * Delta Jeans - Penjahit Custom & Vermak
 * Interactive Frontend JavaScript Logic
 */

/* ==========================================================================
   KONFIGURASI SITUS — ISI DATA ASLI DI SINI (satu tempat saja)
   ========================================================================== */
const SITE = {
  // Nomor WhatsApp format internasional tanpa "+" atau spasi, mis. 6281234567890
  // PENTING: nilai di bawah masih nomor contoh. Ganti dengan nomor asli.
  waNumber: '6281234567890',
  // Tampilan nomor di bagian Lokasi, mis. '+62 812-3456-7890'
  phoneDisplay: '+62 812-3456-7890',
  // Alamat lengkap. Kosong = baris alamat disembunyikan.
  address: '',
  // Link Google Maps. Kosong = pakai link yang sudah ada di HTML.
  mapsUrl: '',
  // URL peta tertanam: Google Maps > Bagikan > Sematkan peta > salin isi src="..."
  // Harus diawali https://www.google.com/maps/embed
  mapEmbedUrl: '',
  // Foto Sebelum/Sesudah (path file, mis. 'img/sebelum.jpg'). Kosong = tampilan ilustrasi.
  beforePhoto: '',
  afterPhoto: '',
  beforeAlt: 'Celana jeans sebelum vermak: sobek di selangkangan dan kepanjangan',
  afterAlt: 'Celana jeans sesudah vermak: tambalan rapi dan panjang pas'
};

const DELTA_WA_NUMBER = SITE.waNumber;

document.addEventListener('DOMContentLoaded', () => {
  initSiteInfo();
  initThemeToggle();
  initNavbar();
  initPriceCalculator();
  initDenimCustomizer();
  initBeforeAfterSlider();
  initMeasurementCalculator();
  initFaqAccordion();
});

/* ==========================================================================
   0. Site info (nomor WA, alamat, peta) dari satu konfigurasi
   ========================================================================== */
function initSiteInfo() {
  // Ganti nomor di semua link wa.me tanpa mengubah teks pesan bawaan
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
    a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${SITE.waNumber}`);
  });

  document.querySelectorAll('[data-site-phone]').forEach(el => {
    el.textContent = SITE.phoneDisplay;
  });

  const addr = document.getElementById('siteAddress');
  if (addr && SITE.address) {
    addr.textContent = SITE.address;
    addr.classList.remove('hidden');
  }

  if (SITE.mapsUrl) {
    document.querySelectorAll('a[data-maps]').forEach(a => { a.href = SITE.mapsUrl; });
  }

  const mapBox = document.getElementById('mapPlaceholder');
  if (mapBox && /^https:\/\/www\.google\.com\/maps\/embed/.test(SITE.mapEmbedUrl)) {
    mapBox.className = 'h-64 sm:h-72 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800';
    mapBox.innerHTML = '';
    const frame = document.createElement('iframe');
    frame.src = SITE.mapEmbedUrl;
    frame.title = 'Peta lokasi workshop Delta Jeans';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.className = 'w-full h-full border-0';
    frame.setAttribute('allowfullscreen', '');
    mapBox.appendChild(frame);
  }
}

/* ==========================================================================
   1. Theme Toggle (Light Mode / Dark Mode)
   ========================================================================== */
function getStoredTheme() {
  try { return localStorage.getItem('theme'); } catch (e) { return null; }
}
function storeTheme(value) {
  try { localStorage.setItem('theme', value); } catch (e) { /* penyimpanan diblokir */ }
}

function initThemeToggle() {
  const root = document.documentElement;
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

  // Tema tersimpan > preferensi sistem > gelap (sesuai desain asli)
  const saved = getStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  root.classList.toggle('dark', isDark);

  function syncPressed() {
    const dark = root.classList.contains('dark');
    themeToggleBtns.forEach(btn => btn.setAttribute('aria-pressed', String(dark)));
  }
  syncPressed();

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowDark = !root.classList.contains('dark');
      root.classList.toggle('dark', nowDark);
      storeTheme(nowDark ? 'dark' : 'light');
      syncPressed();
    });
  });
}

/* ==========================================================================
   2. Navigation & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const navbar = document.getElementById('navbar');

  if (!mobileMenuBtn || !mobileMenu) return;

  // Drawer tertutup: elemen di dalamnya tidak boleh bisa difokus / dibaca
  mobileMenu.setAttribute('inert', '');

  const isOpen = () => mobileMenu.classList.contains('translate-x-0');

  function openSidebar() {
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      mobileBackdrop.classList.add('opacity-100', 'pointer-events-auto');
    }
    mobileMenu.removeAttribute('inert');
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden');
    if (mobileCloseBtn) mobileCloseBtn.focus();
  }

  function closeSidebar(restoreFocus = true) {
    const wasOpen = isOpen();
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
      mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
    }
    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.setAttribute('inert', '');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');
    if (wasOpen && restoreFocus) mobileMenuBtn.focus();
  }

  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen()) closeSidebar(); else openSidebar();
  });

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => closeSidebar());
  }

  // Tutup saat link diklik (tanpa memindahkan fokus agar anchor tetap berjalan)
  navLinks.forEach(link => {
    link.addEventListener('click', () => closeSidebar(false));
  });

  // Tutup dengan Escape (hanya jika memang terbuka)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeSidebar();
  });

  // Tutup otomatis saat layar melebar ke mode desktop
  if (window.matchMedia) {
    const desktopMq = window.matchMedia('(min-width: 1280px)');
    const onChange = (e) => { if (e.matches) closeSidebar(false); };
    if (desktopMq.addEventListener) desktopMq.addEventListener('change', onChange);
  }

  // Bayangan header saat discroll
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-2xl', 'border-slate-700/80');
    } else {
      navbar.classList.remove('shadow-2xl', 'border-slate-700/80');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Interactive Price Calculator & WA Generator
   ========================================================================== */
const SERVICE_PRICES = {
  potong_biasa: { name: 'Potong Panjang Standar', price: 20000 },
  potong_original: { name: 'Potong Sambung Original Hem', price: 35000 },
  potong_chainstitch: { name: 'Potong Kelim Chainstitch (Rantai)', price: 40000 },
  kecilkan_pinggang: { name: 'Kecilkan Pinggang Celana', price: 35000 },
  tapering_kaki: { name: 'Tapering / Kecilkan Paha ke Kaki', price: 45000 },
  total_resize: { name: 'Bongkar Total Resize Full Celana', price: 75000 },
  ganti_zipper: { name: 'Ganti Resleting YKK Kuningan', price: 30000 },
  darning_sobek: { name: 'Tambal Sobek / Darning Celana', price: 35000 },
  custom_jeans_standard: { name: 'Jahit Custom Jeans Reguler', price: 230000 },
  custom_jeans_raw: { name: 'Jahit Custom Raw Denim 14-16oz', price: 360000 },
  custom_jeans_selvedge: { name: 'Jahit Custom Selvedge Denim', price: 550000 },
  custom_jacket_denim: { name: 'Jahit Jaket Trucker Denim', price: 450000 },
  custom_apron_denim: { name: 'Jahit Custom Denim Apron', price: 125000 }
};

// perPcs: true = dikalikan jumlah pcs; false = tarif tetap per pesanan
const ADDON_PRICES = {
  express: { name: 'Pengerjaan Kilat (1x24 Jam)', price: 25000, perPcs: true },
  brass_hardware: { name: 'Kancing Rivet Vintage Brass', price: 20000, perPcs: false },
  leather_patch: { name: 'Custom Leather Patch Asli', price: 30000, perPcs: false },
  double_chainstitch: { name: 'Aksen Double Chainstitch Benang Emas', price: 15000, perPcs: false }
};

// Diskon jumlah. Isi rate (mis. 0.1 = 10%) setelah ditentukan pemilik.
// rate 0 = tidak ada diskon, dan catatan diskon disembunyikan.
const QTY_DISCOUNT = { minQty: 6, rate: 0 };
const MAX_QTY = 50;

function formatRupiah(num) {
  return 'Rp ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function initPriceCalculator() {
  const serviceSelect = document.getElementById('calcService');
  const qtyInput = document.getElementById('calcQty');
  const addonsCheckboxes = document.querySelectorAll('.calc-addon');
  const totalPriceDisplay = document.getElementById('calcTotalPrice');
  const summaryList = document.getElementById('calcSummaryList');
  const waBtn = document.getElementById('calcWaBtn');
  const discountNote = document.getElementById('calcDiscountNote');

  // Satu sumber harga: label di HTML disinkronkan dari data JS
  if (serviceSelect) {
    serviceSelect.querySelectorAll('option').forEach(opt => {
      const svc = SERVICE_PRICES[opt.value];
      if (!svc) return;
      const base = opt.textContent.replace(/\s*\(Rp[^)]*\)\s*$/, '').trim();
      opt.textContent = `${base} (${formatRupiah(svc.price)})`;
    });
  }
  document.querySelectorAll('[data-addon-price]').forEach(el => {
    const addon = ADDON_PRICES[el.dataset.addonPrice];
    if (!addon) return;
    el.textContent = `+${formatRupiah(addon.price)}${addon.perPcs ? ' / pcs' : ''}`;
  });
  if (discountNote && QTY_DISCOUNT.rate > 0) {
    discountNote.textContent = `(Diskon ${Math.round(QTY_DISCOUNT.rate * 100)}% untuk ${QTY_DISCOUNT.minQty} pcs atau lebih)`;
  }

  function readQty() {
    const raw = parseInt(qtyInput ? qtyInput.value : 1, 10);
    return Math.min(MAX_QTY, Math.max(1, Number.isNaN(raw) ? 1 : raw));
  }

  function calculate() {
    if (!serviceSelect) return;
    const qty = readQty();
    const service = SERVICE_PRICES[serviceSelect.value] || { name: 'Pilih Layanan', price: 0 };

    const baseTotal = service.price * qty;
    const discount = (QTY_DISCOUNT.rate > 0 && qty >= QTY_DISCOUNT.minQty)
      ? Math.round(baseTotal * QTY_DISCOUNT.rate)
      : 0;

    let addonsTotal = 0;
    const activeAddons = [];
    addonsCheckboxes.forEach(cb => {
      if (!cb.checked) return;
      const addon = ADDON_PRICES[cb.value];
      if (!addon) return;
      const cost = addon.perPcs ? addon.price * qty : addon.price;
      addonsTotal += cost;
      activeAddons.push({ name: addon.name, cost, perPcs: addon.perPcs, unit: addon.price });
    });

    const grandTotal = baseTotal - discount + addonsTotal;

    if (totalPriceDisplay) totalPriceDisplay.textContent = formatRupiah(grandTotal);

    if (summaryList) {
      let html = `<li class="flex justify-between gap-3 py-1 border-b border-slate-800">
        <span>${service.name} (x${qty})</span>
        <span class="font-medium text-amber-400 shrink-0">${formatRupiah(baseTotal)}</span>
      </li>`;

      activeAddons.forEach(addon => {
        const qtyNote = addon.perPcs && qty > 1 ? ` (x${qty})` : '';
        html += `<li class="flex justify-between gap-3 py-1 border-b border-slate-800 text-sm text-slate-300">
          <span>+ ${addon.name}${qtyNote}</span>
          <span class="text-amber-400 shrink-0">${formatRupiah(addon.cost)}</span>
        </li>`;
      });

      if (discount > 0) {
        html += `<li class="flex justify-between gap-3 py-1 border-b border-slate-800 text-sm text-slate-300">
          <span>Diskon jumlah</span>
          <span class="text-amber-400 shrink-0">- ${formatRupiah(discount)}</span>
        </li>`;
      }
      summaryList.innerHTML = html;
    }

    if (waBtn) {
      const addonText = activeAddons.length > 0
        ? `\n- Tambahan: ${activeAddons.map(a => a.name).join(', ')}`
        : '';
      const discountText = discount > 0 ? `\n- Diskon jumlah: ${formatRupiah(discount)}` : '';

      const waMsg = encodeURIComponent(
        `Halo Penjahit Delta Jeans! 👖\n\nSaya ingin konsultasi/order jahit atau vermak:\n` +
        `- Layanan: ${service.name} (Jumlah: ${qty} pcs)` +
        `${addonText}${discountText}\n` +
        `- Estimasi Total Biaya: ${formatRupiah(grandTotal)}\n\n` +
        `Apakah bisa dibantu untuk proses pengerjaan dan jadwal kirim/datangnya? Terima kasih!`
      );
      waBtn.href = `https://wa.me/${DELTA_WA_NUMBER}?text=${waMsg}`;
    }
  }

  if (serviceSelect) serviceSelect.addEventListener('change', calculate);
  if (qtyInput) {
    qtyInput.addEventListener('input', calculate);
    // Rapikan nilai di kolom saat selesai mengetik (mis. 999 menjadi 50)
    qtyInput.addEventListener('change', () => {
      qtyInput.value = String(readQty());
      calculate();
    });
  }
  addonsCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

  calculate();
}

/* ==========================================================================
   4. Denim Studio Visualizer (Interactive Customizer)
   ========================================================================== */
function initDenimCustomizer() {
  const cutOptions = document.querySelectorAll('.custom-cut-opt');
  const fabricOptions = document.querySelectorAll('.custom-fabric-opt');
  const stitchOptions = document.querySelectorAll('.custom-stitch-opt');
  const hardwareOptions = document.querySelectorAll('.custom-hw-opt');

  const previewCutText = document.getElementById('previewCutText');
  const previewFabricText = document.getElementById('previewFabricText');
  const previewStitchText = document.getElementById('previewStitchText');
  const previewHwText = document.getElementById('previewHwText');
  const visualPants = document.getElementById('visualPants');
  const visualRivet = document.getElementById('visualRivet');
  const customizerWaBtn = document.getElementById('customizerWaBtn');

  // Lebar siluet pratinjau mengikuti pilihan potongan
  const CUT_WIDTH = {
    'Slim Fit': '9.5rem',
    'Slim Straight': '10.5rem',
    'Regular Classic': '11.5rem',
    'Loose / Baggy': '12.5rem'
  };

  const state = {
    cut: 'Slim Fit',
    fabric: 'Deep Indigo Raw 15oz',
    stitch: 'Tobacco Gold Chainstitch',
    hardware: 'Vintage Copper Brass'
  };

  function updateStateUI() {
    if (previewCutText) previewCutText.textContent = state.cut;
    if (previewFabricText) previewFabricText.textContent = state.fabric;
    if (previewStitchText) previewStitchText.textContent = state.stitch;
    if (previewHwText) previewHwText.textContent = state.hardware;

    if (visualPants) {
      visualPants.style.width = CUT_WIDTH[state.cut] || '11rem';

      if (state.fabric.includes('Raw')) {
        visualPants.style.backgroundColor = '#101d36';
        visualPants.style.borderColor = '#1e3a8a';
      } else if (state.fabric.includes('Washed')) {
        visualPants.style.backgroundColor = '#3878b4';
        visualPants.style.borderColor = '#60a5fa';
      } else if (state.fabric.includes('Black')) {
        visualPants.style.backgroundColor = '#18181b';
        visualPants.style.borderColor = '#3f3f46';
      } else if (state.fabric.includes('Selvedge')) {
        visualPants.style.backgroundColor = '#0b132b';
        visualPants.style.borderColor = '#dc2626'; // garis merah selvedge
      }

      const stitches = visualPants.querySelectorAll('.denim-stitch-line');
      stitches.forEach(st => {
        if (state.stitch.includes('Gold') || state.stitch.includes('Tobacco')) {
          st.style.borderColor = '#f59e0b';
        } else if (state.stitch.includes('Copper')) {
          st.style.borderColor = '#d97706';
        } else if (state.stitch.includes('Black')) {
          st.style.borderColor = '#27272a';
        } else {
          st.style.borderColor = '#e2e8f0';
        }
      });
    }

    // Warna kancing pada pratinjau mengikuti pilihan hardware
    if (visualRivet) {
      if (state.hardware.includes('Silver')) {
        visualRivet.style.backgroundColor = '#cbd5e1';
      } else if (state.hardware.includes('Gunmetal')) {
        visualRivet.style.backgroundColor = '#52525b';
      } else {
        visualRivet.style.backgroundColor = '#d97706';
      }
    }

    if (customizerWaBtn) {
      const msg = encodeURIComponent(
        `Halo Delta Jeans, saya tertarik memesan Custom Jeans dengan konfigurasi:\n` +
        `- Potongan: ${state.cut}\n` +
        `- Bahan Denim: ${state.fabric}\n` +
        `- Benang Jahit: ${state.stitch}\n` +
        `- Hardware Kancing: ${state.hardware}\n\n` +
        `Bisa konsultasikan ketersediaan bahan dan langkah ukurnya?`
      );
      customizerWaBtn.href = `https://wa.me/${DELTA_WA_NUMBER}?text=${msg}`;
    }
  }

  function bindOptions(elements, key, stateKey) {
    const selectedClasses = ['ring-2', 'ring-amber-400', 'bg-slate-800', 'border-amber-500'];
    elements.forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.classList.contains('ring-2')));
      btn.addEventListener('click', () => {
        elements.forEach(b => {
          b.classList.remove(...selectedClasses);
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add(...selectedClasses);
        btn.setAttribute('aria-pressed', 'true');
        state[stateKey] = btn.getAttribute(`data-${key}`) || btn.textContent.trim();
        updateStateUI();
      });
    });
  }

  bindOptions(cutOptions, 'cut', 'cut');
  bindOptions(fabricOptions, 'fabric', 'fabric');
  bindOptions(stitchOptions, 'stitch', 'stitch');
  bindOptions(hardwareOptions, 'hw', 'hardware');

  updateStateUI();
}

/* ==========================================================================
   5. Before & After Image Comparison Slider
   ========================================================================== */
function applyPhoto(panel, src, alt) {
  if (!panel || !src) return;
  if (getComputedStyle(panel).position === 'static') panel.style.position = 'relative';

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.draggable = false;
  img.className = 'absolute inset-0 w-full h-full object-cover';

  const shade = document.createElement('div');
  shade.className = 'absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30';
  shade.setAttribute('aria-hidden', 'true');

  // Konten teks tetap di atas foto
  Array.from(panel.children).forEach(child => child.classList.add('relative', 'z-10'));
  panel.prepend(shade);
  panel.prepend(img);
}

function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-container');
  const beforeImg = document.querySelector('.ba-image-before');
  const handle = document.querySelector('.ba-slider-handle');

  if (!container || !beforeImg || !handle) return;

  const afterPanel = container.querySelector(':scope > div:not(.ba-image-before):not(.ba-slider-handle)');
  applyPhoto(afterPanel, SITE.afterPhoto, SITE.afterAlt);
  applyPhoto(beforeImg, SITE.beforePhoto, SITE.beforeAlt);

  function setPos(percent) {
    const p = Math.min(100, Math.max(0, percent));
    const clip = `polygon(0 0, ${p}% 0, ${p}% 100%, 0 100%)`;
    beforeImg.style.clipPath = clip;
    beforeImg.style.webkitClipPath = clip;
    handle.style.left = `${p}%`;
    handle.setAttribute('aria-valuenow', String(Math.round(p)));
    handle.setAttribute('aria-valuetext', `Sebelum ${Math.round(p)} persen, sesudah ${100 - Math.round(p)} persen`);
  }

  const posFromEvent = (e) => {
    const rect = container.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };

  let dragging = false;
  container.addEventListener('pointerdown', (e) => {
    dragging = true;
    setPos(posFromEvent(e));
  });
  window.addEventListener('pointermove', (e) => {
    if (dragging) setPos(posFromEvent(e));
  });
  ['pointerup', 'pointercancel'].forEach(type => {
    window.addEventListener(type, () => { dragging = false; });
  });

  // Kontrol keyboard: panah kiri/kanan, Home/End, Shift = langkah lebih besar
  handle.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 2;
    const current = Number(handle.getAttribute('aria-valuenow')) || 50;
    if (e.key === 'ArrowLeft') setPos(current - step);
    else if (e.key === 'ArrowRight') setPos(current + step);
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  });

  setPos(50);
}

/* ==========================================================================
   6. Self-Measurement Guide & Size Calculator
   ========================================================================== */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Cadangan untuk konteks non-HTTPS / izin ditolak
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

function initMeasurementCalculator() {
  const waistInput = document.getElementById('measureWaist');
  const inseamInput = document.getElementById('measureInseam');
  const thighInput = document.getElementById('measureThigh');
  const unitSelect = document.getElementById('measureUnit');
  const resultCard = document.getElementById('measureResultCard');
  const sizeText = document.getElementById('suggestedSizeText');
  const detailText = document.getElementById('suggestedDetailText');
  const copyBtn = document.getElementById('copyMeasureBtn');

  function calculateSize() {
    if (!waistInput || !sizeText) return;
    const waist = parseFloat(waistInput.value) || 0;
    const unit = unitSelect ? unitSelect.value : 'cm';

    if (waist <= 0) {
      if (resultCard) resultCard.classList.add('hidden');
      return;
    }

    // Konversi ke inci (standar ukuran jeans)
    const waistInch = unit === 'cm' ? (waist / 2.54) : waist;
    let approxSize = Math.round(waistInch);
    if (approxSize < 27) approxSize = 27;
    if (approxSize > 44) approxSize = 44;

    sizeText.textContent = `Size ${approxSize}`;
    detailText.textContent = `Perkiraan ukuran lingkar pinggang: ~${Math.round(waistInch)}" (${Math.round(waistInch * 2.54)} cm). Ukuran akhir dikonfirmasi saat fitting atau dari contoh celana yang Anda kirim.`;

    if (resultCard) resultCard.classList.remove('hidden');
  }

  if (waistInput) waistInput.addEventListener('input', calculateSize);
  if (unitSelect) unitSelect.addEventListener('change', calculateSize);

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const waist = waistInput ? waistInput.value.trim() : '';
      if (!waist) {
        showToast('Isi lingkar pinggang dulu ya, lalu salin catatannya.');
        if (waistInput) waistInput.focus();
        return;
      }
      const inseam = (inseamInput && inseamInput.value.trim()) || '-';
      const thigh = (thighInput && thighInput.value.trim()) || '-';
      const unit = unitSelect ? unitSelect.value : 'cm';

      const text = `Data Ukuran Celana Saya (Delta Jeans):\n- Lingkar Pinggang: ${waist} ${unit}\n- Panjang Celana (Inseam): ${inseam} ${unit}\n- Lingkar Paha: ${thigh} ${unit}`;
      const ok = await copyText(text);
      showToast(ok
        ? 'Ukuran berhasil disalin! Anda bisa kirimkan ke chat WhatsApp.'
        : 'Gagal menyalin otomatis. Silakan salin ukuran secara manual.');
    });
  }
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    if (!header || !content) return;

    // Hubungkan tombol dan panelnya untuk pembaca layar
    const headerId = `faq-btn-${index}`;
    const panelId = `faq-panel-${index}`;
    header.id = headerId;
    header.setAttribute('aria-controls', panelId);
    header.setAttribute('aria-expanded', 'false');
    content.id = panelId;
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', headerId);

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => {
        i.classList.remove('active');
        const c = i.querySelector('.faq-content');
        const h = i.querySelector('.faq-header');
        if (c) c.style.maxHeight = null;
        if (h) h.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   8. Simple Toast Notification
   ========================================================================== */
let toastTimer = null;

function showToast(msg) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-500/60 text-slate-100 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm transition-all duration-300 max-w-[90vw]';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" aria-hidden="true"></span>
    <span></span>
  `;
  toast.lastElementChild.textContent = msg; // textContent: aman dari injeksi HTML
  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0)';

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
  }, 3500);
}
