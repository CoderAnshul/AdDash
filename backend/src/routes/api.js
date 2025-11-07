import { Router } from "express";
import { login, register } from "../controllers/login.control.js";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/users.control.js";
import { createSession, deleteSession, getAllSessions, getSessionById, updateSession } from "../controllers/session.control.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.post('/sessions', createSession);
router.get('/sessions', getAllSessions);
router.get('/sessions/:id', getSessionById);
router.put('/sessions/:id', updateSession);
router.delete('/sessions/:id', deleteSession);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;