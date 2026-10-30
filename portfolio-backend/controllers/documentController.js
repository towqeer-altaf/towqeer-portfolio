const Document = require('../models/Document');
const fs = require('fs/promises');
const path = require('path');

// @desc    Fetch list of secure documents
// @route   GET /api/documents
// @access  Private/Admin
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Upload a document/certification
// @route   POST /api/documents
// @access  Private/Admin
exports.uploadDocument = async (req, res) => {
  try {
    const { fileName, category, notes } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file resource.' });
    }

    const fileUrl = `/uploads/private/${req.file.filename}`;
    const newDoc = new Document({ fileName, fileUrl, category, notes });
    const savedDoc = await newDoc.save();
    
    res.status(201).json(savedDoc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a specific document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document asset not found' });

    await doc.deleteOne();
    const filename = path.basename(doc.fileUrl);
    const directory = doc.fileUrl.includes('/private/') ? 'private' : '';
    const filePath = path.join(__dirname, '..', 'uploads', directory, filename);
    await fs.unlink(filePath).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
    res.json({ message: 'Document removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendDocumentFile = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found.' });

    const filename = path.basename(document.fileUrl);
    const directory = document.fileUrl.includes('/private/') ? 'private' : '';
    const filePath = path.join(__dirname, '..', 'uploads', directory, filename);
    res.sendFile(filePath, (error) => {
      if (error && !res.headersSent) res.status(error.statusCode || 404).json({ message: 'Document file not found.' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};