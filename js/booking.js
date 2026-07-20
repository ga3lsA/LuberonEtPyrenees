// ==========================================================================
// MODULE DE RÉSERVATION
// Calendrier de disponibilité + calcul de tarif automatique + formulaire de
// demande. Le formulaire n'a pas besoin de serveur : il ouvre un e-mail
// pré-rempli vers SITE_CONFIG.contactEmail. Pour recevoir les demandes
// directement dans une base de données ou brancher un vrai paiement en ligne,
// voir les instructions dans README.md ("Aller plus loin").
// ==========================================================================

const DOW_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const MONTH_LABELS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-booking]");
  if (!root) return;
  const houseKey = root.getAttribute("data-booking");
  const house = SITE_CONFIG.houses[houseKey];
  if (!house) return;
  new BookingModule(root, house, houseKey);
});

class BookingModule {
  constructor(root, house, houseKey) {
    this.root = root;
    this.house = house;
    this.houseKey = houseKey;
    this.today = stripTime(new Date());
    this.viewMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.start = null;
    this.end = null;

    this.calNav = root.querySelector("[data-cal-label]");
    this.calGrid = root.querySelector("[data-cal-grid]");
    this.summaryEl = root.querySelector("[data-summary]");
    this.form = root.querySelector("[data-booking-form]");
    this.feedback = root.querySelector("[data-form-feedback]");

    root.querySelector("[data-cal-prev]").addEventListener("click", () => this.shiftMonth(-1));
    root.querySelector("[data-cal-next]").addEventListener("click", () => this.shiftMonth(1));

    if (this.form) this.form.addEventListener("submit", e => this.onSubmit(e));

    this.render();
  }

