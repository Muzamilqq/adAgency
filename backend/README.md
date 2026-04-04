# AdAgency Pro Backend

A Node.js + Express + PostgreSQL backend API for the AdAgency Pro advertising campaign management platform.

## Features

- **RESTful API** for campaign management (CRUD operations)
- **JWT Authentication** with role-based access control
- **AI Content Microservice** for generating ad copy, social captions, and hashtags
- **Soft Delete** functionality for data preservation
- **Input Validation** with descriptive error messages
- **Rate Limiting** for API protection
- **PostgreSQL Database** with connection pooling

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** PostgreSQL 14+
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** express-validator
- **Logging:** Morgan

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration and connection pool
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── campaignController.js # Campaign CRUD operations
│   └── aiController.js      # AI content generation
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Input validation middleware
├── models/
│   ├── User.js              # User model
│   ├── Campaign.js          # Campaign model
│   └── Client.js            # Client model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── campaigns.js         # Campaign routes
│   └── ai.js                # AI generation routes
├── scripts/
│   ├── migrate.js           # Database migration script
│   └── seed.js              # Database seeding script
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── server.js                # Main application entry point
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other settings.

3. **Create the database:**
   ```bash
   createdb adagency
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

5. **Seed the database with mock data:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `adagency` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | - |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/register` | Register new user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/refresh` | Refresh JWT token | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

### Campaigns

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/campaigns` | List all campaigns | Yes | Any |
| GET | `/api/campaigns/stats` | Get campaign statistics | Yes | Any |
| POST | `/api/campaigns` | Create new campaign | Yes | Admin, Manager |
| GET | `/api/campaigns/:id` | Get single campaign | Yes | Any |
| PUT | `/api/campaigns/:id` | Update campaign | Yes | Admin, Manager |
| DELETE | `/api/campaigns/:id` | Soft delete campaign | Yes | Admin |
| POST | `/api/campaigns/:id/restore` | Restore deleted campaign | Yes | Admin |
| POST | `/api/campaigns/:id/performance` | Add performance data | Yes | Any |
| GET | `/api/campaigns/:id/performance` | Get performance data | Yes | Any |

### AI Content Generation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ai/health` | AI service health check | No |
| POST | `/api/ai/generate/copy` | Generate ad copy | Yes |
| POST | `/api/ai/generate/social` | Generate social captions | Yes |
| POST | `/api/ai/generate/hashtags` | Generate hashtags | Yes |
| POST | `/api/ai/generate/brief` | Generate complete campaign brief | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## Request/Response Examples

### Login

**Request:**
```json
POST /api/auth/login
{
  "email": "admin@adagency.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@adagency.com",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "jwt-token-here"
  }
}
```

### Create Campaign

**Request:**
```json
POST /api/campaigns
Authorization: Bearer <token>
{
  "name": "Summer Sale 2024",
  "clientId": "uuid",
  "status": "active",
  "budget": 50000,
  "startDate": "2024-06-01",
  "endDate": "2024-08-31"
}
```

### Generate Ad Copy

**Request:**
```json
POST /api/ai/generate/copy
Authorization: Bearer <token>
{
  "product": "Premium Skincare Serum",
  "tone": "professional",
  "platform": "meta",
  "wordLimit": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "headline": "Elevate Your Skincare Experience",
    "body": "Discover the premium solution designed for professionals...",
    "cta": "Learn More"
  }
}
```

## Database Schema

### Users Table
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `name` (VARCHAR)
- `role` (ENUM: admin, manager, viewer)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)

### Clients Table
- `id` (UUID, PK)
- `name` (VARCHAR)
- `industry` (VARCHAR)
- `website` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `address` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `deleted_at` (TIMESTAMP, soft delete)

### Campaigns Table
- `id` (UUID, PK)
- `name` (VARCHAR)
- `client_id` (UUID, FK)
- `status` (ENUM: active, paused, completed, draft, scheduled)
- `budget` (DECIMAL)
- `spend` (DECIMAL)
- `impressions` (BIGINT)
- `clicks` (BIGINT)
- `conversions` (BIGINT)
- `roas` (DECIMAL)
- `start_date` (DATE)
- `end_date` (DATE)
- `description` (TEXT)
- `created_by` (UUID, FK)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `deleted_at` (TIMESTAMP, soft delete)

### Campaign Performance Table
- `id` (UUID, PK)
- `campaign_id` (UUID, FK)
- `date` (DATE)
- `impressions` (BIGINT)
- `clicks` (BIGINT)
- `conversions` (BIGINT)
- `spend` (DECIMAL)
- `created_at` (TIMESTAMP)

## Demo Credentials

After running `npm run seed`, you can use these credentials:

| Email | Password | Role |
|-------|----------|------|
| admin@adagency.com | admin123 | Admin |
| manager@adagency.com | admin123 | Manager |
| viewer@adagency.com | admin123 | Viewer |

## Customization

### Adding OpenAI Integration

To enable real AI content generation:

1. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

2. Update the AI controller to use the OpenAI SDK:
   ```javascript
   const OpenAI = require('openai');
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   
   // Use openai.chat.completions.create() in your controller methods
   ```

### Adding New Endpoints

1. Create a new controller in `controllers/`
2. Create a new route file in `routes/`
3. Register the route in `server.js`
4. Add validation rules in `middleware/validation.js` if needed

## Testing

Run tests with:
```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong, random `JWT_SECRET`
3. Configure CORS for your production domain
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name adagency-backend
   ```

## License

MIT
