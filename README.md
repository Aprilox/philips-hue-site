# 🌈 Contrôle Philips Hue – Next.js 15 App Router

Application web moderne et élégante pour contrôler tes lampes Philips Hue (v2 API / Matter) : changement de couleur XY, luminosité, allumer/éteindre, détection automatique du bridge.

Prête en 30 secondes, sans compte Philips, sans Hue Essentials, sans rien. Juste ton bridge et ton réseau local.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Philips Hue](https://img.shields.io/badge/Philips_Hue-v2_API-purple?style=for-the-badge)

## ✨ Fonctionnalités

- Connexion au bridge en 1 clic (appui sur le bouton du bridge requis)
- Détection et contrôle de toutes les lampes couleur (XY) + blanc
- Sélecteur de couleur précis + slider de luminosité
- Allumer / Éteindre individuel ou tout
- Interface sublime en dark mode avec gradient violet
- Déconnexion sécurisée avec confirmation
- Fonctionne 100% en local (aucune donnée ne sort)
- Support HTTPS auto-signé du bridge (rejectUnauthorized: false géré proprement)

## 🚀 Installation rapide

```bash
git clone https://github.com/Aprilox/philips-hue-site.git
cd philips-hue-site
npm install
npm run dev
```

Ouvre http://localhost:3000 → entre l’IP de ton bridge → appuie sur le bouton physique du bridge → c’est bon, tu contrôles tout !

## 📡 Routes API incluses

```
GET  /api/hue/register?ip=192.168.1.XX     → Crée l'utilisateur et récupère username + clientkey
GET  /api/hue/lights?ip=192.168.1.XX       → Liste toutes les lampes (avec header hue-application-key)
PUT  /api/hue/set-light-color?ip=192.168.1.XX → Change couleur/luminosité/on-off (body JSON)
```

## 🛠️ Fonctionne avec

- Philips Hue Bridge v2 (carré)
- Toutes les ampoules couleur (Hue Color, White & Color, Gradient)
- Matter / Thread (via le bridge)
- Réseau local uniquement (plus sécurisé)

## 📂 Structure

```
philips-hue-site/
├── app/page.tsx               → Page principale avec setup + contrôle
├── components/
│   ├── BridgeSetup.tsx
│   ├── LampControl.tsx
│   └── ConfirmationModal.tsx
├── lib/bridgeUtils.ts         → localStorage bridge info
└── app/api/hue/
    ├── register/route.ts
    ├── lights/route.ts
    └── set-light-color/route.ts
```

## ❤️ Bonus

- Totalement responsive (mobile = parfait)
- Zéro dépendance extérieure inutile
- Code propre, commenté, prêt à être étendu (scènes, groupes, automatisations, etc.)

Créé avec amour par **Aprilox** en 2025 (en mode expérimentation) 
Parce que contrôler ses lampes doit être beau, simple et local.

**Star le repo si t’as kiffé, ça fait plaisir !** ⭐🌟

Maintenant va mettre du violet partout. 🟪✨