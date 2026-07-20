/* ==========================================================================
   CONFIGURATION DU SITE
   Modifiez librement ce fichier : c'est ici que vivent les textes variables,
   les photos, les tarifs, les disponibilités et l'adresse e-mail de réception
   des demandes de réservation. Aucune autre modification de code n'est requise
   pour changer ces éléments.
   ========================================================================== */

const SITE_CONFIG = {
  // Adresse e-mail qui recevra les demandes de réservation (formulaire "mailto").
  // Remplacez par votre véritable adresse avant mise en ligne.
  contactEmail: "contact@luberon-et-pyrenees.fr",
  contactPhone: "+33 6 00 00 00 00",

  houses: {

    gordes: {
      name: "Gordes",
      region: "Luberon, Provence",
      theme: "gordes",
      heroImage: "images/gordes/img-4526.jpg",
      cardImage: "images/gordes/img-3587.jpg",
      tagline: "Maison en pierre sèche au cœur du domaine des Bastidons, à 8 minutes à pied du village classé de Gordes.",
      description: [
        "Maison de plain-pied, idéalement située dans un parc calme et sécurisé de 3 hectares, facile d'accès et à proximité immédiate du centre de Gordes.",
        "Rénovée en février 2023, elle est entièrement équipée et climatisée, pour profiter du confort en toute saison : 2 chambres, cuisine équipée avec bar, salle de bain, lave-vaisselle, machine Nespresso, télévision, wifi très haut débit (fibre) et système de son. Dès les premiers instants, on s'y sent chez soi.",
        "Terrasse ombragée, jardin arboré et fleuri, transats et salon de jardin complètent la maison, avec accès à une grande piscine partagée de 17 m x 9 m au sein de la propriété.",
        "Gordes, c'est aussi la promesse d'une douceur de vivre bien provençale : les volets qui claquent contre la pierre chaude, l'odeur des champs de lavande en été, et les marchés colorés du Luberon — celui de Gordes le mardi matin, ou le grand marché de L'Isle-sur-la-Sorgue le dimanche, réputé pour ses étals de fruits, fromages et antiquités.",
        "À deux pas, les moulins à huile du Luberon proposent visites et dégustations d'huile d'olive locale, et les domaines viticoles des Côtes du Luberon invitent à faire étape pour un verre de rosé face aux vignes. De quoi composer, jour après jour, un séjour à la fois confortable et pleinement provençal."
      ],
      amenities: [
        "2 chambres", "Climatisation", "Piscine partagée 17 x 9 m", "Cuisine équipée + bar",
        "Lave-vaisselle", "Machine Nespresso", "Wifi fibre très haut débit",
        "Système de son", "Terrasse ombragée", "Jardin arboré et fleuri",
        "Parking sécurisé", "Linge de maison fourni", "Arrivée autonome (boîte à clés)"
      ],
      gallery: [
        "img-3587-grande.jpeg","img-4526-grande.jpeg","img-4536-grande.jpeg","img-4560-grande.jpeg",
        "img-4595-grande.jpeg","img-4601-grande.jpeg","img-4656-grande.jpeg","img-4665-grande.jpeg",
        "img-4834-grande.jpeg","img-5015-grande.jpeg","img-5227-grande.jpeg","img-6065-grande.jpeg",
        "img-6538-grande.jpeg","img-0550-grande.jpeg","img-2299-grande.jpeg","img-2306-grande.jpeg",
        "img-2307-grande.jpeg","img-2314-grande.jpeg","img-2741-grande.jpeg","img-8130-grande.jpeg"
      ].map(f => "images/gordes/" + f),
      pricing: {
        highSeason: { label: "Juillet – Août", amount: 1400, unit: "la semaine", detail: "Arrivée le samedi après 15h, départ le samedi suivant avant 10h." },
        lowSeason: { label: "Hors saison", amount: 199, unit: "la nuit (3 nuits min.)", detail: "Arrivée possible tous les jours après 15h, départ avant 10h." }
      },
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
      name: "Marquixanes",
      region: "Conflent, Pyrénées-Orientales",
      theme: "marquixanes",
      heroImage: "images/marquixanes/img-7942.jpeg",
      cardImage: "images/marquixanes/img-8936-grande.jpeg",
      tagline: "Maison de village catalane du XVIIe, face à l'église Sainte-Eulalie, au pied du Canigou.",
      description: [
        "Maison de village pleine de charme, sur 2 étages, de 80 m², typique du Pays Catalan, entièrement rénovée intérieur et extérieur, avec poutres apparentes et parquet massif dans les chambres.",
        "Elle dispose de 3 chambres climatisées, d'une salle d'eau avec douche, de 2 toilettes et d'une pièce à vivre entièrement équipée. Elle peut accueillir jusqu'à 6 personnes, dans un confort pensé pour qu'on s'y sente vite chez soi.",
        "Située sur la place principale du village de Marquixanes, dans le centre ancien, face à l'église Sainte-Eulalie, accessible en voiture, dans un endroit calme à proximité des commerces.",
        "Ici, la montagne veille sur le village : le Canigou, sommet sacré des Catalans, domine le Conflent et ses vallées, offrant randonnées et panoramas à quelques minutes de la maison. Le petit train jaune, qui serpente entre Villefranche-de-Conflent et la Cerdagne, est une excursion incontournable.",
        "Et à moins de 40 minutes de route, la Méditerranée : les plages de sable d'Argelès-sur-Mer et de Canet, ou les criques de Collioure, pour alterner journées de montagne et après-midis de farniente. Sur la route, les vignobles du Roussillon et leurs vins gourmands, du Côtes du Roussillon au Banyuls, se visitent et se dégustent volontiers."
      ],
      amenities: [
        "3 chambres climatisées (6 personnes)", "80 m² sur 2 étages", "Poutres apparentes",
        "Parquet massif", "Salle d'eau + douche", "2 WC",
        "Wifi fibre", "Lit parapluie bébé", "Chaise haute",
        "Linge de maison fourni", "Face à l'église Sainte-Eulalie", "Arrivée autonome (boîte à clés)"
      ],
      gallery: [
        "img-6594-grande.jpeg","img-6771-grande.jpeg","img-5424-grande.jpeg","img-5427-grande.jpeg",
        "img-5428-grande.jpeg","img-7629-grande.jpeg","img-7631-grande.jpeg","img-7716-grande.jpeg",
        "img-7712-grande.jpeg","img-7732-grande.jpeg","img-7736-grande.jpeg","img-7941-grande.jpeg",
        "img-8220-grande.jpeg","img-8221-grande.jpeg","img-8222-grande.jpeg","img-8224-grande.jpeg",
        "img-8578-grande.jpeg","img-8577-grande.jpeg","img-8602-grande.jpeg","img-8936-grande.jpeg"
      ].map(f => "images/marquixanes/" + f),
      pricing: {
        highSeason: { label: "Juillet – Août", amount: 850, unit: "la semaine", detail: "Arrivée le samedi après 15h, départ le samedi suivant avant 10h." },
        lowSeason: { label: "Hors saison", amount: 79, unit: "la nuit (3 nuits min.)", detail: "Arrivée possible tous les jours après 15h, départ avant 10h." }
      },
      seasonRange: { startMonth: 7, startDay: 1, endMonth: 8, endDay: 31 },
      minNightsLowSeason: 3,
      unavailable: [
        { start: "2026-07-11", end: "2026-07-18" }
      ]
    }
  }
};
