# 🚀 MarketFlow

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![React Router v7](https://img.shields.io/badge/React%20Router%20v7-Framework-CC342D?style=for-the-badge&logo=reactrouter)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

---

> ⚡ Plateforme e-commerce multi-vendeurs moderne avec architecture **type-safe**, logique découplée et gestion des rôles utilisateurs (Admin, Vendeurs, Clients).

---

## ✨ Aperçu & Fonctionnalités par Rôle

**MarketFlow** est une application fullstack optimisée pour trois types d'utilisateurs distincts :

### 👤 Acheteurs / Clients
* **Achat & Panier :** Système de commande complet (`CartManagerView`), gestion de panier et simulation de paiement (`PayOrderModal`).
* **Articles & Avis :** Consultation de fiches articles détaillées (`ArticleView`), système de favoris (Likes) et dépôt d'avis avec note par étoiles (`ReviewForm`).
* **Suivi :** Suivi de l'état des commandes passées et notifications en temps réel.

### 🏪 Vendeurs / Gestionnaires
* **Dashboard Performance :** Analyse visuelle des ventes, suivi de la logistique et gestion fine de l'état des commandes (`OrdersTable`).
* **Gestion du Catalogue :** CRUD complet sur les produits (`ProductForm`) avec configuration d'attributs personnalisés, sélecteur de catégories et galerie d'images.
* **Stocks :** Gestion automatisée et alertes de rupture.

### 🛡️ Administrateurs (Espace Admin)
* **Gestion des Comptes & Rôles :** Interface dédiée pour auditer les utilisateurs inscrits et modifier/attribuer les badges de rôles (`RoleBadge`, `UserList`).
* **Modération globale :** Contrôle total des catégories de la plateforme.

---

## 🧰 Stack technique

| Technologie     | Rôle / Utilisation |
| --------------- | ------- |
| **React 18** | Construction des vues et interfaces utilisateurs réutilisables |
| **React Router v7** | Framework global, Routing natif, Loaders et Actions serveurs |
| **TypeScript** | Typage statique et sécurité de bout en bout des données |
| **Vite** | Outillage de build ultra-rapide |
| **Supabase** | Authentification, Base de données Postgres et gestion du stockage (Images) |
| **Tailwind CSS** | Design d'interface fluide et responsive (avec DaisyUI) |

---

## 🏗️ Architecture du projet (`/app`)

L'application respecte la nouvelle structure recommandée par **React Router v7**, séparant nettement l'UI côté client de la logique exécutée côté serveur :

* 📁 `components/` → Composants graphiques découpés par domaine métier (`auth/`, `dashboard/`, `article/`, `orders/`, `profile/`).
* 📁 `routes/` → Organisation physique de l'application basée sur les URL, incluant les fichiers d'UI (`.tsx`) couplés à leur propre logique backend (`*.server.ts`) pour les mutations (Actions) et requêtes (Loaders).
* 📁 `services/` → Couche d'abstraction pour les requêtes complexes à la base de données (`products.server.ts`, `users.server.ts`).
* 📁 `lib/` → Configuration des clients et des outils tiers (`supabase.server.ts`, `storage.server.ts`).
* 📁 `schemas/` → Schémas de validation des données de formulaires (Zod / validation serveur).
* 📁 `types/` → Définitions TypeScript globales (`product.ts`, `order.ts`, `profile.ts`, etc.).

---

## 🚀 Installation & Configuration

### 1. Cloner le projet

```bash
git clone [https://github.com/](https://github.com/cathiah/MarketFlow.git)<cathiah>/<MarketFlow>.git
cd MarketFlow
npm install
```

### 2. Variables d'environnement

Créez un fichier .env à la racine du projet et ajoutez vos clés Supabase :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_publique_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

### 3. Base de données (Supabase)

Pour initialiser correctement vos tables, rôles, politiques de sécurité (RLS) et fonctions de notifications, exécutez les scripts présents dans le dossier /supabase sur votre console Supabase :
 1. Déployer E-commerce Schema & User Provisioning.sql (Crée les profils et les rôles).
 2. Déployer Product Likes and Reviews Storage.sql (Gère la notation et les favoris).
 3. Déployer notification_reads.sql (Gère le statut des alertes utilisateur).

---

## 🧪 Commandes de développement

### Lancer en local

```bash
npm run dev
```

### Compiler pour la production

```bash
npm run build
```

---

## Compte Utilisateurs

### Administrateurs

```text
username: admin
email: admin@dev.mg
password: .... (demander par email)
```

### Vendeur

```text
username: christinna
email: christinna@gmail.com
password: .... (demander par email)
```

### Acheteur

```text
username: julianna
email: julianna@gmail.com
password: .... (demander par email)
```

---

## 🐳 Déploiement

L'application est prête à être déployée sur les environnements suivants :
 * **Vercel**(Optimisé pour les fonctions serveurs de React Router v7)
 * **Docker** (Grâce au Dockerfile inclus à la racine)

## 📄 Licence

Ce projet est sous licence MIT.