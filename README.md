# Distributed-Chat-System
ITCR - IC6600 - Project

Welcome to the Chat Application Project! This full-stack application provides a seamless chat experience, supporting both real-time messaging and rich media sharing. Built with React for the frontend, Supabase for authentication, database, and storage, and an Express.js server, this app is optimized for secure and efficient communication.

## Overview

The Chat Application is designed to support user-to-user messaging with features like media attachment, chat search, bot integration, and reminders. It’s well-suited for use across various network environments and offers secure, scalable functionality.

## Features

- **User Authentication:** Secure login and registration handled by Supabase.
- **Message Storage & Retrieval:** Efficient storage of messages, attachments, and metadata in Supabase.
- **Media Uploads:** Supports file attachments in chats, stored in Supabase Storage.
- **Bot Integration:** A chat bot responds to specific commands like reminders or weather requests.
- **Reminders:** Users can set timed reminders with custom messages.
- **Search Functionality:** Search for specific messages within a chat.

## Tech Stack

- **Frontend:** React with Vite for fast, modular development.
- **Backend:** Express.js for server-side logic and APIs.
- **Database, Authentication and Storage:** Supabase for real-time data sync, user authentication, and file storage.
- **Styling:** Tailwind CSS for responsive, modern design.

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/GabrielAlfaro07/Distributed-Chat-System.git
   ```

2. **Install Dependencies:**

Navigate to the project directory and install the required dependencies:
   
   ```bash
   npm install
   ```

3. **Configure Supabase:**

Set up a project in Supabase, enable authentication, and create tables for users and messages. Add your credentials to a .env file in the project root:

   ```bash
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start the Express.js Server:**

To start the server for bot commands and reminders:

   ```bash
   node server.js
   ```

5. **Run the Application:**

Start the React development server:

   ```bash
   npm run dev
   ```

**Network Configuration Notes:**

This app supports deployment across various network environments. For different configurations:
- Ensure Supabase URLs and keys are updated in each environment.
- Set up a reverse proxy (e.g., Nginx) if deploying the frontend and backend on the same server.

## Usage Guide

**Chatting and Media Sharing**

Users can log in, select a chat, and begin messaging. File attachments like images or documents can be uploaded directly in the chat.

**Bot Commands**

Special commands are supported, starting with !. For example:
- !clima <city>: Gets weather information for a specified city.
  
For a full list of commands, use !helpme in the chat.

## API Documentation

**Message API**

The backend provides several API endpoints for message handling:
- POST /send-message: Sends a new message with optional file attachment.
- POST /receive-message: Handles bot commands and returns a bot response.

## Contributions and Credits

- **Authors:** Gabriel Alfaro, Víctor Mejías
- **Acknowledgments:** This project uses third-party resources like:
  - Supabase for authentication, database, and file storage.
  - Jikan API for anime recommendations.
  - OpenWeatherMap API for weather updates.

Feel free to contribute by submitting issues or pull requests. Special thanks to all third-party services that made this project possible!
