# 🍬 Sugari – AI-Powered Diabetes Tracking App

Sugari is a modern diabetes self-monitoring app built with **Next.js** and deployed on **Vercel**, designed to make daily tracking simple and intuitive. Users can log meals, glucose levels, and daily habits while benefiting from clean visual insights. The backend uses **Supabase** (PostgreSQL + Auth) for secure data storage and real-time operations.

---

## ✨ Features

- 💉 **Glucose Tracking** – track daily readings with timestamps  
- 📅 **Daily / Weekly Summaries** – review historical patterns  
- 🔐 **Supabase Authentication** – secure user accounts and sessions  
- 🗄️ **PostgreSQL Database** via Supabase  
- ⚡ **Serverless Backend** through Next.js API routes (Vercel)  
- 📈 **Health Insights (extendable)** – future-ready for AI/ML features  

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (React)**  
- TailwindCSS
- Deployed on **Vercel**

### Backend
- **Next.js API Routes** running as **serverless functions on Vercel**  
- Used for processing requests, handling secure operations, and linking with Supabase

### Database
- **Supabase (PostgreSQL)**  
  - Authentication (email/password)
  - Data storage for logs, meals, glucose entries  
  - Real-time capabilities  

### External APIs
- OpenAI API (Glucose reading recognition and insights)


## 📦 Deployment

The app is designed for seamless deployment on **Vercel**:

- Push your repository to GitHub  
- Import the project into Vercel  
- Add environment variables  
- Deploy instantly  

Vercel automatically manages:  
✔ Builds  
✔ Serverless API routes  
✔ Global CDN performance  

---

## 🧱 Architecture Overview

Frontend (Next.js UI)
     ↓
Next.js API Routes (Serverless on Vercel)
     ↓
Supabase Database (PostgreSQL + Auth)

---

## 📝 Roadmap

- 🤖 AI-powered meal recognition  
- 📊 Advanced behavioral insights  
- 🔄 Logging reminders  
- 📱 Wearable or glucose monitor integrations  
- 🌙 Dark mode support  

---

## 📄 License
MIT License — free to use and modify.

---

## 👤 Author

**Shamim Ahamed Shakil**  
M.S. Student, Human–Computer Interaction  
Iowa State University  

