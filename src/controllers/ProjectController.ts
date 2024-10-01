import { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.send("Proyecto Creado Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }
      project.projectName = req.body.projectName || project.projectName;
      project.clientName = req.body.clientName || project.clientName;
      project.description = req.body.description || project.description;
      await project.save();
      res.send("Proyecto actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static deleteProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();
      res.send("Proyecto eliminado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
