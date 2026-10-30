const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, default: '', trim: true },
  issuedAt: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  credentialUrl: { type: String, default: '', trim: true },
  fileUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
