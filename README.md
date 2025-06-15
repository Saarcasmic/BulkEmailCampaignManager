
# ✉️ EchoMail: Bulk Email Campaign Manager

🌐 **[Live Demo »](https://bulk-email-campaign-manager.vercel.app/)**

> Full-stack platform to **Create → Schedule → Track → Analyze** email campaigns with real-time updates & advanced analytics.

---

## 🎥 Video Tutorial

https://github.com/user-attachments/assets/f10e2c70-a1bb-442f-baf3-0224f8743593



---

## 🚀 Features

✨ Built for scale, speed & clarity:

- 🎯 **Campaign Management** — Create, edit, schedule, delete campaigns across timezones.
- 📩 **Bulk & Scheduled Sending** — Send thousands of emails instantly or schedule with SendGrid.
- 📈 **Real-Time Metrics** — Track delivery, opens, clicks, bounces with live updates via Socket.IO.
- 🌍 **Advanced Analytics** — Visualize device types and geolocations with interactive graphs.
- 🧩 **Template Management** — Reuse branded templates for faster creation.
- 🛡️ **Role-Based Access** — Admin/user permissions with JWT-secured endpoints.
- 📋 **Schema-Driven UI** — Dynamic forms & tables via JSON schema.
- 🖼️ **Modern UI** — Responsive & minimal Material UI layout.
- 🔄 **Live Updates** — No refreshes needed. Everything updates in real-time.
- 🪝 **Webhook Tracking** — Hook into SendGrid events (delivered, opened, clicked, etc).

---

## 🖥️ Tech Stack

| Layer       | Stack                                                                 |
|-------------|------------------------------------------------------------------------|
| Frontend    | React (Vite), Material UI, JSONSchema Forms, Recharts, Socket.IO      |
| Backend     | Node.js, Express, MongoDB (Mongoose), SendGrid, node-cron, Socket.IO  |
| Deployment  | Vercel (frontend), Render (backend)                                    |

---

## 🌐 Live Demo

▶️ **Try EchoMail now**: [https://bulk-email-campaign-manager.vercel.app/](https://bulk-email-campaign-manager.vercel.app/)

---

## ⚙️ Getting Started

### 📦 Prerequisites

- Node.js v16+
- MongoDB (Atlas/local)
- SendGrid account

### 🔧 Setup

```bash
git clone https://github.com/yourusername/EchoMail.git
cd EchoMail


#### 🚀 Backend

```bash
cd backend
cp .env.example .env # Add Mongo URI, JWT secret, SendGrid key
npm install
npm run dev
```

#### 🎨 Frontend

```bash
cd ../frontend
cp .env.example .env # Set VITE_API_URL
npm install
npm run dev
```

#### 🧪 Access the App

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FRONTEND_URL=http://localhost:5173
SOCKET_IO_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## ☁️ Deployment

* **Frontend** → Vercel
  ✅ [https://bulk-email-campaign-manager.vercel.app](https://bulk-email-campaign-manager.vercel.app)

* **Backend** → Render / Railway / Your server
  Set all `.env` variables accordingly.

---

## 📚 Functional Modules

### 📤 Campaigns

Create, schedule, track real-time status via Socket.IO.

### 🧠 Analytics

See where and how your campaigns are performing — by country & device type.

### 🪄 Templates

Speed up your work with editable and reusable email templates.

### 🧑‍🤝‍🧑 Users

Admins can onboard users and control access levels.

### 🔐 Auth & Security

Secure every route with JWT, and apply role-based access control.

---

## 🤝 Contributing

Have ideas or improvements?
We welcome PRs and issue suggestions!

```bash
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

Licensed under the [MIT License](LICENSE)

---

## 🙌 Credits

EchoMail is built with love using:

* [React](https://react.dev/)
* [FastAPI](https://fastapi.tiangolo.com/)
* [MongoDB](https://www.mongodb.com/)
* [SendGrid](https://sendgrid.com/)
* [Socket.IO](https://socket.io/)
* [Material UI](https://mui.com/)
* [Recharts](https://recharts.org/)

---

> 🛠 Built by [Your Name](https://linkedin.com/in/yourname) – Passionate about productivity tools, dev infrastructure & intuitive UIs.

```
