import { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  //CREATE
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      await Promise.all([task.save(), req.project.save()]);
      res.send("Tarea creada correctamemnte");
    } catch (error) {
      console.log(error);
    }
  };

  //GET
  static getAllTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {           
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  //UPDTAE
  static updateTaskById = async (req: Request, res: Response) => {
    try {         
      req.task.name = req.body.name || req.task.name;
      req.task.description = req.body.description || req.task.description;
      await req.task.save();
      res.send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateTaskStatusById = async (req: Request, res: Response) => {
    try {     
      const { status } = req.body;
      req.task.status = status;
      await req.task.save();
      res.send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  //DELETE
  static deleteTaskById = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    try {           
      req.project.tasks = req.project.tasks.filter(
        (id) => id.toString() !== taskId
      );
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.send("Tarea eliminada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
