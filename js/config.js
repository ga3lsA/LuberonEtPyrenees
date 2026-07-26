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
  contactEmail: "gaelsanquer@hotmail.com",
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
  },

  // Contenu des pages "manuel de la maison" (pages/manuel-gordes.html et
  // pages/manuel-marquixanes.html), non listées dans le menu du site et
  // transmises directement aux voyageurs. Voir le README section 5 pour le
  // détail, mais en résumé :
  // - Pour AJOUTER une section : ajoutez un objet { title, paragraphs, images }
  //   n'importe où dans le tableau de la maison concernée.
  // - Pour RÉORDONNER les sections : déplacez un objet { ... } à un autre
  //   endroit du tableau — l'ordre du tableau est l'ordre affiché sur la page.
  // - "images" est facultatif (omettez-le, ou laissez un tableau vide [], pour
  //   une section sans photo).
  // - Les chemins d'images sont relatifs à la racine du site (comme partout
  //   ailleurs dans ce fichier), par ex. "images/gordes/manuel/mon-fichier.jpg".
  manuals: {
    gordes: [
      {
        title: "Sécurité",
        paragraphs: [
          "L'extincteur se trouve sous l'évier de la cuisine.<br>\nLe détecteur de fumée et de monoxyde de carbone est situé au-dessus de la porte d'entrée.<br>\nLa trousse de premiers secours se trouve dans le tiroir sous la vasque de la salle de bains."
        ],
        images: [
          { src: "images/gordes/manuel/img-9145-moyenne.jpeg", alt: "L'extincteur situé dans la cuisine sous l'évier", caption: "L'extincteur, sous l'évier de la cuisine" },
          { src: "images/gordes/manuel/img-9144-moyenne.jpeg", alt: "Détecteur de monoxyde de carbone", caption: "Détecteur de fumée / monoxyde" },
          { src: "images/gordes/manuel/img-9146-moyenne.jpeg", alt: "Trousse de premiers secours", caption: "Trousse de premiers secours" }
        ]
      },
      {
        title: "Électricité",
        paragraphs: [
          "Il peut arriver, lorsque le chauffage est allumé en hiver, que le disjoncteur saute. En cas de coupure, allez au tableau électrique situé dans le petit placard derrière la porte d'entrée. Si le disjoncteur général est sur « Off », rallumez-le. S'il est toujours sur « On », la disjonction s'est faite sur le tableau principal du domaine, à l'extérieur de la maison.",
          "Rendez-vous au Bastidon n°14, à quelques pas en descendant l'allée sur la droite. Vous trouverez un tableau électrique bleu : ouvrez la porte et réenclenchez le disjoncteur numéro 5."
        ],
        images: [
          { src: "images/gordes/manuel/img-9147-moyenne.jpeg", alt: "Le coffret électrique derrière la porte", caption: "Le coffret électrique, derrière la porte" },
          { src: "images/gordes/manuel/img-9160.jpeg", alt: "Le Bastidon N°14", caption: "Le Bastidon n°14" },
          { src: "images/gordes/manuel/img-9161.jpeg", alt: "Le boîtier électrique sur le mur", caption: "Le boîtier électrique, sur le mur" },
          { src: "images/gordes/manuel/img-9162.jpeg", alt: "Enclenchez le disjoncteur N°5", caption: "Réenclenchez le n°5 en cas de disjonction" }
        ]
      },
      {
        title: "Télévision et système son",
        paragraphs: [
          "La télécommande Samsung gère à la fois la télé et la barre de son : choisissez TV ou BD pour allumer l'une ou l'autre.",
          "Allumez la télé et choisissez HDMI1. Allumez la barre de son : le son sort par la barre de son après quelques secondes, qui doit afficher « D.IN ». Allumez la box Orange avec la télécommande Orange, et choisissez une chaîne TV, Netflix ou Amazon Prime.",
          "Une clé Google Chromecast est disponible sur la télé (entrée HDMI 2) et permet de diffuser les contenus de vos téléphones ou tablettes. Connectez-vous au wifi de la maison pour caster sur « Chromecast Gordes »."
        ],
        images: [
          { src: "images/gordes/manuel/img-9149-moyenne.jpeg", alt: "Télécommandes", caption: "Les télécommandes" }
        ]
      },
      {
        title: "Utilisation du coffre-fort",
        paragraphs: [
          "Un coffre est à votre disposition dans la maison. La porte doit être ouverte : appuyez sur le bouton rouge situé à l'arrière de la porte, vous entendrez 2 bips. Choisissez votre code, de 3 à 8 chiffres, en terminant par « E » ; vous entendrez de nouveau 2 bips. Fermez la porte en tournant la molette.",
          "Pour l'ouvrir à nouveau, tapez votre code suivi de « E ». Les voyants verts s'allument : tournez la molette. En cas de problème ou d'oubli du code, une clé est disponible."
        ],
        images: [
          { src: "images/gordes/manuel/img-8987-grande.jpeg", alt: "Le clavier du coffre", caption: "Le clavier du coffre" },
          { src: "images/gordes/manuel/img-8988-grande.jpeg", alt: "Le bouton rouge du coffre", caption: "Le bouton rouge, à l'arrière de la porte" }
        ]
      },
      {
        title: "Plaque de cuisson",
        paragraphs: [
          "Il est possible, de façon aléatoire, que la plaque de cuisson se mette en sécurité et se mette à biper de manière régulière. Pour la redémarrer, il suffit de l'éteindre et de la rallumer depuis le boîtier électrique situé derrière la porte d'entrée."
        ],
        images: [
          { src: "images/gordes/manuel/img-9148-moyenne.jpeg", alt: "Plaque de cuisson", caption: "La plaque de cuisson" }
        ]
      },
      {
        title: "Rallonges électriques et adaptateurs",
        paragraphs: [
          "Ils sont disponibles dans le tiroir du meuble sous la télé."
        ],
        images: [
          { src: "images/gordes/manuel/img-9150-moyenne.jpeg", alt: "Rallonges électriques", caption: "Rallonges et adaptateurs" }
        ]
      },
      {
        title: "Chargeurs téléphone",
        paragraphs: [
          "Les prises électriques des chambres sont équipées de prises USB-C et de chargeurs intégrés pour charger téléphones et tablettes."
        ],
        images: [
          { src: "images/gordes/manuel/img-9154-moyenne.jpeg", alt: "Prise électrique et USB-C", caption: "Prise avec USB-C intégré" }
        ]
      },
      {
        title: "Jeux",
        paragraphs: [
          "Des jeux de cartes et de Uno, ainsi que des raquettes de ping-pong (la table se trouve au pool house, près de la piscine), sont rangés dans les tiroirs du meuble sous la télé."
        ],
        images: [
          { src: "images/gordes/manuel/img-9152-moyenne.jpeg", alt: "Jeux de société", caption: "Jeux de cartes et Uno" },
          { src: "images/gordes/manuel/img-9151-moyenne.jpeg", alt: "Raquettes de ping-pong", caption: "Raquettes de ping-pong" }
        ]
      },
      {
        title: "Buanderie",
        paragraphs: [
          "Deux machines à laver sont disponibles dans la buanderie, au bas de l'allée. Prévoyez une pièce de 2&nbsp;€ pour un cycle de lavage rapide, ou 2&nbsp;€ pour un cycle plus long."
        ],
        images: [
          { src: "images/gordes/manuel/img-4536.jpg", alt: "La buanderie", caption: "La buanderie" }
        ]
      }
    ],

    marquixanes: [
      {
        title: "Sécurité",
        paragraphs: [
          "Le détecteur de fumée et de monoxyde de carbone se trouve sur le palier, devant la grande chambre au 1er étage. Un autre détecteur de fumée est situé dans la petite chambre du 2ème étage.",
          "La trousse de premiers secours se trouve dans le tiroir sous les vasques de la salle de bain. Un extincteur est disponible près de la chaudière."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-8602.jpeg", alt: "Détecteur et extincteur", caption: "Près de la chaudière" }
        ]
      },
      {
        title: "Stationnement",
        paragraphs: [
          "Le stationnement est gratuit devant la maison. Il y a toujours des places, et les voisins savent que la maison est louée : ils libèrent en général la place devant la maison lorsqu'ils voient qu'elle est ouverte."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-4505.jpg", alt: "Le clocher de Marquixanes", caption: "Le clocher, repère depuis la place" }
        ]
      },
      {
        title: "Fonctionnement de la serrure de la porte d'entrée",
        paragraphs: [
          "La porte d'entrée est équipée d'une poignée et d'une serrure 3 points à relevage. Elle s'ouvre et se ferme normalement.",
          "Pour fermer à clef, à l'intérieur comme à l'extérieur, et pour pouvoir tourner la clef dans la serrure, il faut pousser la poignée vers le haut, quasiment à la verticale."
        ],
        images: [
          { src: "images/marquixanes/manuel/capture-decran-serrure.png", alt: "La serrure de la porte d'entrée", caption: "La poignée à relevage" }
        ]
      },
      {
        title: "Chauffage",
        paragraphs: [
          "Si le voyant rouge « D » sur la chaudière électrique, dans le petit placard du salon, est allumé, la chaudière est en sécurité et ne chauffe plus. Voici comment procéder : assurez-vous que le thermostat de la chaudière est entre 30 et 35°.",
          "Il faut ensuite remettre de l'eau dans le circuit de chauffage et de la pression. Ouvrez la trappe du bas derrière la télé : il y a 4 robinets, 3 sont ouverts, 1 est fermé. Ouvrez le robinet fermé quelques secondes.",
          "La pression va remonter (aiguille du manomètre sur la chaudière). Lorsqu'elle repasse au-dessus de 2, la lumière rouge « D » s'éteint et la chaudière recommence à chauffer. Pensez bien à refermer le robinet et la trappe."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-8918.jpeg", alt: "La chaudière", caption: "La chaudière" },
          { src: "images/marquixanes/manuel/img-8919.jpeg", alt: "Voyant de la chaudière", caption: "Le voyant « D »" },
          { src: "images/marquixanes/manuel/img-8922.jpeg", alt: "Trappe des robinets de chauffage", caption: "La trappe des robinets" },
          { src: "images/marquixanes/manuel/img-8923.jpeg", alt: "Robinet de chauffage", caption: "Le robinet à ouvrir" },
          { src: "images/marquixanes/manuel/img-8920.jpeg", alt: "Manomètre de la chaudière", caption: "Le manomètre" }
        ]
      },
      {
        title: "Eau chaude",
        paragraphs: [
          "Le ballon d'eau chaude chauffe automatiquement durant la nuit. Il est possible qu'à votre arrivée, la maison n'ayant pas été occupée préalablement, le ballon n'ait pas chauffé.",
          "Ouvrez le tableau électrique et mettez le contacteur sur « marche forcée » à 1 : l'eau sera chaude en une heure. Pensez ensuite à remettre le contacteur en position « Auto »."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-8935-grande.jpeg", alt: "Tableau électrique et contacteur eau chaude", caption: "Le contacteur « marche forcée »" }
        ]
      },
      {
        title: "Électricité",
        paragraphs: [
          "En cas de coupure électrique, une torche électrique est disponible dans le tiroir du buffet du salon."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-8930.jpeg", alt: "Torche électrique", caption: "La torche, dans le buffet du salon" }
        ]
      },
      {
        title: "Chromecast",
        paragraphs: [
          "Une clé Google Chromecast est disponible sur la télé (entrée HDMI 4) et permet de diffuser les contenus de vos téléphones ou tablettes. Connectez-vous au wifi de la maison pour caster sur « Chromecast Marquixanes »."
        ],
        images: [
          { src: "images/marquixanes/manuel/e3510722.png", alt: "Clé Google Chromecast", caption: "La clé Chromecast" }
        ]
      },
      {
        title: "Étage",
        paragraphs: [
          "Déchaussez-vous avant de monter dans les étages."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-6595.jpg", alt: "L'escalier de la maison", caption: "L'escalier" }
        ]
      },
      {
        title: "Amazon Echo",
        paragraphs: [
          "Lancez la musique, la radio ou écoutez les contenus de vos téléphones en les jumelant sur l'enceinte située dans le salon."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-330.jpg", alt: "Enceinte Amazon Echo", caption: "L'enceinte du salon" }
        ]
      },
      {
        title: "Télévision, box, Netflix et Prime Vidéo",
        paragraphs: [
          "Dans le salon, vous pouvez regarder la télé via la TNT ou via la box Orange. Choisissez l'entrée TV pour la TNT, ou l'entrée HDMI1 puis allumez la box Orange avec la télécommande pour la télé via la box, Netflix et Amazon Prime Vidéo.",
          "Dans les chambres, la télé n'est reçue que via la TNT."
        ],
        images: [
          { src: "images/marquixanes/manuel/img-8942.jpeg", alt: "Télécommande TV", caption: "Télécommande de la télé" },
          { src: "images/marquixanes/manuel/img-8943.jpeg", alt: "Télécommande Livebox", caption: "Télécommande de la Livebox" }
        ]
      }
    ]
  }
};
