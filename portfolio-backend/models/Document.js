const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Certification', 'ID', 'Resume', 'Other'], 
    required: true 
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);