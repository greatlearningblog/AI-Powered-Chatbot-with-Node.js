require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Initialize OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages from the client
  socket.on('chat message', async (msg) => {
    console.log('Message received:', msg);
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }],
      });

      const aiResponse = completion.data.choices[0].message.content;
      // Emit AI response back to the client
      socket.emit('chat message', aiResponse);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      socket.emit('chat message', "Sorry, there was an error processing your request.");
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
