# MeGo

Plateforme de livraison unifiée : client (commande), livreur (GPS temps réel, acceptation de courses) et vendeur (catalogue, gestion des commandes) dans une application web + mobile (Expo), plus un vrai site web vendeur (Next.js, `admin-web/`), avec son propre backend sur Cloudflare (Workers + D1 + R2).

Déployé sur : `mego.<compte>.workers.dev` (Cloudflare Workers).

## Structure

```
app/
  index.tsx        # redirige vers /rider, /store ou /login selon la session mémorisée
  login.tsx         # écran de choix de rôle (Livreur / Vendeur)
  rider/            # tout l'univers livreur (GPS, courses, statuts)
  store/            # tout l'univers vendeur (catalogue, commandes)
lib/
  rider/            # logique métier livreur (héritée d'enatega-multivendor-rider, namespace)
  store/            # logique métier vendeur (héritée d'enatega-multivendor-store, namespace)
  shared/
    api-client.ts   # client HTTP vers le backend MeGo (Workers)
    active-role.ts  # rôle mémorisé (rider/store) pour la redirection au démarrage
worker/
  index.ts          # API REST (Cloudflare Worker) : auth, produits, commandes, GPS, uploads
  crypto.ts         # JWT (HS256) + hash de mot de passe (PBKDF2), Web Crypto pur
  fedapay.ts        # Paiement FedaPay : création de transaction + vérification du webhook
  schema.sql        # schéma D1
admin-web/          # Site web vendeur (Next.js, statique) — gestion des produits avec photo,
                     # repris de l'interface réelle d'Enatega (admin/vendor), backend MeGo (REST)
                     # exporté en HTML/JS statique dans public/admin/, servi par le même Worker
```

Le code hérité d'Enatega (`lib/rider`, `lib/store`) reste namespacé séparément — les deux apps sources divergent trop en comportement pour être fusionnées en un seul code sans casser l'une des deux. Les écrans d'accueil (`lib/*/ui/screen-components/mego/`) sont neufs, écrits pour MeGo, et remplacent les écrans Enatega d'origine (encore présents mais non branchés).

## Backend (MeGo, propre)

Cloudflare Workers + D1 (SQLite) + R2 (fichiers), tout dans le même Worker qui sert aussi l'app :

- **Auth** : `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` — JWT (HS256)
- **Produits** (vendeur) : `GET/POST /api/store/products`, `PATCH/DELETE /api/store/products/:id`
- **Catégories** (vendeur) : `GET/POST /api/store/categories`, `PATCH/DELETE /api/store/categories/:id`, `POST /api/store/categories/:id/subcategories`, `DELETE /api/store/subcategories/:id`
- **Variations** (vendeur) : `POST /api/store/products/:id/variations`, `PATCH/DELETE /api/store/variations/:id`
- **Zones de livraison** (admin uniquement) : `GET/POST /api/admin/zones`, `PATCH/DELETE /api/admin/zones/:id` — `coordinates` est un polygone `[lat, lng][]`
- **App client** (public, sans compte) : `GET /api/stores` (boutiques actives), `GET /api/stores/:id/products` (menu d'une boutique), `GET /api/orders/:id` (suivi d'une commande + ses articles)
- **Commandes** : `POST /api/orders` (création, `payment_method: "COD" | "FEDAPAY"`), `GET /api/store/orders`, `PATCH /api/store/orders/:id/status`
- **Paiement (FedaPay)** : `POST /api/orders` avec `payment_method: "FEDAPAY"` crée la transaction FedaPay et renvoie `payment_url` (à ouvrir côté client) ; `POST /api/fedapay/webhook` reçoit la confirmation de FedaPay et met à jour `payment_status` de la commande
- **Livreur** : `GET /api/rider/orders/available`, `GET /api/rider/orders/mine`, `PATCH .../accept`, `PATCH .../status`
- **GPS** : `POST /api/rider/location`, `GET /api/orders/:id/location`
- **Fichiers** : `POST /api/store/upload`, `POST /api/rider/upload`, `GET /api/uploads/:key` (R2)

### Config Cloudflare requise (une fois)

Variables **Runtime** (Settings → Variables and Secrets, type Secret) :
- `JWT_SECRET` — chaîne aléatoire (`openssl rand -hex 32`)
- `FEDAPAY_MODE` — `sandbox` ou `live`
- `FEDAPAY_SECRET_KEY` — clé secrète FedaPay (tableau de bord FedaPay, API Keys)
- `FEDAPAY_WEBHOOK_KEY` — clé de signature du webhook FedaPay (à configurer aussi côté FedaPay : URL du webhook = `https://<ton-worker>.workers.dev/api/fedapay/webhook`)

