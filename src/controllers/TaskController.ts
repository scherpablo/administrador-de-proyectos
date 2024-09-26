import { Request, Response } from 'express'
import Task from '../models/Task'

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.all([task.save(), req.project.save()])
            res.send("Tarea creada correctamemnte")
        } catch (error) {
            console.log(error)
        }
    }

    static getAllTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate("project")
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId).populate("project")
            if (!task) {
                const error = new Error("Tarea no encontrada")
                return res.status(404).json({ error: error.message })
            }
            if (task.project.id.toString() !== req.project.id) {
                const error = new Error("Esta tarea no pertenece al proyecto")
                return res.status(400).json({ error: error.message })
            }
            res.json(task)
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}