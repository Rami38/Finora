# Finora — backend

Spring Boot REST API for a personal finance dashboard.

## Status
- [x] Project setup + PostgreSQL config
- [x] User entity + JWT authentication (register/login)
- [ ] Transactions CRUD
- [ ] Dashboard summary endpoint
- [ ] Budgets & goals
- [ ] Investment simulator

## Requirements
- Java 17+
- Maven
- PostgreSQL running locally (or a connection string to one)

## Setup

1. Create a database:
   ```sql
   CREATE DATABASE finora;
   ```

2. Set environment variables (or edit the defaults in `application.properties`):
   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/finora
   export DB_USERNAME=postgres
   export DB_PASSWORD=yourpassword
   export JWT_SECRET=$(openssl rand -base64 32)
   ```

3. Run it:
   ```bash
   ./mvnw spring-boot:run
   ```

The API starts on `http://localhost:8080`.

## Endpoints so far

| Method | Endpoint         | Auth required | Description              |
|--------|------------------|----------------|---------------------------|
| POST   | `/auth/register` | No             | Create an account, returns a JWT |
| POST   | `/auth/login`    | No             | Log in, returns a JWT     |

Example register request:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Yacoub","email":"yacoub@example.com","password":"supersecret"}'
```

Any other endpoint requires the JWT in the header:
```
Authorization: Bearer <token>
```
