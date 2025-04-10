import { describe, it, expect, beforeEach, afterAll } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { executeCommand } from "../../src/FunkoTienda/funkoController.js"; 

const TEST_USER = "test_user";
const TEST_DIR = path.join("/tmp", "usuarios", TEST_USER, "funkos");

describe("executeCommand", () => {
  beforeEach(() => {
    // Asegurar que el directorio de prueba está limpio antes de cada test
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterAll(() => {
    // Eliminar archivos de prueba después de cada test
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  it("debería añadir un Funko correctamente", () => {
    const args = [
      "1", // ID
      "Naruto", // Nombre
      "Figura de Naruto", // Descripción
      "POP", // Tipo
      "ANIME", // Género
      "Naruto", // Franquicia
      "100", // Número
      "false", // Exclusivo
      "Ninguna", // Características
      "50.5", // Valor de mercado
    ];
    const response = executeCommand(TEST_USER, "add", args);
    expect(response.message).toBe(`Funko Naruto añadido.`);
    expect(response.success).toBe(true);
    expect(fs.existsSync(path.join(TEST_DIR, "1.json"))).toBe(true);
  });

  it("debería no añadir un Funko con tipo inválido", () => {
    const args = ["1", "Naruto", "Figura de Naruto", "INVALIDO", "ANIME", "Naruto", "100", "false", "Ninguna", "50.5"];
    const response = executeCommand(TEST_USER, "add", args);
    expect(response.success).toBe(false);
  });

  it("debería listar los Funkos", () => {
    executeCommand(TEST_USER, "list", []);
    const response = executeCommand(TEST_USER, "list", []);
    expect(response.success).toBe(true);
    expect(response.funkoPops?.length).toBeGreaterThan(0);
  });

  it("debería obtener un Funko por su ID", () => {
    executeCommand(TEST_USER, "get", ["1"]);
    const response = executeCommand(TEST_USER, "get", ["1"]);
    expect(response.success).toBe(true);
    expect(response.funko).not.toBeNull();
  });

  it("debería devolver error al obtener un Funko inexistente", () => {
    const response = executeCommand(TEST_USER, "get", ["99"]);
    expect(response.success).toBe(false);
  });

  it("debería eliminar un Funko existente", () => {
    const response = executeCommand(TEST_USER, "remove", ["1"]);
    expect(response.success).toBe(true);
    expect(fs.existsSync(path.join(TEST_DIR, "1.json"))).toBe(false);
  });

  it("debería devolver error al eliminar un Funko inexistente", () => {
    const response = executeCommand(TEST_USER, "remove", ["99"]);
    expect(response.success).toBe(false);
  });

  it("debería devolver error para comandos desconocidos", () => {
    const response = executeCommand(TEST_USER, "desconocido", []);
    expect(response.success).toBe(false);
  });
});
