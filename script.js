/**
 * Delta Jeans - Penjahit Custom & Vermak
 * Interactive Frontend JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPriceCalculator();
  initDenimCustomizer();
  initBeforeAfterSlider();
  initMeasurementCalculator();
  initFaqAccordion();
  initBookingForm();
});

// Default WhatsApp Number for Delta Jeans (User can easily adjust)
const DELTA_WA_NUMBER = "6281234567890"; 

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      });
    });
  }

  // Scroll Header Shadow Enhancement
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-2xl', 'border-slate-700/80');
    } else {
      navbar.classList.remove('shadow-2xl', 'border-slate-700/80');
    }
  });
}

/* ==========================================================================
   2. Interactive Price Calculator & WA Generator
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

const ADDON_PRICES = {
  express: { name: 'Pengerjaan Kilat (1x24 Jam)', price: 25000 },
  brass_hardware: { name: 'Kancing Rivet Vintage Brass', price: 20000 },
  leather_patch: { name: 'Custom Leather Patch Asli', price: 30000 },
  double_chainstitch: { name: 'Aksen Double Chainstitch Benang Emas', price: 15000 }
};

function initPriceCalculator() {
  const serviceSelect = document.getElementById('calcService');
  const qtyInput = document.getElementById('calcQty');
  const addonsCheckboxes = document.querySelectorAll('.calc-addon');
  const totalPriceDisplay = document.getElementById('calcTotalPrice');
  const summaryList = document.getElementById('calcSummaryList');
  const waBtn = document.getElementById('calcWaBtn');

  function calculate() {
    if (!serviceSelect) return;
    const selectedKey = serviceSelect.value;
    const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1) || 1);
    const service = SERVICE_PRICES[selectedKey] || { name: 'Pilih Layanan', price: 0 };

    let baseTotal = service.price * qty;
    let addonsTotal = 0;
    let activeAddons = [];

    addonsCheckboxes.forEach(cb => {
      if (cb.checked) {
        const addon = ADDON_PRICES[cb.value];
        if (addon) {
          addonsTotal += addon.price;
          activeAddons.push(addon);
        }
      }
    });

    const grandTotal = baseTotal + addonsTotal;

    // Update UI
    if (totalPriceDisplay) {
      totalPriceDisplay.textContent = formatRupiah(grandTotal);
    }

    if (summaryList) {
      let html = `<li class="flex justify-between py-1 border-b border-slate-800">
        <span>${service.name} (x${qty})</span>
        <span class="font-medium text-amber-400">${formatRupiah(baseTotal)}</span>
      </li>`;

      activeAddons.forEach(addon => {
        html += `<li class="flex justify-between py-1 border-b border-slate-800 text-sm text-slate-300">
          <span>+ ${addon.name}</span>
          <span class="text-amber-400">${formatRupiah(addon.price)}</span>
        </li>`;
      });

      summaryList.innerHTML = html;
    }

    // WhatsApp Message URL
    if (waBtn) {
      let addonText = activeAddons.length > 0 
        ? `\n- Tambahan: ${activeAddons.map(a => a.name).join(', ')}` 
        : '';

      const waMsg = encodeURIComponent(
        `Halo Penjahit Delta Jeans! 👖\n\nSaya ingin konsultasi/order jahit atau vermak:\n` +
        `- Layanan: ${service.name} (Jumlah: ${qty} pcs)` +
        `${addonText}\n` +
        `- Estimasi Total Biaya: ${formatRupiah(grandTotal)}\n\n` +
        `Apakah bisa dibantu untuk proses pengerjaan dan jadwal kirim/datangnya? Terima kasih!`
      );
      waBtn.href = `https://wa.me/${DELTA_WA_NUMBER}?text=${waMsg}`;
    }
  }

  if (serviceSelect) serviceSelect.addEventListener('change', calculate);
  if (qtyInput) qtyInput.addEventListener('input', calculate);
  addonsCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

  calculate();
}

function formatRupiah(num) {
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ==========================================================================
   3. Denim Studio Visualizer (Interactive Customizer)
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
  const customizerWaBtn = document.getElementById('customizerWaBtn');

  let state = {
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

    // Visual styles change
    if (visualPants) {
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
        visualPants.style.borderColor = '#dc2626'; // Selvedge red line touch
      }

      // Stitch line colors
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
    elements.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.forEach(b => b.classList.remove('ring-2', 'ring-amber-400', 'bg-slate-800', 'border-amber-500'));
        btn.classList.add('ring-2', 'ring-amber-400', 'bg-slate-800', 'border-amber-500');
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
   4. Before & After Image Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-container');
  const beforeImg = document.querySelector('.ba-image-before');
  const handle = document.querySelector('.ba-slider-handle');

  if (!container || !beforeImg || !handle) return;

  let isDragging = false;

  function move(e) {
    if (!isDragging) return;
    const rect = container.getBoundingClientRect();
    const clientX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) || (e.pageX || (e.touches && e.touches[0].pageX) || 0);
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));

    beforeImg.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
    beforeImg.style.webkitClipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
    handle.style.left = `${percent}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    move(e);
  });
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', move);

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    move(e);
  }, { passive: true });
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', move, { passive: true });
}

/* ==========================================================================
   5. Self-Measurement Guide & Size Calculator
   ========================================================================== */
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
    let waist = parseFloat(waistInput.value) || 0;
    const unit = unitSelect ? unitSelect.value : 'cm';

    if (waist <= 0) {
      if (resultCard) resultCard.classList.add('hidden');
      return;
    }

    // Convert to inches for denim standard sizing
    let waistInch = unit === 'cm' ? (waist / 2.54) : waist;
    let approxSize = Math.round(waistInch);

    if (approxSize < 27) approxSize = 27;
    if (approxSize > 44) approxSize = 44;

    sizeText.textContent = `Size ${approxSize}`;
    detailText.textContent = `Perkiraan ukuran lingkar pinggang: ~${Math.round(waistInch)}" (${Math.round(waistInch * 2.54)} cm). Cocok untuk fitting standar dengan toleransi kenyamanan +1 hingga +2 cm.`;

    if (resultCard) resultCard.classList.remove('hidden');
  }

  if (waistInput) waistInput.addEventListener('input', calculateSize);
  if (unitSelect) unitSelect.addEventListener('change', calculateSize);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const waist = waistInput ? waistInput.value : '';
      const inseam = inseamInput ? inseamInput.value : '-';
      const thigh = thighInput ? thighInput.value : '-';
      const unit = unitSelect ? unitSelect.value : 'cm';

      const text = `Data Ukuran Celana Saya (Delta Jeans):\n- Lingkar Pinggang: ${waist} ${unit}\n- Panjang Celana (Inseam): ${inseam} ${unit}\n- Lingkar Paha: ${thigh} ${unit}`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Ukuran berhasil disalin! Anda bisa kirimkan ke chat WhatsApp.');
      });
    });
  }
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(i => i.classList.remove('active'));

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Booking & Consultation Form
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookName').value;
    const phone = document.getElementById('bookPhone').value;
    const type = document.getElementById('bookServiceType').value;
    const notes = document.getElementById('bookNotes').value;

    const message = encodeURIComponent(
      `Halo Delta Jeans, saya ingin booking / konsultasi layanan:\n\n` +
      `- Nama: ${name}\n` +
      `- No. Telepon: ${phone}\n` +
      `- Layanan: ${type}\n` +
      `- Keterangan / Catatan: ${notes || 'Fitting langsung / diskusi spesifikasi'}\n\n` +
      `Mohon info ketersediaan slot waktu pengerjaan. Terima kasih!`
    );

    window.open(`https://wa.me/${DELTA_WA_NUMBER}?text=${message}`, '_blank');
    showToast('Membuka WhatsApp untuk mengirim pesan konfirmasi...');
    form.reset();
  });
}

/* ==========================================================================
   8. Simple Toast Notification
   ========================================================================== */
function showToast(msg) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-500/60 text-slate-100 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm transition-all duration-300';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
    <span>${msg}</span>
  `;
  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
  }, 3500);
}