Build & deploy (à configurer dans les settings du projet Cloudflare) :
- Build command : `npm run build:web` (build `admin-web/` en HTML/JS statique dans `public/admin/`, puis exporte l'app Expo — remplace l'ancien `npx expo export -p web` si ce n'est pas déjà fait)
- Deploy command : `npx wrangler deploy`

Le site vendeur (`admin-web/`) est un projet Next.js à part (autre gestionnaire de paquets, autre framework) : il se construit avec `npm run build:admin-web` (ou automatiquement via `npm run build:web`), qui régénère `public/admin/`. Le HTML/JS généré est commité dans `public/admin/` pour que le build Cloudflare fonctionne même sans mettre à jour la commande de build tout de suite — mais pense à refaire `npm run build:admin-web` après chaque modification de `admin-web/`.

### Développement local du backend

```bash
npx expo export -p web
npx wrangler d1 execute mego-db --local --file=worker/schema.sql
cat > .dev.vars <<EOF
JWT_SECRET=dev-secret
FEDAPAY_MODE=sandbox
FEDAPAY_SECRET_KEY=sk_sandbox_xxx
FEDAPAY_WEBHOOK_KEY=whk_xxx
EOF
npx wrangler dev --local
```

Sert l'app ET l'API sur `http://localhost:8787` (ou le port choisi), en local, sans toucher à la base de production.

### Développement local du site vendeur (admin-web)

```bash
cd admin-web
npm install
npm run dev
```

Sert `http://localhost:3000/admin` en local (le `basePath` reste actif en dev) ; les appels `/api/*` partent vers le même Worker que l'app mobile (relatif en prod, ou `NEXT_PUBLIC_MEGO_API_URL` en dev si le Worker tourne sur un autre port).

## Ce qui n'est PAS encore branché sur le backend MeGo

Ces écrans existent toujours (hérités d'Enatega) mais ne fonctionnent pas — pas de backend derrière : gains/wallet, chat, gestion bancaire, changement de langue.

**Site vendeur (`admin-web/`)** : gère les produits (titre, description, prix, photo, variations tailles/prix), les catégories/sous-catégories, les commandes, et (compte `admin`) les zones de livraison. Le vrai dashboard admin Enatega gère aussi les coupons, bannières, plusieurs membres du staff, taux de commission — aucun de ces concepts n'existe encore dans le schéma D1 de MeGo, donc ils ne sont pas repris (pas de fausse fonctionnalité qui ne ferait rien).

### Compte admin

Un compte `admin` (accès à `/admin/zones`) a été créé directement en base — il n'y a pas d'inscription publique pour ce rôle (un compte admin est sensible, mieux vaut ne pas l'exposer à l'inscription libre). Les identifiants t'ont été donnés en message ; si tu les as perdus, redemande-moi de créer un nouveau compte admin ou de réinitialiser le mot de passe.

### Zones de livraison (carte + filtrage)

Dessinées sur une carte OpenStreetMap (Leaflet + Leaflet.draw), gratuite et sans clé API — contrairement à Enatega qui utilise Google Maps (payant au-delà d'un certain usage). Les zones sont enregistrées (`GET/POST /api/admin/zones`) et **filtrent** : `GET /api/stores?lat=&lng=` ne renvoie que les boutiques dans la même zone que le point donné (l'app client envoie sa position si elle y a accès), et `GET /api/rider/orders/available` ne renvoie que les commandes dans la même zone que la dernière position connue du livreur. Sans position connue, ou si aucune zone ne contient le point, tout reste visible (dégradation gracieuse, jamais un écran vide à cause des zones).

### Variations de produit (tailles/prix)

Un produit peut avoir 0 variation (le prix de base s'applique, comme avant) ou plusieurs (ex: "Petite" 500, "Grande" 900) — gérées dans le site vendeur (dans le formulaire produit, après l'avoir enregistré une première fois) et affichées dans l'app client comme des lignes séparées à ajouter au panier.

### Parcourir en tant que vendeur/livreur

Un bouton "🛍️ Parcourir les boutiques" en haut du tableau de bord vendeur et livreur amène directement sur l'app client (`/client`), pour voir/acheter chez d'autres boutiques sans changer de session. Limite connue : se connecter comme client depuis cet écran remplace le jeton de session vendeur/livreur (un seul jeton actif à la fois) — retourner ensuite sur son propre tableau de bord demandera de se reconnecter.

## À faire avant un build mobile (Android/iOS) de production

- [ ] Remplacer les placeholders `REPLACE_ME` dans `app.json` (bundle ID, projet Sentry, EAS project ID)
- [ ] Remplacer `google-services.json` par un vrai fichier Firebase enregistré sous le bundle ID final
- [ ] Définir `EXPO_PUBLIC_MEGO_API_URL` au build (l'app web utilise une URL relative, le natif a besoin de l'URL complète du Worker déployé)
- [ ] Tester sur device (Android + iOS) — validé uniquement sur web jusqu'ici
- [ ] Revoir les failles de sécurité documentées dans `ENATEGA_STORE_APP_SECURITY_PERFORMANCE_CLEANUP_AUDIT.pdf` (héritées du code Enatega, sans rapport avec le nouveau backend)
- [ ] Intégration Telegram Mini App (non commencée)

## Développement (app)

```bash
npm install
npx expo start
```

Typecheck :
```bash
npx tsc --noEmit
```
