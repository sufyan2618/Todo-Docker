import Todo from "../models/todo.model.js";
import { logger } from "../config/logger.js";

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: todos });
    } catch (error) {
        logger.error(`Get todos error: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }
        const todo = await Todo.create({ userId: req.user.id, title: title.trim() });
        res.status(201).json({ success: true, data: todo });
    } catch (error) {
        logger.error(`Create todo error: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const todo = await Todo.findOne({ _id: id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }

        if (title !== undefined) todo.title = title.trim();
        if (completed !== undefined) todo.completed = completed;

        await todo.save();
        res.status(200).json({ success: true, data: todo });
    } catch (error) {
        logger.error(`Update todo error: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }
        res.status(200).json({ success: true, message: "Todo deleted" });
    } catch (error) {
        logger.error(`Delete todo error: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
