import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../controllers/todoController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTodos);
router.post("/", createTodo);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
