# RisNetOptimizer API

This is the backend API service for RisNetOptimizer, providing RESTful endpoints for risk network optimization.

## API Endpoints

### Base URL

```
https://your-railway-deployment-url.railway.app
```

### Health Check

```
GET /api/health
```

Returns the current status of the API service.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-05-04T12:00:00.000Z"
}
```

### Root Endpoint

```
GET /
```

Returns basic information about the API.

**Response:**
```json
{
  "message": "RisNetOptimizer API Server",
  "status": "running",
  "version": "1.0.0",
  "endpoints": ["/api/health"]
}
```

## Client Integration

When integrating with the client application, set the API base URL in your client's environment:

```
VITE_API_URL=https://your-railway-deployment-url.railway.app
```

## Deployment

This API is deployed on Railway. For deployment details, see the [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md).

## Development

To run the API locally:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:5000`.