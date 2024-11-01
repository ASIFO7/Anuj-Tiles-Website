const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactForm')
    .then(() => {
        console.log('Connection to MongoDB successful');
        app.listen(port, async () => {
            console.log(`Server running at http://localhost:${port}/`);

            // Dynamically import the 'open' module
            const { default: open } = await import('open');
            open(`http://localhost:${port}/contact.html`); // Open the contact.html file
        });
    })
    .catch(err => console.error('Error connecting to MongoDB', err));

// Define Schema
const formSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    subject: String,
    message: String
});

const Form = mongoose.model('Form', formSchema);

// Handle form submission
app.post('/submit-form', async (req, res) => {
    try {
        const formData = new Form({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        });

        await formData.save();
        res.send('Form data saved successfully!');
    } catch (error) {
        res.status(500).send('Error saving form data.');
    }
});
