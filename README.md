# MeGo

Plateforme de livraison unifiée : livreur (GPS temps réel, acceptation de courses) et vendeur (catalogue, gestion des commandes) dans une seule application web + mobile (Expo), avec son propre backend sur Cloudflare (Workers + D1 + R2).

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
```

Le code hérité d'Enatega (`lib/rider`, `lib/store`) reste namespacé séparément — les deux apps sources divergent trop en comportement pour être fusionnées en un seul code sans casser l'une des deux. Les écrans d'accueil (`lib/*/ui/screen-components/mego/`) sont neufs, écrits pour MeGo, et remplacent les écrans Enatega d'origine (encore présents mais non branchés).

## Backend (MeGo, propre)

Cloudflare Workers + D1 (SQLite) + R2 (fichiers), tout dans le même Worker qui sert aussi l'app :

- **Auth** : `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` — JWT (HS256)
- **Produits** (vendeur) : `GET/POST /api/store/products`, `PATCH/DELETE /api/store/products/:id`
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

Build & deploy (déjà configurés dans `wrangler.jsonc` / les settings du projet) :
- Build command : `npx expo export -p web`
- Deploy command : `npx wrangler deploy`

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

## Ce qui n'est PAS encore branché sur le backend MeGo

Ces écrans existent toujours (hérités d'Enatega) mais ne fonctionnent pas — pas de backend derrière : gains/wallet, chat, gestion bancaire, changement de langue, upload de photo produit (l'API existe côté Worker, pas encore reliée à l'écran d'ajout de produit).

**App client (commande)** : le backend est prêt (parcourir les boutiques/le menu, passer commande en COD ou FedaPay, suivre une commande), mais les écrans client (`app/client/...` : liste des boutiques → menu → panier → paiement → suivi) restent à construire, sur le modèle du parcours Enatega (Main → Restaurant → Cart → Checkout → OrderDetail).

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
