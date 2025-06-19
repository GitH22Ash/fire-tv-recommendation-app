Fire TV with Hybrid Recommendation System

![Fire TV Clone Screenshot](./assets/Authentication.jpg)
![Fire TV Clone Screenshot](./assets/Home.jpg)
![Fire TV Clone Screenshot](./assets/Find.jpg)
![Fire TV Clone Screenshot](./assets/Hots.jpg)
![Fire TV Clone Screenshot](./assets/Netflix.jpg)
![Fire TV Clone Screenshot](./assets/Recently_Watched.jpg)
![Fire TV Clone Screenshot](./assets/Recommended_For_You.jpg)
![Fire TV Clone Screenshot](./assets/Settings_and_History.jpg)

This is a full-stack web application that replicates the user interface and core functionality of a modern streaming service like Amazon Fire TV. It features a dynamic UI built with React and a powerful backend recommendation engine built with Python, Flask, and the Surprise library, all powered by a custom movie dataset.
Features

    Dynamic Frontend: A responsive and interactive UI built with React and Vite.

    Modern Styling: Styled with Tailwind CSS for a clean, modern look.

    Multiple Pages: Includes separate, fully functional pages for Home, Find, Hots (a TikTok-style vertical feed with CSS Snap), and individual OTT platforms.

    Hybrid Recommendation Engine:

        Content-Based Filtering: Recommends movies similar to a specific movie a user has watched.

        Collaborative Filtering (SVD): Recommends movies based on the tastes of similar users by analyzing their watch histories.

    Python Backend: A Flask server that serves the recommendation model via a REST API.

    Asynchronous Data Loading: The application is powered by a local CSV movie dataset, which is loaded asynchronously using PapaParse.

    User Interaction: Simulates user watch history for generating recommendations.

Tech Stack

    Frontend: React, Vite, Tailwind CSS, Axios

    Backend: Python, Flask, Flask-CORS

    Recommendation Model: Pandas, Scikit-learn, Surprise (SVD)

    Data Parsing: PapaParse

    Database (Simulated): Firebase Firestore for user history tracking.

Setup and Installation

Follow these steps to get the project running on your local machine.
Prerequisites

    Node.js (which includes npm)

    Python and pip

1. Clone the Repository

First, clone this repository to your local machine.

git clone https://github.com/GitH22Ash/fire-tv-recommendation-app.git
cd fire-tv-recommendation-app

2. Frontend Setup

In a terminal, navigate to the project's root directory and install the necessary Node.js packages.

npm install

3. Backend Setup

In a separate terminal, navigate into the backend folder and set up the Python virtual environment.

# Navigate into the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (Command Prompt/PowerShell):
venv\Scripts\activate
# On Windows (Git Bash):
source venv/Scripts/activate
# On macOS/Linux:
source venv/bin/activate

# Install the required Python packages from the requirements file
pip install -r requirements.txt

4. Firebase Setup & API Keys

This project uses Google Firebase to simulate storing user watch history and to handle user authentication. To run the project, you will need to create your own free Firebase project to get the necessary API keys.

    Create a Firebase Project

        Go to the Firebase Console and sign in with your Google account.

        Click on "Add project" or "Create a project".

        Give your project a name (e.g., my-fire-tv-clone) and follow the on-screen steps to create it. You can disable Google Analytics for this project if you wish.

    Create a Web App

        Once your project is created, you will be taken to the project dashboard. Click on the Web icon (</>) to register a new web app.

        Give your app a nickname (e.g., "Fire TV Frontend") and click "Register app".

        After registering, Firebase will display a firebaseConfig object. This object contains your unique API keys. Keep this page open or copy the object to a temporary text file.

    Enable Required Services

        Authentication: From the left-hand menu, go to Build > Authentication, click "Get started", and enable the "Email/Password" and "Anonymous" providers.

        Firestore Database: From the left-hand menu, go to Build > Firestore Database, click "Create database", and choose to start in test mode. Select a location and click "Enable".

    Create the .env.local File

        In the root directory of your project (the same level as package.json), create a new file named exactly .env.local.

        Copy the following template and paste it into your new file.

        Replace the placeholder values ("YOUR_KEY_HERE") with the actual keys from your firebaseConfig object.

    VITE_API_KEY="YOUR_API_KEY"
    VITE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    VITE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    VITE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    VITE_APP_ID="YOUR_APP_ID"

5. Data and Model Setup

The recommendation engine requires several data files. This repository does not include the data files themselves. Sample data files are provided, but you can replace them with your own or generate them as needed.

    Movie Dataset: Place your primary movie dataset CSV file inside the public/ folder and ensure it is named my_movies.csv.

    Model Files: Place your trained model files (database.pkl, model.pkl, ratings.pkl) inside the backend/ folder.


Running the Application

To run the application, you need to have both the frontend and backend servers running at the same time in separate terminals.

    Start the Backend Server:

        In your backend terminal (the one with (venv) active and inside the backend folder), run:

        python app.py

        The server should start on http://127.0.0.1:5000.

    Start the Frontend Server:

        In your frontend terminal (in the project's root directory), run:

        npm run dev

        The application will be available at http://localhost:5173.

Open your browser to http://localhost:5173 to see the application in action!