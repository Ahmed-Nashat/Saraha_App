# Saraha — Anonymous Messaging Platform

A full-stack anonymous messaging application developed as part of the **Route Node.js Backend Diploma**.

Saraha is designed around the concept of anonymous communication, allowing users to interact through a messaging platform while emphasizing backend security, authentication, API development, and maintainable software architecture.

## Tech Stack

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- Redis
- JSON Web Tokens (JWT)
- bcrypt
- Zod
- Helmet & Express Rate Limit

**Frontend**
- Angular

**Additional Tools & Libraries**
- Google Auth Library
- Nodemailer
- Multer
- Morgan
- PM2
- dotenv

## Project Highlights

### Backend Development

Built around a RESTful API architecture using Express.js and MongoDB, with Mongoose for database modeling and interaction.

### Authentication & Security

The backend uses authentication and security-related technologies including JWT, bcrypt, Helmet, and rate limiting.

The configuration distinguishes between user and admin access and refresh token secrets.

### Data Validation

Zod is included in the backend stack for schema-based validation, helping establish clear input requirements.

### Redis Integration

Redis is included as part of the backend infrastructure.

### Frontend Integration

The repository includes an Angular frontend alongside the Node.js backend.

## Repository Structure

```text
Saraha_App/
├── FE_Angular/        # Angular frontend
├── src/               # Backend source code
├── .env.example       # Environment configuration template
├── .gitignore
├── package.json
└── package-lock.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- Redis
- Required credentials for configured external services

### 1. Clone the Repository

```bash
git clone https://github.com/Ahmed-Nashat/Saraha_App.git
cd Saraha_App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and provide the required configuration values.

The example includes settings for:

- Server port
- MongoDB and Redis connections
- Encryption
- JWT access and refresh tokens
- Google authentication
- Email services
- Upload limits
- Rate limiting
- Allowed origins

Never commit real credentials or secrets to version control.

### 4. Run the Backend

Development:

```bash
npm run dev
```

Production process management:

```bash
npm start
```

The backend uses `src/main.js` as its application entry point.

## Development Focus

This project was developed to strengthen practical backend engineering skills, particularly:

- REST API design
- Authentication and authorization concepts
- Database integration
- Application security
- Backend configuration management
- Full-stack integration
