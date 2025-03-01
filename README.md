# Course Connect

## Overview

Course Connect is a web application designed to help users discover, share, and discuss online courses. The platform enables users to create and join communities based on their interests, participate in discussions, and interact with others through threads and comments. The goal of Course Connect is to enhance course discoverability and community engagement within online learning.

## Features

### 1. User Authentication

- Sign up and log in functionality
- Secure authentication using bcrypt and JWT
- User session management with cookies

### 2. Communities

- Users can create and join communities
- Communities categorized into 5 general categories for better discoverability
- Unique slugs for communities to make sharing easier
- Public and private community access types

### 3. Threads and Discussions

- Users can create threads within communities
- Commenting and replying functionality for discussions
- Upvote and engagement tracking

### 4. Search and Discovery

- Search for courses, threads, and communities
- Filter results based on categories and relevance

### 5. UI/UX Enhancements

- Material UI components for a modern and responsive design
- Iconography to visually differentiate important information

## Tech Stack

### Frontend:

- React.js
- Material UI
- React Router

### Backend:

- Node.js
- Express.js
- Knex.js
- MySQL 8

### Deployment:

- Heroku (Basic Dyno)

### Security & Utilities:

- bcrypt for password hashing
- JWT for authentication
- Helmet for security enhancements
- xss-clean for sanitization
- dotenv for environment variable management

## Installation & Setup

### Prerequisites

- Node.js & npm installed
- MySQL database set up
- Heroku CLI (for deployment)

### Steps to Run Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/course-connect.git
   ```
2. Navigate to the project directory:
   ```sh
   cd course-connect
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following values:
     ```env
     PORT=5000
     DATABASE_URL=mysql://user:password@localhost:3306/course_connect
     JWT_SECRET=your_secret_key
     ```
5. Run database migrations:
   ```sh
   npx knex migrate:latest
   ```
6. Start the development server:
   ```sh
   npm start
   ```

## Deployment

1. Build the project:
   ```sh
   npm run build
   ```
2. Push to Heroku:
   ```sh
   git push heroku main
   ```
3. Set environment variables on Heroku:
   ```sh
   heroku config:set DATABASE_URL=mysql://user:password@your-heroku-db
   heroku config:set JWT_SECRET=your_secret_key
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Communities

- `GET /api/communities` - Fetch all communities
- `POST /api/communities` - Create a new community
- `GET /api/communities/:slug` - Get details of a specific community

### Threads

- `POST /api/threads` - Create a new thread
- `GET /api/threads/:id` - Get thread details
- `POST /api/threads/:id/comment` - Add a comment to a thread

## Future Improvements

- Implement protected community access type
- Introduce AI-based course recommendations
- Enhance search functionality with advanced filters

## Contributors

- **Abhishek Padaya** - Developer & Researcher

## License

This project is licensed under the MIT License.

