const fs = require("fs");
const path = require("path");
const multer = require("multer");

const resumeUploadDirectory = path.join(__dirname, "..", "uploads", "resumes");

fs.mkdirSync(resumeUploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, resumeUploadDirectory);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    callback(null, `${Date.now()}${fileExtension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".pdf", ".doc", ".docx"];

  if (allowedExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  return callback(new Error("Only PDF, DOC, and DOCX resume files are allowed"));
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const profilePictureUploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "profile-pictures"
);

fs.mkdirSync(profilePictureUploadDirectory, { recursive: true });

const profilePictureStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, profilePictureUploadDirectory);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    callback(null, `${Date.now()}${fileExtension}`);
  },
});

const profilePictureFileFilter = (req, file, callback) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  if (allowedExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  return callback(
    new Error("Only JPG, JPEG, PNG, and WEBP profile pictures are allowed")
  );
};

const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: profilePictureFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = { uploadResume, uploadProfilePicture };