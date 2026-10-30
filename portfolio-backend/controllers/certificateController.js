const Certificate = require('../models/Certificate');
const fs = require('fs/promises');
const path = require('path');

const removeCertificateFile = async (fileUrl) => {
  if (!fileUrl?.startsWith('/uploads/')) return;
  const filename = path.basename(fileUrl);
  const directory = fileUrl.includes('/private/') ? 'private' : fileUrl.includes('/public/') ? 'public' : '';
  const filePath = path.join(__dirname, '..', 'uploads', directory, filename);
  await fs.unlink(filePath).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
};

exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ issuedAt: -1, createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCertificate = async (req, res) => {
  try {
    const { title, issuer, issuedAt, description, credentialUrl } = req.body;
    const certificate = await Certificate.create({
      title,
      issuer,
      issuedAt,
      description,
      credentialUrl,
      fileUrl: req.file ? `/uploads/public/${req.file.filename}` : ''
    });
    res.status(201).json(certificate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found.' });

    ['title', 'issuer', 'issuedAt', 'description', 'credentialUrl'].forEach((field) => {
      if (req.body[field] !== undefined) certificate[field] = req.body[field];
    });
    const previousFile = certificate.fileUrl;
    if (req.file) certificate.fileUrl = `/uploads/public/${req.file.filename}`;
    const updatedCertificate = await certificate.save();

    if (req.file && previousFile) await removeCertificateFile(previousFile);
    res.json(updatedCertificate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found.' });
    await certificate.deleteOne();
    await removeCertificateFile(certificate.fileUrl);
    res.json({ message: 'Certificate deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
