
# Add emoji search
react: ":react:",
woah: "",
hey: "",
lol: "",
like: ":heart:",
congratulations: "",



# Real-Time Chat Application

![Chat Application Screenshot](./screenshot.png)

A real-time chat application built with Node.js and Socket.io. It allows users to join chat rooms, send messages, set and recall custom values, perform basic calculations, and use emoji replacements.

## Features

- **Real-Time Messaging:** Instantly chat with other users in real-time.
- **Custom Values:** Set and recall custom values using the `/rem` command.
- **Calculator:** Perform basic calculations within the chat using the `/calc` command.
- **Emoji Replacements:** Automatically replace emoji codes with emoji icons in messages.
- **Usernames:** Customize your username when joining chat rooms.

## Usage

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/chat-app.git
   ```

2. Install dependencies:

   ```bash
   cd chat-app
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open the chat application in your browser at `http://localhost:3000`.

## Commands

- **Set Custom Value:**

   ```
   /rem <name> <value>
   ```

- **Recall Custom Value:**

   ```
   /rem <name>
   ```

- **Perform Calculation:**

   ```
   /calc <expression>
   ```

- **Emoji Replacements:**

   Use emoji codes like `:)`, `:D`, etc., to automatically replace with emoji icons.


## Technologies Used

- Node.js
- Socket.io
- HTML/CSS
- JavaScript
