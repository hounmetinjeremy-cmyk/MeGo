# MeGo

Plateforme de livraison unifiée : livreur (GPS temps réel, acceptation de courses, chat) et vendeur (catalogue, gestion des commandes) dans une seule application, fusionnée à partir de [enatega-multivendor-rider](https://github.com/enatega/food-delivery-multivendor/tree/main/enatega-multivendor-rider) et [enatega-multivendor-store](https://github.com/enatega/food-delivery-multivendor/tree/main/enatega-multivendor-store) (MIT).

## Structure

```
app/
  index.tsx        # redirige vers /rider, /store ou /login selon la session mémorisée
  login.tsx        # écran de choix de rôle (Livreur / Vendeur)
  rider/           # tout l'univers livreur (GPS, courses, chat, statuts)
  store/           # tout l'univers vendeur (catalogue, commandes)
lib/
  rider/           # logique métier livreur (namespace, ex-lib/ du repo rider)
  store/           # logique métier vendeur (namespace, ex-lib/ du repo store)
  shared/          # code réellement partagé entre les deux rôles
```

Les deux rôles gardent leur logique métier séparée (`lib/rider` / `lib/store`) plutôt que fusionnée en un seul code : les deux apps sources, malgré des noms de fichiers identiques, divergent trop en comportement (mutations GraphQL différentes, hardening de sécurité différent) pour être fusionnées sans casser l'une des deux.

## Backend

**Aucun backend n'est inclus.** Le repo `enatega-multivendor-api` original est propriétaire (licence payante chez Enatega). Deux options :
- Payer la licence backend Enatega
- Reconstruire un backend GraphQL compatible avec le schéma attendu par les apps (visible dans `lib/rider/apollo` et `lib/store/apollo`)

## À faire avant un build de production

- [ ] Remplacer les placeholders `REPLACE_ME` dans `app.json` (bundle ID, projet Sentry, EAS project ID)
- [ ] Remplacer `google-services.json` par un vrai fichier Firebase enregistré sous le bundle ID final
- [ ] Brancher un vrai backend (voir ci-dessus)
- [ ] Tester sur device (Android + iOS) — validé uniquement par typecheck jusqu'ici, pas testé en runtime
- [ ] Revoir les failles de sécurité documentées dans `ENATEGA_STORE_APP_SECURITY_PERFORMANCE_CLEANUP_AUDIT.pdf` (clé Firebase, secrets EAS, etc.)
- [ ] Intégration Telegram Mini App (non commencée)

## Développement

```bash
npm install
npx expo start
```

Typecheck :
```bash
npx tsc --noEmit
```
