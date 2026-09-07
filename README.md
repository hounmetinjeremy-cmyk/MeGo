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
  schema.sql        # schéma D1
```

Le code hérité d'Enatega (`lib/rider`, `lib/store`) reste namespacé séparément — les deux apps sources divergent trop en comportement pour être fusionnées en un seul code sans casser l'une des deux. Les écrans d'accueil (`lib/*/ui/screen-components/mego/`) sont neufs, écrits pour MeGo, et remplacent les écrans Enatega d'origine (encore présents mais non branchés).

## Backend (MeGo, propre)

Cloudflare Workers + D1 (SQLite) + R2 (fichiers), tout dans le même Worker qui sert aussi l'app :

- **Auth** : `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` — JWT (HS256)
- **Produits** (vendeur) : `GET/POST /api/store/products`, `PATCH/DELETE /api/store/products/:id`
- **Commandes** : `POST /api/orders` (création), `GET /api/store/orders`, `PATCH /api/store/orders/:id/status`
- **Livreur** : `GET /api/rider/orders/available`, `GET /api/rider/orders/mine`, `PATCH .../accept`, `PATCH .../status`
- **GPS** : `POST /api/rider/location`, `GET /api/orders/:id/location`
- **Fichiers** : `POST /api/store/upload`, `POST /api/rider/upload`, `GET /api/uploads/:key` (R2)

### Config Cloudflare requise (une fois)

Variables **Runtime** (Settings → Variables and Secrets, type Secret) :
- `JWT_SECRET` — chaîne aléatoire (`openssl rand -hex 32`)

Build & deploy (déjà configurés dans `wrangler.jsonc` / les settings du projet) :
- Build command : `npx expo export -p web`
- Deploy command : `npx wrangler deploy`

### Développement local du backend

```bash
npx expo export -p web
npx wrangler d1 execute mego-db --local --file=worker/schema.sql
echo "JWT_SECRET=dev-secret" > .dev.vars
npx wrangler dev --local
```

Sert l'app ET l'API sur `http://localhost:8787` (ou le port choisi), en local, sans toucher à la base de production.

## Ce qui n'est PAS encore branché sur le backend MeGo

Ces écrans existent toujours (hérités d'Enatega) mais ne fonctionnent pas — pas de backend derrière : gains/wallet, chat, gestion bancaire, changement de langue, upload de photo produit (l'API existe côté Worker, pas encore reliée à l'écran d'ajout de produit).

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
