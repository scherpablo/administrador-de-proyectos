import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task?: ITask;
    }
  }
}

export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate("project")
    if (!task) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ msg: error.message });
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function taskBelongsToProject (req: Request, res: Response, next: NextFunction) {
    if (req.task.project.id.toString() !== req.project.id.toString()) {
        const error = new Error("Esta tarea no pertenece al proyecto");
        return res.status(400).json({ error: error.message });
      }
      next()
}