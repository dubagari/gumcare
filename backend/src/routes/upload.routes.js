import express from "express";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", upload.array("images", 7), (req, res) => {
  const imagePaths = req.files.map(
    (file) => `/uploads/${file.filename}`
  );

  res.json({
    images: imagePaths,
  });
});
export default router;