import { create } from "zustand";
import axiosInstance from "../lib/config/axios";

const useTodoStore = create((set) => ({
    todos: [],
    isLoading: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,

    fetchTodos: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/todos");
            set({ todos: res.data.data });
        } finally {
            set({ isLoading: false });
        }
    },

    addTodo: async (title) => {
        set({ isAdding: true });
        try {
            const res = await axiosInstance.post("/todos", { title });
            set((state) => ({ todos: [res.data.data, ...state.todos] }));
            return res.data.data;
        } finally {
            set({ isAdding: false });
        }
    },

    updateTodo: async (id, updates) => {
        set({ isUpdating: true });
        try {
            const res = await axiosInstance.patch(`/todos/${id}`, updates);
            set((state) => ({
                todos: state.todos.map((t) => (t._id === id ? res.data.data : t)),
            }));
            return res.data.data;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteTodo: async (id) => {
        set({ isDeleting: true });
        try {
            await axiosInstance.delete(`/todos/${id}`);
            set((state) => ({ todos: state.todos.filter((t) => t._id !== id) }));
        } finally {
            set({ isDeleting: false });
        }
    },
}));

export default useTodoStore;
