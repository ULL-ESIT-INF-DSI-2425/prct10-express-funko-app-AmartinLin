import express, { Request, Response } from "express";
import { executeCommand } from "./funkoController.js";
import { FunkoData } from "./Funko.js";
import { ResponseType } from "./Funko.js";
//import { join, path } from 'path';

const app = express();
app.use(express.json()); // Para parsear el body como JSON

app.get("/funkos", (req, res) => {
  res.send("probando");
});

app.get("/funkos/:usuario", (req, res) => {
  const usuario = req.params.usuario as string;
  const id = req.query.id; // Capturamos el id desde query

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

  // Devolver la respuesta
  res.json(respuesta);
});

app.post("/funkos/:usuario", (req: Request, res: Response) => {
  try {
    // Validar que el body tenga los datos requeridos
    const usuario = req.params.usuario as string;
    const {
      id,
      name,
      description,
      type,
      genre,
      franchise,
      number,
      exclusive,
      specialFeatures,
      marketValue,
    } = req.body as FunkoData;
    if (
      !id ||
      !name ||
      !type ||
      !description ||
      !genre ||
      !franchise ||
      !number ||
      !exclusive ||
      !specialFeatures ||
      !marketValue
    ) {
      // 400 => bad request
      res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: id, name, type, description, genre, franchise, number, exclusive, special features o marketValue",
      });
    }

    const response: ResponseType = executeCommand(usuario, "add", [
      id.toString(), 
      name,
      type,
      description,
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

app.listen(60300, () => {
  console.log("Server is up on port 60300");
});
