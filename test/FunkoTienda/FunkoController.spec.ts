import { describe, it, expect, beforeEach, afterEach } from "vitest";
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

  afterEach(() => {
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
    expect(response.includes("añadido")).toBe(true);
    expect(fs.existsSync(path.join(TEST_DIR, "1.json"))).toBe(true);
  });

  it("debería no añadir un Funko con tipo inválido", () => {
    const args = ["1", "Naruto", "Figura de Naruto", "INVALIDO", "ANIME", "Naruto", "100", "false", "Ninguna", "50.5"];
    const response = executeCommand(TEST_USER, "add", args);
    expect(response.includes("Error: Tipo de Funko")).toBe(true);
  });

  it("debería listar los Funkos", () => {
    executeCommand(TEST_USER, "add", ["1", "Naruto", "Figura", "POP", "ANIME", "Naruto", "100", "false", "Ninguna", "50"]);
    const response = executeCommand(TEST_USER, "list", []);
    const parsed = JSON.parse(response);
    expect(parsed.funkos.length).toBe(1);
    expect(parsed.funkos[0].name).toBe("Naruto");
  });

  it("debería obtener un Funko por su ID", () => {
    executeCommand(TEST_USER, "add", ["1", "Naruto", "Figura", "POP", "ANIME", "Naruto", "100", "false", "Ninguna", "50"]);
    const response = executeCommand(TEST_USER, "get", ["1"]);
    const parsed = JSON.parse(response);
    expect(parsed.funko).not.toBeNull();
    expect(parsed.funko.name).toBe("Naruto");
  });

  it("debería devolver error al obtener un Funko inexistente", () => {
    const response = executeCommand(TEST_USER, "get", ["99"]);
    const parsed = JSON.parse(response);
    expect(parsed.funko).toBeNull();
  });

  it("debería eliminar un Funko existente", () => {
    executeCommand(TEST_USER, "add", ["1", "Naruto", "Figura", "POP", "ANIME", "Naruto", "100", "false", "Ninguna", "50"]);
    const response = executeCommand(TEST_USER, "remove", ["1"]);
    expect(response.includes("eliminado")).toBe(true);
    expect(fs.existsSync(path.join(TEST_DIR, "1.json"))).toBe(false);
  });

  it("debería devolver error al eliminar un Funko inexistente", () => {
    const response = executeCommand(TEST_USER, "remove", ["99"]);
    expect(response.includes("Error al eliminar")).toBe(true);
  });

  it("debería devolver error para comandos desconocidos", () => {
    const response = executeCommand(TEST_USER, "desconocido", []);
    expect(response.includes("Comando no reconocido")).toBe(true);
  });
});
