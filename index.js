const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connection
mongoose
  .connect(
    "mongodb+srv://familyuser:OVeGm9y7hHOTCfbx@familycluster.ayqebsl.mongodb.net/familyComments?appName=familyCluster"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// 🧱 Schema (replaces SQLite table)
const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous",
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

// 🚀 API route to save comment
app.post("/api/comments", async (req, res) => {
  try {
    const { name, comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment is required" });
    }

    const savedComment = await Comment.create({
      name: name || "Anonymous",
      comment: comment.trim(),
    });

    return res.status(201).json({
      message: "Comment saved",
      id: savedComment._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

// 📥 API route to fetch comments
app.get("/api/comments", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ created_at: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
