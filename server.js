// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models');

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to database');
});

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  const user = new User({ name, email, age });

  user.save((err, savedUser) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.status(201).send(savedUser);
  });
});

app.put('/users/:id', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.send(user);
    }
  );
});

app.delete('/users/:id', (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send(user);
  });
});

app.get('/users', (req, res) => {
  User.find((err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send(users);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
