# Quizopolis

Quizopolis is a full-stack AI-powered quiz application that generates multiple-choice quizzes from any topic. Users can sign up, log in, and play interactive quizzes that are generated in real time using a large language model API.

The app is designed as a simple quiz game with a clean UI, progress tracking, scoring system, and authentication.

---

## Features

### Authentication
- User registration (signup)
- User login with JWT authentication
- Protected quiz access using token stored in localStorage
- Logout functionality

### AI Quiz Generation
- Users enter any topic (e.g. JavaScript, Biology, Anime)
- AI generates:
  - 5 multiple-choice questions
  - Answer key for validation
- Questions are parsed and rendered one at a time

### Quiz System
- One question at a time interface
- Clickable answer choices
- Live scoring system
- Progress tracking bar
- Final score screen with restart option
- Global leaderboard system with totals points and ranking

### UI / UX
- Purple-themed modern interface
- Glassmorphism-style cards
- Responsive layout
- Animated buttons and hover effects

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- TailwindCSS

### Backend

- Supabase

## AI Usage

This app utilizes Groq AI to generate it's quizzes, as opposed to the originally planend Gemini API.

## Supabase Setup

The only table utilized is "users', which was created utilizing SQL:

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## How to Run:

Clone the repository and install the dependencies:

Backend:

cd server
npm install

Frontend:

cd client
npm install


Create a `.env` file in the `server/` directory using the following format:

SUPABASE_URL=your_supabase_url  
SUPABASE_KEY=your_supabase_anon_key  
JWT_SECRET=your_jwt_secret  
GROQ_API_KEY=your_groq_api_key

Then, in the backend, run:

cd server
npm run dev

Then in the frontend:

cd client
npm run dev

And you should be good to go.


