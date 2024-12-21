import { Request, Response } from 'express';
import { Task } from '../../models/Task';
import { ScheduleEntry } from '../../models/ScheduleEntry';
import { SessionLog } from '../../models/SessionLog';

// Tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear tarea' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar tarea' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar tarea' });
  }
};

// Schedule Entries
export const getSchedule = async (req: Request, res: Response) => {
  try {
    const entries = await ScheduleEntry.find({ userId: req.params.userId });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener horario' });
  }
};

export const createScheduleEntry = async (req: Request, res: Response) => {
  try {
    const entry = await ScheduleEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear entrada de horario' });
  }
};

export const updateScheduleEntry = async (req: Request, res: Response) => {
  try {
    const entry = await ScheduleEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: 'Entrada no encontrada' });
    }
    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar entrada' });
  }
};

export const deleteScheduleEntry = async (req: Request, res: Response) => {
  try {
    const entry = await ScheduleEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entrada no encontrada' });
    }
    res.json({ message: 'Entrada eliminada' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar entrada' });
  }
};

// Session Logs
export const getSessionLogs = async (req: Request, res: Response) => {
  try {
    const logs = await SessionLog.find({ userId: req.params.userId });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener registros de sesión' });
  }
};

export const createSessionLog = async (req: Request, res: Response) => {
  try {
    const log = await SessionLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear registro de sesión' });
  }
};

export const updateSessionLog = async (req: Request, res: Response) => {
  try {
    const log = await SessionLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!log) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar registro' });
  }
}; 