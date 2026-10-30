const express = require('express');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/Certificate');
const Document = require('../models/Document');
const Profile = require('../models/Profile');
const Project = require('../models/Project');

const router = express.Router();
const uploadDirectory = path.join(__dirname, '..', 'uploads');

router.get('/:filename', async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    if (filename !== req.params.filename) return res.sendStatus(404);

    const fileUrl = `/uploads/${filename}`;
    const [isPrivate, isProjectImage, isCertificate, isProfileAsset] = await Promise.all([
      Document.exists({ fileUrl }),
      Project.exists({ imageUrl: fileUrl }),
      Certificate.exists({ fileUrl }),
      Profile.exists({ $or: [{ profileImageUrl: fileUrl }, { resumeUrl: fileUrl }] })
    ]);

    if (isPrivate || !(isProjectImage || isCertificate || isProfileAsset)) return res.sendStatus(404);
    const filePath = path.join(uploadDirectory, filename);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);
    return res.sendFile(filePath);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
