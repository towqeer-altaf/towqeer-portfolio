const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Import model directly

// POST: Add new message
router.post('/', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: 'Saved' });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// GET: Fetch all messages
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;