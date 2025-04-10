import express, { Request, Response } from "express";
import { executeCommand } from "./funkoController.js";
import { FunkoData } from "./Funko.js";
import { ResponseType } from "./Funko.js";
//import { join, path } from 'path';

const PORT = 60300;

const app = express();
app.use(express.json()); // Para parsear el body como JSON

app.get("/funkos", (req, res) => {
  const usuario = req.query.usuario as string;
  const id = req.query.id; 
  let respuesta;
  if (id) {
    if (Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "El ID debe ser un único número",
      });
    }
    if (isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: "El ID debe ser un número",
      });
    }
    respuesta = executeCommand(usuario, "get", [id.toString()]);
  } else {
    respuesta = executeCommand(usuario, "list", []);
  }
  res.json(respuesta);
});

app.post("/funkos/:usuario", (req: Request, res: Response) => {
  try {
    const usuario = req.params.usuario as string;
    const {
      id,
      name,
      type,
      description,
      genre,
      franchise,
      number,
      exclusive,
      specialFeatures,
      marketValue,
    } = req.body as FunkoData;
    if (
      id === undefined || name === undefined || description === undefined || 
      type === undefined || genre === undefined || franchise === undefined || 
      number === undefined || exclusive === undefined || 
      specialFeatures === undefined || marketValue === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: id, name, type, description, genre, franchise, number, exclusive, specialFeatures o marketValue",
      });
    }

    const response: ResponseType = executeCommand(usuario, "add", [
      id.toString(), 
      name,
      description,
      type,
      genre,
      franchise,
      number.toString(),
      exclusive ? "true" : "false",
      specialFeatures,
      marketValue.toString(),
    ]);

    // Devolver respuesta según el resultado
    if (response.success) {
      res.status(201).json(response); // 201 Created si es exitoso
    } else {
      res.status(409).json(response); // 409 Conflict si hay error (ej: ID duplicado)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
