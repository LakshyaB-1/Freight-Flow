# Freight Flow CRM 🚚

Freight Flow CRM is a modern logistics management platform designed for freight forwarders and logistics teams to manage shipments, track milestones, and automate communication with clients.

The system provides a centralized dashboard for tracking shipments, monitoring operational progress, and generating AI-powered logistics insights.

---

## 🚀 Features

### 📦 Shipment Management

* Create and manage shipment records
* Track consignee, shipper, commodity, container numbers, and BE numbers
* View shipment status (Pending, In Progress, Completed)

### 📍 Milestone Tracking

* Track shipment milestones
* Monitor shipment progress across different stages
* Maintain operational notes and updates

### 🤖 AI Logistics Assistant

Powered by OpenAI, the AI assistant can:

* Summarize shipment statuses
* Generate logistics insights
* Draft professional customer emails
* Suggest operational next steps
* Highlight delayed shipments

### 🔐 Secure Authentication

* User authentication via Supabase
* Role-based access to shipment data
* Secure API endpoints

### 📊 Dashboard Analytics

* Shipment statistics
* Pending vs completed shipment insights
* Operational overview for logistics teams

---

## 🛠 Tech Stack

**Frontend**

* React
* TypeScript
* Tailwind CSS
* Vite

**Backend**

* Supabase
* Supabase Edge Functions

**AI Integration**

* OpenAI API (GPT)

**Authentication**

* Supabase Auth

---

## 📁 Project Structure

```
freight-flow-crm
│
├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── integrations
│   └── lib
│
├── supabase
│   └── functions
│       └── ai-assistant
│           └── index.ts
│
├── public
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR-USERNAME/freight-flow-crm.git
cd freight-flow-crm
```

---

### 2️⃣ Install dependencies

```
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env` file in the root folder:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

---

### 4️⃣ Run the project locally

```
npm run dev
```

Open:

```
http://localhost:5173
```

---

## ⚡ Supabase Edge Functions

The project uses Supabase Edge Functions for AI features.

Deploy the AI assistant:

```
npx supabase functions deploy ai-assistant
```

---

## 🔑 Environment Variables

| Variable               | Description          |
| ---------------------- | -------------------- |
| VITE_SUPABASE_URL      | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Public Supabase key  |
| OPENAI_API_KEY         | OpenAI API key       |

---

## 🧠 AI Assistant Capabilities

The AI assistant can:

* Analyze shipment data
* Generate shipment summaries
* Provide logistics insights
* Draft customer communication
* Suggest operational actions

---

## 📈 Future Improvements

* Automated shipment delay detection
* Email automation for shipment updates
* Real-time shipment notifications
* Advanced analytics dashboard
* Multi-user collaboration
* Mobile application

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Lakshya Bhatt**

Built as a logistics technology project to simplify freight forwarding operations.

---
