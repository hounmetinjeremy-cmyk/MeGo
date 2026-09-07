# MeGo Vendeur (admin-web)

Site web vendeur pour MeGo — gestion des produits (titre, description, prix, photo) et des commandes, avec la vraie interface web d'Enatega (PrimeReact + Formik), reliée au backend MeGo (Cloudflare Workers + D1) au lieu du GraphQL d'origine.

Voir le README principal du dépôt (`../README.md`) pour la configuration Cloudflare et le build combiné avec l'app mobile/web MeGo.

## Développement local

```bash
npm install
npm run dev
```

Sert `http://localhost:3000/admin` (le `basePath` reste actif en dev).

## Build

```bash
npm run build
```

Génère un export statique dans `out/` (voir `next.config.mjs` : `output: "export"`, `basePath: "/admin"`). Le script `npm run build:admin-web` à la racine du dépôt fait ce build puis copie `out/` dans `../public/admin/`.
