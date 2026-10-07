import { authenticationMiddleware } from "@/ui/global/middleware/authMiddleware";
import { Router } from "express";
import { searchUserController } from "../controller/search-user-controller";


export const userRouter = Router();

userRouter.get('/', [authenticationMiddleware, searchUserController]);