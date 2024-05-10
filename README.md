# Columbia Puzzle Website

This project is a web application for the Columbia Puzzle game, featuring both frontend and backend components.

## Prerequisites

Before running the website, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Firebase project credentials (for backend)

## Installation

1. Clone this repository to your local machine:

```bash
git clone <repository_url>
```
2. Navigate to the project directory:

```bash
cd columbia-puzzle
```
3. Install dependencies for both frontend and backend:
```bash
cd frontend && npm install
cd ../backend && npm install
```

## Configuration

### Backend

1. Set up Firebase:
I have set up firebase project that has its json file in the repository here, but if you wish to go an extra mile and make your own, feel free to do so! Here is how you can do that:
    - Create a Firebase project and obtain the Firebase Admin SDK JSON file (`columbia-quest-firebase-adminsdk-4u6oy-590b84e44c.json`).
    - Place the JSON file in the `backend` directory.
    - Ensure the `.env` file contains the necessary Firebase configurations.

3. Configure OpenAI:
    - Update `openaiConfig.js` with your OpenAI API key.

### Frontend

1. Update Firebase configuration:
    - Update `firebaseConfig.js` in the `services` directory with your Firebase project configuration.

## Starting the Website

### Backend

1. Navigate to the `backend` directory:
```bash
cd backend
```

2. Start the backend server:

```bash
npm start
```

### Frontend

1. Navigate to the `frontend` directory:

```bash
cd ../frontend
```

2. Start the frontend server:

```bash
npm start
```

3. Open your browser and navigate to http://localhost:3000 to view the website.

## Additional Information

- The backend server runs on port 5000 by default.
- Ensure both frontend and backend servers are running simultaneously for full functionality.