  shiftMonth(delta) {
    this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + delta, 1);
    this.render();
  }

  isUnavailable(date) {
    const t = date.getTime();
    return this.house.unavailable.some(r => {
      const s = parseISO(r.start).getTime();
      const e = parseISO(r.end).getTime();
      return t >= s && t <= e;
    });
  }

  onDayClick(date) {
    if (date < this.today || this.isUnavailable(date)) return;

    if (!this.start || (this.start && this.end)) {
      this.start = date;
      this.end = null;
    } else if (date.getTime() > this.start.getTime()) {
      // vérifie qu'aucune date indisponible n'est traversée
      let blocked = false;
      for (let d = new Date(this.start); d <= date; d.setDate(d.getDate() + 1)) {
        if (this.isUnavailable(d)) { blocked = true; break; }
      }
      if (blocked) {
        this.start = date;
        this.end = null;
      } else {
        this.end = date;
      }
    } else {
      this.start = date;
      this.end = null;
    }
    this.render();
  }

  render() {
    this.renderCalendar();
    this.renderSummary();
  }

  renderCalendar() {
    const y = this.viewMonth.getFullYear();
    const m = this.viewMonth.getMonth();
    this.calNav.textContent = `${MONTH_LABELS[m]} ${y}`;

    const firstDay = new Date(y, m, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Lundi = 0
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    let html = DOW_LABELS.map(d => `<div class="dow">${d}</div>`).join("");
    for (let i = 0; i < startOffset; i++) html += `<div class="day blank"></div>`;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(y, m, day);
      const past = date < this.today;
      const unavailable = this.isUnavailable(date);
      const isStart = this.start && sameDay(date, this.start);
      const isEnd = this.end && sameDay(date, this.end);
      const inRange = this.start && this.end && date > this.start && date < this.end;

      let cls = "day";
      if (past) cls += " past";
      else if (unavailable) cls += " unavailable";
      else cls += " available";
      if (isStart || isEnd) cls += " selected";
      if (inRange) cls += " in-range";

      html += `<div class="${cls}" data-date="${toISO(date)}">${day}</div>`;
    }

    this.calGrid.innerHTML = html;
    this.calGrid.querySelectorAll(".day.available, .day.selected").forEach(el => {
      el.addEventListener("click", () => this.onDayClick(parseISO(el.dataset.date)));
    });
  }

  renderSummary() {
    if (!this.start) {
      this.summaryEl.innerHTML = `<div class="row"><span>Sélectionnez une date d'arrivée dans le calendrier</span></div>`;
      this.updateHiddenFields(null, null, null);
      return;
    }
    if (!this.end) {
      this.summaryEl.innerHTML = `
        <div class="row"><span>Arrivée</span><span>${formatFR(this.start)}</span></div>
        <div class="row"><span>Départ</span><span>Sélectionnez une date</span></div>`;
      this.updateHiddenFields(this.start, null, null);
      return;
    }

    const result = computePrice(this.house, this.start, this.end);
    let rows = `
      <div class="row"><span>Arrivée</span><span>${formatFR(this.start)}</span></div>
      <div class="row"><span>Départ</span><span>${formatFR(this.end)}</span></div>
      <div class="row"><span>Durée</span><span>${result.nights} nuit${result.nights > 1 ? "s" : ""}</span></div>`;

    if (result.valid) {
      rows += `<div class="row total"><span>Estimation</span><span>${result.amount} € TTC</span></div>`;
    } else {
      rows += `<div class="row total"><span colspan="2">${result.message}</span></div>`;
    }
    this.summaryEl.innerHTML = rows;
    this.updateHiddenFields(this.start, this.end, result.valid ? result.amount : null);
  }

  updateHiddenFields(start, end, amount) {
    if (!this.form) return;
    const set = (name, val) => {
      const el = this.form.querySelector(`[name="${name}"]`);
      if (el) el.value = val || "";
    };
    set("checkin", start ? formatFR(start) : "");
    set("checkout", end ? formatFR(end) : "");
    set("estimate", amount ? amount + " € TTC" : "");
  }

  onSubmit(e) {
    e.preventDefault();
    const data = new FormData(this.form);
    const name = (data.get("name") || "").trim();
    const email = (data.get("email") || "").trim();

    if (!this.start || !this.end) {
      this.showFeedback("Merci de sélectionner une date d'arrivée et de départ sur le calendrier.", false);
      return;
    }
    if (!name || !email) {
      this.showFeedback("Merci de renseigner votre nom et votre e-mail.", false);
      return;
    }

    const result = computePrice(this.house, this.start, this.end);
    if (!result.valid) {
      this.showFeedback(result.message, false);
      return;
    }

    const subject = `Demande de réservation — ${this.house.name} — ${formatFR(this.start)} au ${formatFR(this.end)}`;
    const body = [
      `Maison : ${this.house.name} (${this.house.region})`,
      `Arrivée : ${formatFR(this.start)}`,
      `Départ : ${formatFR(this.end)}`,
      `Durée : ${result.nights} nuit(s)`,
      `Estimation : ${result.amount} € TTC`,
      `Voyageurs : ${data.get("guests") || "-"}`,
      ``,
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Téléphone : ${data.get("phone") || "-"}`,
      ``,
      `Message :`,
      `${data.get("message") || "-"}`
    ].join("\n");

    const mailto = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    this.showFeedback("Votre messagerie va s'ouvrir avec la demande pré-remplie. Il ne reste plus qu'à l'envoyer !", true);
  }

  showFeedback(message, ok) {
    if (!this.feedback) return;
    this.feedback.textContent = message;
    this.feedback.className = "form-feedback " + (ok ? "ok" : "err");
  }
}

// --- Calcul de tarif selon les règles saison haute / basse saison ---------
function computePrice(house, start, end) {
  const nights = Math.round((end - start) / 86400000);
  const startsSaturday = start.getDay() === 6;
  const bothInSeason = isWithinSeason(house, start) && isWithinSeason(house, end);
  const eitherInSeason = isWithinSeason(house, start) || isWithinSeason(house, end);

  if (bothInSeason && startsSaturday && nights === 7) {
    return { valid: true, nights, amount: house.pricing.highSeason.amount, isHighSeason: true };
  }
  if (eitherInSeason) {
    return {
      valid: false, nights,
      message: `En haute saison (juillet-août), ${house.name} se loue uniquement à la semaine, du samedi au samedi (${house.pricing.highSeason.amount} € TTC).`
    };
  }
  if (nights < house.minNightsLowSeason) {
    return {
      valid: false, nights,
      message: `Hors saison, la durée minimum est de ${house.minNightsLowSeason} nuits.`
    };
  }
  return { valid: true, nights, amount: nights * house.pricing.lowSeason.amount, isHighSeason: false };
}

function isWithinSeason(house, date) {
  const { startMonth, startDay, endMonth, endDay } = house.seasonRange;
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const value = m * 100 + d;
  return value >= (startMonth * 100 + startDay) && value <= (endMonth * 100 + endDay);
}

// --- Utilitaires de date ---------------------------------------------------
function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function toISO(d) {
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatFR(d) {
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}
