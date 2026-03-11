# 🚢✈️ Freight Flow CRM

> A purpose-built Customer Relationship Management system for **Freight Link Logistics Systems** — managing sea & air freight operations, client pipelines, and shipment workflows from a single dashboard.

## 📌 Overview

**Freight Flow CRM** is the internal operations platform for [Freight Link Logistics Systems](https://freight-link-logistics-systems.vercel.app/), a sea and air freight forwarding company based in India. The CRM centralizes client management, shipment tracking, quotations, and documentation — replacing scattered spreadsheets and email threads with a single, streamlined interface.

---

## 🚀 Features

- **👥 Client & Lead Management** — Track importers, exporters, and freight agents through the full sales pipeline
- **📦 Shipment Tracking** — Monitor FCL, LCL, and air cargo consignments with real-time status updates
- **📋 Quotations & Bookings** — Create and manage freight quotes, convert to confirmed job orders
- **🧾 Invoicing** — Generate GST-compliant invoices and track payment status
- **📁 Document Management** — Store Bills of Lading, Airway Bills, and customs documents centrally
- **📊 Dashboard & Reports** — Visual KPIs for shipment volume, revenue, and client activity
- **🔔 Alerts & Follow-ups** — Automated reminders for shipment milestones and pending payments

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Component library |
| [Lovable](https://lovable.dev/) | AI-powered development & hosting |

---

## 📁 Project Structure

```
freight-flow-crm/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   └── ui/           # shadcn/ui base components
│   ├── pages/            # Route-level page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚙️ Local Development

### Prerequisites

- **Node.js** `v18+` — [Install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** `v9+`

### Setup

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate into the project
cd <YOUR_PROJECT_NAME>

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080` with hot-reloading enabled.

### Other Commands

```sh
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

---

## ✏️ Ways to Edit This Project

### Option 1 — Lovable (Recommended)

Visit the [Lovable Project Dashboard](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and use the AI prompt interface. All changes are automatically committed to this repository.

### Option 2 — Local IDE

Clone the repo and push changes directly. Any push to `main` is reflected in Lovable automatically.

### Option 3 — GitHub Web Editor

1. Navigate to the file you want to edit on GitHub
2. Click the **pencil icon** (Edit file) in the top right
3. Make your changes and commit

### Option 4 — GitHub Codespaces

1. Go to the repo's main page on GitHub
2. Click **Code** → **Codespaces** → **New codespace**
3. Edit files in the browser-based VS Code environment and commit when done

---

## 🚀 Deployment

This project is deployed and hosted via **Lovable**.

To publish:
1. Open the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click **Share** → **Publish**

### Custom Domain

To connect a custom domain:
1. Go to **Project → Settings → Domains**
2. Click **Connect Domain** and follow the steps

📖 [Custom domain setup guide](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "feat: describe your change"`
3. Push and open a Pull Request: `git push origin feature/your-feature`

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 🏢 About

**Freight Link Logistics Systems** is a freight forwarding company specializing in sea and air cargo from India.

🌐 [freight-link-logistics-systems.vercel.app](https://freight-link-logistics-systems.vercel.app/)

---

## 📄 License

Private — All rights reserved © Freight Link Logistics Systems