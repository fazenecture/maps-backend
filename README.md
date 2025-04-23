# 🌍 Maps Backend

Maps Backend is an geospatial mapping backend that supports place data management, geolocation-based queries, and optimized routing functionalities. Designed for scalability, this backend can serve millions of users with efficient spatial queries and extensible services.

---

## 🏗️ Project Structure

```
.
├── config                 # Database and service configuration files
│   └── mongoose.ts        # MongoDB connection config
├── controller             # Route controller logic
│   └── controller.ts
├── db                     # Database layer and access utilities
│   └── db.ts
├── enums                  # Constants and enums (if used)
├── helper                 # Utility functions
│   ├── geohash.helper.ts  # Geohash-based logic for Redis optimization
│   └── helper.ts          # Core spatial logic including KD Tree + TSP
├── index.ts               # Entry point of the application
├── middleware             # Request validation and middlewares
│   └── validator.ts
├── model                  # Mongoose schema models
│   └── place.model.ts
├── routes                 # API routes definition
│   └── index.routes.ts
├── service                # Business logic layer
│   └── service.ts
├── types                  # Global types and interfaces
│   └── types.d.ts
└── utils                  # Error handling and utility logic
    ├── custom.error.handler.ts
    └── error.handler.ts
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/fazenecture/maps-backend.git
cd maps-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file:

```
MONGO_URI=cluster.url
```

### 4. Run the Project

```bash
npm run dev
```

---

## 🚀 API Endpoints

### 📍 Insert Place

`POST /place`

```json
{
  "name": "India Gate",
  "description": "Historical monument",
  "lat": 28.6129,
  "long": 77.2295
}
```

### 📍 Fetch Nearby Places

`GET /nearby?lat=28.61&long=77.23&radius=5000`

Returns GeoJSON FeatureCollection of points within the radius.

### 📍 Route Between Points (with TSP Optimization)

`POST /route`

```json
{
  "coords": [
    { "lat": 28.698752, "long": 77.430825 },
    { "lat": 28.7, "long": 77.435 },
    { "lat": 28.696175, "long": 77.441863 }
  ]
}
```

Returns optimized path using:

- KD Tree for NN search
- Greedy TSP
- 2-Opt heuristic for improvements

---

## 📦 Logic and Implementation Details

### KD-Tree for Nearest Neighbor Search

Custom-built minimal KD Tree with O(log n) query complexity to support nearest neighbor lookups for route planning.

### Travelling Salesman Problem (TSP)

- Nearest-neighbor greedy algorithm.
- Enhanced with 2-Opt optimization.

### MongoDB Geospatial Queries

Using `$geoNear`, `$geoWithin`, and bounding box queries with Mongoose's 2dsphere indexing.

---

## ⚡ Future Implementation

### 🔁 Redis Caching (GeoHash)

Use Redis to cache nearby place results based on GeoHash (precision ~38m):

- GeoHash 8-char index for Redis key
- Fetch adjacent hash zones
- Fast cache lookup (~1µs) before querying Mongo

### 📦 Redis Sample Schema

```ts
redis.set("geo:t4v6h7k9", JSON.stringify(nearbyPoints));
```

### 🐳 Docker + DevOps

**Docker Support (Planned)**:

- `Dockerfile` for app container
- `docker-compose.yml` to spin up Mongo + Redis + API

**Scalable Deployment Options:**

- AWS ECS + Fargate / GCP Cloud Run
- Geo-DNS for routing traffic globally

---

## 🔐 Security Strategy

- Parameterized inputs and Joi validation to avoid injection
- Helmet + CORS configuration
- Rate-limiting for endpoints
- JWT/OAuth2 support pluggable
- TLS Termination at Load Balancer

---

## 📈 Monitoring and Observability

- Logging with Winston (future)
- Mongo/Mongoose metrics
- Redis stats (via Redis Monitor)
- Endpoint access logs (middleware)

---

## 🧪 Testing

- Unit tests for helpers
- E2E tests using Supertest
- Mocked Mongo for route simulations
