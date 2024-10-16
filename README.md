# sports_booking_app

Sport Court Booking
A web application for managing sports court bookings across multiple centers. This application allows users to browse available courts, book slots, and manage their reservations.

Table of Contents
Project Overview
Features
Installation
Usage
API Endpoints
Technologies Used
Contributing
License
Project Overview
Sport Court Booking is designed to streamline the booking and management of sports courts. Users can:

View available sports courts across multiple centers.
Reserve specific time slots.
Manage their bookings and view past reservations.
This application includes backend management for handling multiple centers, managing court resources, and scheduling slots.

Features
User Authentication: Secure sign-in and registration.
Court Booking: Browse available slots and book a preferred time.
Admin Dashboard: For adding new centers, courts, and managing resources.
Booking Management: Users can view, edit, or cancel their bookings.
Search Functionality: Quickly find available slots and courts by location or sport.
Installation
Prerequisites
Node.js (>=14.0.0)
MongoDB (or any database required)
Steps
Clone the repository:

bash
Copy code
git clone <repository-url>
cd Sport_Court_Booking
Install Dependencies:

bash
Copy code
npm install
Set up Environment Variables: Create a .env file in the project root and set the necessary environment variables:

plaintext
Copy code
PORT=5000
DB_URI=<your_mongodb_uri>
Start the Server:

bash
Copy code
npm start
The server will start on http://localhost:5000.

Usage
Start the server:
bash
Copy code
node app.js
Open http://localhost:5000 in your browser to access the application.
API Endpoints
/api/courts: Get a list of all available courts.
/api/booking: Make a booking.
/api/booking/:id: Manage (view, edit, or cancel) a specific booking.
Technologies Used
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT
Contributing
Contributions are welcome! Please open an issue or create a pull request to propose changes.



