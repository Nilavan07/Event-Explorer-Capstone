const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const User = require("../models/User");

const router = express.Router();

// Health check
// GET /api/users - Get all users
router.get("/index", async (req, res) => {
  try {
    const users = await User.find(); // You can apply .select() to limit fields if needed
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Add to favorites
router.post("/:userId/favorites", async (req, res) => {
  const { userId } = req.params;
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites.includes(eventId)) {
      user.favorites.push(eventId);
      await user.save();
    }

    res.status(200).json({
      message: "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from favorites
router.delete("/:userId/favorites/:eventId", async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter((id) => id !== eventId);
    await user.save();

    res.status(200).json({
      message: "Removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// DELETE /api/users/:userId - Delete user by ID
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
