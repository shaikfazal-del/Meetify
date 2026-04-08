# Meetify — Full Stack Video Conferencing App

A full-stack video conferencing web application built with React, Node.js, Socket.io, and MongoDB.

## 🚀 Tech Stack

- **Frontend**: React, Material UI, Socket.io Client, React Router
- **Backend**: Node.js, Express, Socket.io, MongoDB (Mongoose)
- **Deployment**: Render.com

## 🏃 Running Locally

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## ☁️ Deploying to Render

### Option A — Using the Blueprint (Recommended)
1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml` and create both services
5. Set the following env vars manually in the Render dashboard:

**Backend env vars:**
| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB connection string |
| `CLIENT_URL` | Your frontend Render URL (set after frontend deploys) |

**Frontend env vars:**
| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | Your backend Render URL (set after backend deploys) |

### Option B — Manual Setup
See the full guide in the deployment walkthrough.

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── app.js              # Express + Socket.io server
│   │   ├── controllers/
│   │   │   ├── socketManager.js
│   │   │   └── user.controller.js
│   │   ├── models/
│   │   └── routes/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/              # Route-level components
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts (Auth)
│   │   ├── styles/             # CSS Modules
│   │   └── environment.js      # Backend URL config
│   └── package.json
├── render.yaml                 # Render Blueprint config
└── .gitignore
```
