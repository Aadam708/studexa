# Studexa

Studexa is a full-stack revision platform with:
- Frontend: Next.js (React)
- Backend: Spring Boot (Java)
- Database: PostgreSQL

## Prerequisites

Install these before running the project:
- Node.js (recommended v20+)
- npm
- Java 21
- IMPORTANT: MAKE SURE YOU ARE CONNECTED TO PERSONAL WIFI OR HOTSPOT AS EDUROAM BLOCKS DB REQUESTS TO SUPABASE AS THIS PROJECT HAS NOT BEEN DEPLOYED YET

## Project Structure

- `frontend`: Next.js application
- `backend/studexa`: Spring Boot backend API

## Run The Backend

IMPORTANT: MAKE SURE YOU ARE CONNECTED TO PERSONAL WIFI OR HOTSPOT AS EDUROAM BLOCKS DB REQUESTS TO SUPABASE AS THIS PROJECT HAS NOT BEEN DEPLOYED YET

Open a terminal and run:

```bash
cd backend/studexa
chmod +x mvnw
./mvnw clean install
./mvnw spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

## Run The Frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Marker Quick Start

1. Start backend from `backend/studexa` with `./mvnw spring-boot:run`.
2. Start frontend from `frontend` with `npm run dev`.
3. Open `http://localhost:3000` in a browser.

## Notes

- Start the backend first so frontend API calls succeed.
- Frontend sends requests to `http://localhost:8080`.

## Troubleshooting

If backend fails:

```bash
cd backend/studexa
./mvnw clean install
./mvnw spring-boot:run
```


If frontend fails:

```bash
cd frontend
npm install
npm run dev
```

If API calls fail in browser:
- Confirm backend is running on port 8080.
- Confirm frontend is running on port 3000.
