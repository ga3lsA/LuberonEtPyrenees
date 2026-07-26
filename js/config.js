/* ==========================================================================
   CONFIGURATION TECHNIQUE DU SITE
   Les textes, photos, tarifs et le contenu des pages vivent maintenant dans
   les fichiers data/*.json (voir README) et s'éditent via le back office
   (pages/admin-manuel.html) ou directement dans ces fichiers JSON.
   Ce fichier ne garde que les réglages techniques du moteur de réservation
   et l'adresse e-mail de contact.
   ========================================================================== */

const SITE_CONFIG = {
  // Adresse e-mail qui recevra les demandes de réservation (formulaire "mailto").
  contactEmail: "gaelsanquer@hotmail.com",
  contactPhone: "+33 6 00 00 00 00",

  houses: {

    gordes: {
      theme: "gordes",
      seasonRange: { startMonth: 7, startDay: 1, endMonth: 8, endDay: 31 },
      minNightsLowSeason: 3,
      // Périodes déjà réservées (format YYYY-MM-DD, bornes incluses). À tenir à jour manuellement,
      // ou à connecter à un calendrier iCal (voir README) pour une synchronisation automatique.
      unavailable: [
        { start: "2026-08-01", end: "2026-08-08" },
        { start: "2026-08-08", end: "2026-08-15" }
      ]
    },

    marquixanes: {
      theme: "marquixanes",
      seasonRange: { startMonth: 7, startDay: 1, endMonth: 8, endDay: 31 },
      minNightsLowSeason: 3,
      unavailable: [
        { start: "2026-07-11", end: "2026-07-18" }
      ]
    }
  }
};
