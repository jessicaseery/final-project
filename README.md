# GameShare
Concordia Bootcamp - Final Project
As a final project for my Concordia web developpment degree, I have chosen to create a website that would contain a large amount of video games along with images of the game, descriptions, information on the date of release and developpers, and much more! 

## Backend
- created handlers that would POST, GET, PATCH, and DELETE games, functions 100% through insomnia
- set up server and API endpoints for the games
- created Sign in and Sign up handlers that both POST. The sign up creates a new user and stores the information to mongo, and the Sign in verifies that the user input matches 100% with the information we have on our 
- set up API endpoints and handlers for users
- modified the backend (server and handlers) to handle uploaded files
- modified the handlers to support encrypted passwords
- added handlers/endpoints to delete an account to support CRUD techniques
- implemented a favorites system that adds the game id to an array of favorite games on the user's information on mongo.
- created a comment system that adds content to an array of comments per game and stores the name and userid of the user that creates the comment.

## Frontend
- set up the App, Header, Home, and GameInfo components
- rendered all games through feth('/games') to be displayed on the Home page
- Added the font 'Khand' and animated slightly the company name in the top left (purple bar varies in color).
- cleared default styling through GlobalStyles
- created a GameInfo component set to render each game with the same layout, maintaining the same creative style for each game no matter the content.
- created a searchbar component that renders a list of games based on the input of the user! If the user selects a specific item in the list of recommendations, they will automatically be redirected to the GameInfo page of that specific game they selected.
- created a profile component that renders the full name, username and profile image of the logged in user.
- modified the log out to automatically navigate to the home page to avoid encountering issues with missing logged in user value.
- modified the sign up component to have a designated area for uploading a profile picture!
- created a comment system that only appears if the user is signed in. The user can leave a comment. Comments contain the name of the user and redirects other user's to their profile page.
- created a favourite game system where only logged in users can add games to their favourite collection. These favorite games are then stored in the backend on the user's mongo and are later rendered on the user's profile page.