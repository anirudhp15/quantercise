# Quantercise

A comprehensive platform for quantitative finance interview preparation and training.

## Overview

Quantercise is a MERN stack application designed to help users prepare for quantitative finance interviews through practice problems, performance analytics, and personalized feedback.

## Features

- **Authentication System**: Secure login, registration, and profile management
- **Practice Problems**: Curated problems for quant interview preparation
- **Performance Analytics**: Track your progress and identify areas for improvement
- **Interactive UI**: Modern and responsive interface built with React and Tailwind CSS
- **Personalized Feedback**: Get feedback on your solutions and approach

## Tech Stack

- **Frontend**: React, Tailwind CSS, Chakra UI, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT, Firebase
- **Deployment**: Vercel

## Project Structure

```
quantercise/
│
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   └── src/                # Source files
│       ├── components/     # React components
│       │   ├── common/     # Reusable components
│       │   ├── layout/     # Layout components
│       │   ├── auth/       # Authentication components
│       │   ├── dashboard/  # Dashboard components
│       │   ├── problems/   # Problem-related components
│       │   ├── analytics/  # Analytics components
│       │   └── landing/    # Landing page components
│       ├── contexts/       # Context providers
│       ├── hooks/          # Custom React hooks
│       ├── utils/          # Utility functions
│       ├── assets/         # Static assets
│       └── App.js          # Main application component
│
├── server/                 # Backend Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── index.js            # Entry point
│
└── package.json            # Root package.json for project management
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/quantercise.git
   cd quantercise
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   - Create a `.env` file in the root directory
   - Create a `.env` file in the server directory

4. Start the development server
   ```bash
   npm start
   ```

## Development

### Running in Development Mode

```bash
# Run both client and server
npm start

# Run only client
npm run start:client

# Run only server
npm run start:server
```

### Building for Production

```bash
npm run build
```

## Deployment

The application is configured for deployment on Vercel:

- Frontend: Deployed as a static site
- Backend: Deployed as a serverless function

## License

ISC

## Author

Ani Pottammal
