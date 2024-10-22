const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json({ goals: goals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Set goal
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  try {
    const goal = await Goal.create({
      text: req.body.text,
      user: req.user.id,
    });
    res.status(200).json({ goal: goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update goal
// @route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      res.status(404);
      throw new Error("Goal not found");
    }
    // Check for user
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      res.status(404);
      throw new Error("Goal not found");
    }
    // Check for user
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }
     
    await goal.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
