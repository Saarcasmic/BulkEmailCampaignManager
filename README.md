# EchoMail: Bulk Email Campaign Manager

[Live Demo »](https://bulk-email-campaign-manager.vercel.app/)

EchoMail is a full-stack Bulk Email Campaign Manager designed for teams and businesses to create, schedule, and analyze email campaigns at scale. Built with React, Node.js/Express, MongoDB, and SendGrid, EchoMail offers a modern, real-time, and analytics-driven experience for managing your email outreach.

---

## 🚀 Features

- **Campaign Management**: Create, edit, schedule, and delete bulk email campaigns with support for timezones and advanced scheduling.
- **Bulk & Scheduled Sending**: Send thousands of emails instantly or schedule them for later delivery using SendGrid integration.
- **Real-Time Metrics**: Track campaign progress, delivery, opens, clicks, bounces, and more with live updates via Socket.IO.
- **Advanced Analytics**: Visualize device usage, geographic distribution, and engagement stats with interactive charts and tables.
- **Template Management**: Create, edit, and reuse email templates for consistent branding and faster campaign creation.
- **User & Role Management**: Admins can manage users and assign roles (admin/user) for secure, multi-user access.
- **Schema-Driven Forms & Tables**: Dynamic, JSON-schema powered forms and tables for flexible data entry and display.
- **Authentication & Security**: JWT-based authentication, protected routes, and role-based access control.
- **Modern UI/UX**: Responsive, professional, and minimal design with Material UI and custom enhancements.
- **Real-Time Updates**: Live campaign and analytics updates without page refreshes.
- **Webhook Event Tracking**: Automatic tracking of SendGrid events (delivered, opened, clicked, bounced, etc.) for accurate analytics.

---

## 🖥️ Tech Stack

- **Frontend**: React (Vite), Material UI, react-jsonschema-form, react-table, recharts, Socket.IO client
- **Backend**: Node.js, Express, MongoDB (Mongoose), SendGrid, node-cron, Socket.IO
- **Deployment**: Vercel (frontend), Render (backend)

---

## 🌐 Live Demo

Try EchoMail now: [https://bulk-email-campaign-manager.vercel.app/](https://bulk-email-campaign-manager.vercel.app/)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- SendGrid account & API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/EchoMail.git
cd EchoMail
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env # Fill in your MongoDB URI, JWT secret, SendGrid API key, etc.
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env # Set VITE_API_URL to your backend URL
npm install
npm run dev
```

### 4. Access the App
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT authentication
- `SENDGRID_API_KEY` - Your SendGrid API key
- `FRONTEND_URL` - URL of your frontend (for CORS)
- `SOCKET_IO_ORIGIN` - Allowed origin for Socket.IO

### Frontend (`frontend/.env`)
- `VITE_API_URL` - URL of your backend API

---

## 📦 Deployment

- **Frontend**: Deployed on Vercel — [https://bulk-email-campaign-manager.vercel.app/](https://bulk-email-campaign-manager.vercel.app/)
- **Backend**: Deploy on Render, Heroku, or your preferred Node.js host. Set environment variables accordingly.

---

## 📚 Documentation

- **Campaigns**: Create, schedule, and monitor campaigns. View real-time metrics and analytics.
- **Templates**: Manage reusable email templates. Load templates into new campaigns.
- **Analytics**: Visualize device and geo stats. All analytics update in real-time.
- **Users**: (Admin only) Manage users and roles.
- **Authentication**: Register/login, JWT-based sessions, role-based access.

---

## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT

---

## 🙌 Credits

- Built with [React](https://react.dev/), [Node.js](https://nodejs.org/), [MongoDB](https://www.mongodb.com/), [SendGrid](https://sendgrid.com/), [Material UI](https://mui.com/), and [Vercel](https://vercel.com/). 