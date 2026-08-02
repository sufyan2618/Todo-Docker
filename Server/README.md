# Server Backend

Production-ready Node.js + Express backend with JWT authentication.

## Features

- JWT Authentication with HTTP-only cookies
- Redis-backed rate limiting
- Winston + Morgan logging with daily rotation
- Swagger API documentation
- Security features (account blocking, rate limiting)
- MongoDB with Mongoose

## Quick Start

### Install Dependencies
```bash
yarn install
# or
npm install
```

### Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Run Development Server
```bash
yarn dev
# Server starts at http://localhost:5000
```

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn start` - Start production server

## API Documentation

Once running, visit: http://localhost:5000/api/docs

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── lib/           # Database & Redis connections
├── middlewares/   # Custom middlewares
├── models/        # Mongoose models
├── routers/       # Express routes
├── util/          # Utilities & validation
├── app.js         # Express app
└── server.js      # Entry point
```

## Environment Variables

See `.env.example` for required environment variables.

## Dependencies

Key packages:
- Express 5.x
- MongoDB/Mongoose
- Redis/IORedis
- JWT
- Winston/Morgan
- Swagger
- Bcrypt
- Joi

## License

ISC
