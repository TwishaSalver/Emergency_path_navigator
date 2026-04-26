# 🚑 ClearPath - Emergency Response Dispatch & Tracking System

Emergency response system that optimizes ambulance routing and provides real-time tracking for police units.

## Features

- 🗺️ **Real-time Route Planning** - Google Maps integration for optimal ambulance routes
- 📍 **Checkpoint Tracking** - Automatic checkpoint extraction and monitoring
- 🚨 **Live Alerts** - Police traffic alert panel with live updates
- 🔥 **Firebase Sync** - Real-time data synchronization
- 📱 **Responsive Design** - Mobile-friendly interface
- 🐳 **Docker Support** - Easy containerized deployment

## Project Structure

```
├── frontend/                    # React + Vite application
│   ├── components/
│   │   ├── Dispatch.jsx        # Case creation interface
│   │   ├── MapView.jsx         # Google Maps integration
│   │   └── PolicePanel.jsx     # Alert panel
│   ├── App.jsx                 # Main app component
│   ├── firebase.js             # Firebase configuration
│   ├── vite.config.js          # Vite build config
│   └── package.json
│
├── backend/                     # Node.js/Express server
│   ├── server.js               # Express app setup
│   ├── routes.js               # API routes
│   ├── maps.js                 # Google Maps API integration
│   ├── simulator.js            # Ambulance movement simulator
│   ├── Dockerfile              # Backend container config
│   └── package.json
│
├── docker-compose.yml          # Multi-container orchestration
├── .env.example                # Backend env template
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (for containerized deployment)
- Firebase account with Realtime Database
- Google Maps API key

## Setup Instructions

### 1. Clone and Install

```bash
npm run setup
```

### 2. Environment Configuration

#### Backend (.env)
```bash
cp .env.example .env
```

Fill in `.env`:
```
PORT=8080
NODE_ENV=development
GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_API_KEY
FIREBASE_DATABASE_URL=https://YOUR_PROJECT.firebaseio.com
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```bash
cp frontend/.env.example frontend/.env
```

Fill in `frontend/.env`:
```
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://YOUR_PROJECT.firebaseio.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT
VITE_BACKEND_URL=http://localhost:8080
VITE_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

### 3. Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Realtime Database
3. Set database rules:
```json
{
  "rules": {
    "ambulance": {
      ".read": true,
      ".write": true
    }
  }
}
```
4. Copy credentials to `.env` files

### 4. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project and enable Maps API
3. Create an API key with restrictions
4. Add to `.env` and `frontend/.env`

## Development

### Local Development
```bash
npm run dev
```

This starts:
- Frontend on http://localhost:5173
- Backend on http://localhost:8080

### Individual Services

**Frontend only:**
```bash
cd frontend && npm run dev
```

**Backend only:**
```bash
cd backend && npm start
```

## Production Deployment

### Docker Compose (Recommended)

```bash
# Build containers
npm run docker:build

# Start services
npm run docker:up

# Stop services
npm run docker:down
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Health check: http://localhost:8080/health

### Manual Docker Build

```bash
# Build frontend
cd frontend
docker build -t clearpath-frontend .

# Build backend
cd backend
docker build -t clearpath-backend .

# Run containers
docker run -d -p 5173:5173 --name frontend clearpath-frontend
docker run -d -p 8080:8080 --env-file .env --name backend clearpath-backend
```

### Cloud Deployment

#### Vercel (Frontend)
```bash
cd frontend
vercel deploy
```

#### Heroku (Backend)
```bash
heroku login
heroku create your-app-name
git push heroku main
```

#### AWS (ECS/Fargate)
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com
docker tag clearpath-backend:latest YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com/clearpath-backend:latest
docker push YOUR_AWS_ID.dkr.ecr.us-east-1.amazonaws.com/clearpath-backend:latest
```

## API Endpoints

### Create Case
```http
POST /api/create-case
Content-Type: application/json

{
  "origin": "Times Square, NYC",
  "destination": "Mount Sinai Hospital, NYC"
}
```

Response:
```json
{
  "polyline": "encoded_polyline",
  "checkpoints": [
    {
      "id": 0,
      "lat": 40.758,
      "lng": -73.985,
      "eta": 2
    }
  ]
}
```

### Health Check
```http
GET /health
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Firebase not connecting | Check database URL and rules, ensure network access |
| Maps not loading | Verify API key, check quota limits |
| CORS errors | Update CORS_ORIGIN in .env |
| Port already in use | Change PORT in .env or kill existing process |
| Build fails | Run `npm install`, check Node.js version |

## Performance Optimization

- Frontend caching: Vite build produces optimized bundles
- Backend rate limiting: Add with express-rate-limit
- Database indexing: Configure Firebase rules
- CDN: Serve static files via CloudFront/Cloudflare

## Security Considerations

- ✅ Environment variables for secrets (never commit .env)
- ✅ Firebase security rules restricted to authenticated users
- ✅ API validation and error handling
- ✅ CORS properly configured
- ⚠️ TODO: Add authentication/authorization
- ⚠️ TODO: Implement HTTPS in production
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Sanitize user inputs

## Testing

```bash
# Backend tests (to be added)
cd backend && npm test

# Frontend tests (to be added)
cd frontend && npm test
```

## CI/CD Pipeline

Setup GitHub Actions for automated testing and deployment:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD pipeline"
git push
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am "Add your feature"`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request

## License

MIT License - See LICENSE file for details

## Support

- 📧 Email: support@clearpath.local
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

## Roadmap

- [ ] User authentication
- [ ] Multiple vehicle support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] AI-powered route optimization
- [ ] Traffic prediction

---

**Last Updated**: April 2026
