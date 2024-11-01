// netlify/functions/submit-form.js
const mongoose = require('mongoose');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    // Define Schema
    const formSchema = new mongoose.Schema({
        name: String,
        phone: String,
        email: String,
        subject: String,
        message: String,
    });

    const Form = mongoose.model('Form', formSchema);

    try {
        const data = JSON.parse(event.body);

        const formData = new Form({
            name: data.name,
            phone: data.phone,
            email: data.email,
            subject: data.subject,
            message: data.message,
        });

        await formData.save();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form data saved successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving form data.' }),
        };
    }
};
