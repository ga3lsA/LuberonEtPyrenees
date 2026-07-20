# Luberon & Pyrénées — site refondu

Site statique (HTML/CSS/JS pur, aucune dépendance serveur) reprenant le contenu,
la structure et les photos du site e-monsite d'origine, avec un module de
réservation en plus.

## 1. Avant de mettre en ligne

1. **Récupérer les photos originales.** Elles ne sont pas encore dans ce
   dossier : lancez une fois, sur un ordinateur connecté à Internet :
   ```
   chmod +x download-images.sh
   ./download-images.sh
   ```
   Cela remplit `images/gordes/` et `images/marquixanes/`. Le site fonctionne
   déjà sans cette étape en pointant vers l'ancien site, mais il vaut mieux ne
   plus dépendre de l'hébergement e-monsite une fois que vous l'aurez résilié.

2. **Renseigner votre e-mail de réservation** dans `js/config.js` :
   ```js
   contactEmail: "contact@luberon-et-pyrenees.fr",
   ```
   C'est l'adresse qui recevra les demandes (voir section 3).

3. **Vérifier les tarifs et les disponibilités**, toujours dans
   `js/config.js`, propriété par propriété (`gordes` et `marquixanes`) :
   - `pricing.highSeason` / `pricing.lowSeason` : les deux tarifs affichés.
   - `unavailable` : liste des périodes déjà réservées, au format
     `{ start: "AAAA-MM-JJ", end: "AAAA-MM-JJ" }`. C'est la seule chose à
     mettre à jour manuellement à chaque nouvelle réservation confirmée.

## 2. Structure du site

```
index.html          page d'accueil (les deux maisons)
gordes.html          page maison — Gordes
marquixanes.html      page maison — Marquixanes
contact.html          page de contact
css/style.css         design du site
js/config.js           TOUT le contenu variable : textes, photos, tarifs, disponibilités
js/main.js             menu mobile, galerie photo, lightbox
js/house-page.js       remplit une page maison à partir de config.js
js/booking.js          calendrier de disponibilité + calcul de prix + formulaire
images/                photos (à peupler avec download-images.sh)
```

Pour ajouter/retirer une photo de galerie, ou changer un texte de présentation,
tout se passe dans `js/config.js` — vous n'avez pas besoin de toucher au HTML.

## 3. Le module de réservation, tel qu'il fonctionne aujourd'hui

- Le calendrier grise les dates passées et les périodes listées dans
  `unavailable`.
- Le prix est recalculé automatiquement selon vos règles telles que décrites
  sur l'ancien site : en juillet-août, uniquement à la semaine du samedi au
  samedi (tarif fixe) ; le reste de l'année, au tarif à la nuit avec un
  minimum de 3 nuits.
- Quand le visiteur envoie sa demande, **sa messagerie s'ouvre** avec un
  e-mail pré-rempli (dates, prix estimé, coordonnées) adressé à
  `contactEmail`. Il ne reste qu'à cliquer sur "Envoyer". Aucun serveur,
  aucune base de données, aucun compte à créer : ça fonctionne dès la mise en
  ligne.
- Après confirmation d'une réservation, ajoutez la période correspondante
  dans `unavailable` pour qu'elle disparaisse du calendrier.

### Aller plus loin (facultatif)

Le système "mailto" ci-dessus a une limite : il dépend de la messagerie
installée sur l'appareil du visiteur, et vous mettez à jour les
disponibilités à la main. Si vous voulez un jour passer à l'étape supérieure :

- **Formulaire qui arrive dans une vraie boîte mail sans ouvrir Outlook/Mail** :
  un service comme Formspree ou EmailJS s'intègre en remplaçant simplement la
  fonction `onSubmit` de `js/booking.js` par un appel à leur API — quelques
  lignes de JavaScript, aucune limite technique de mon côté.
- **Synchronisation automatique du calendrier avec Airbnb/Booking (iCal)** :
  possible en récupérant leurs flux iCal côté serveur (cela nécessite un petit
  backend, ce site étant volontairement 100 % statique).
- **Paiement en ligne (acompte à la réservation)** : nécessite Stripe ou
  équivalent, et donc un minimum de logique serveur.

Dites-moi si l'un de ces points vous intéresse, je peux le construire.

## 4. Mettre le site en ligne

Ce site est 100 % statique : il fonctionne sur n'importe quel hébergeur qui
sert des fichiers HTML (OVH, Netlify, Vercel, GitHub Pages, etc.). Il suffit
de transférer l'ensemble de ce dossier tel quel, `index.html` à la racine.
