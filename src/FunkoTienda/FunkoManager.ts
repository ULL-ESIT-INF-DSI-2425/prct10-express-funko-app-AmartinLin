import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Funko, FunkoData } from "./Funko.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaAUsuarios = path.join(__dirname, "../..", "usuarios");

export class FunkoManager {
  private userDir: string;

  constructor(private username: string) {
    const testing = false;
    if (testing) {
      this.userDir = path.join("/tmp", "usuarios", this.username, "funkos"); // Para pasar las pruebas debemos cambiar el directorio a este
    } else {
      this.userDir = path.join(rutaAUsuarios, this.username, "funkos");
    }
    if (!fs.existsSync(this.userDir)) {
      fs.mkdirSync(this.userDir, { recursive: true });
    }
  }

  /**
   * Añade un funko a la colección
   * @param funko - Funko
   * @returns - boolean (true === se ha añadido el funko correctamente)
   */
  addFunko(funko: Funko): boolean {
    const filePath = this.getFunkoFilePath(funko.id);
    if (fs.existsSync(filePath)) {
      console.log(
        chalk.red("Error: El Funko con ID " + funko.id + " ya existe."),
      );
      return false;
    }
    fs.writeFileSync(filePath, JSON.stringify(funko.toJSON(), null, 2));
    console.log(chalk.green("Funko " + funko.name + " añadido con éxito."));
    return true;
  }

  /**
   * Actualiza a un funko en específico si existe
   * @param funko - Funko
   * @returns - boolean - true si se encontró y actualizó el funko
   */
  updateFunko(funko: Funko): boolean {
    const filePath = this.getFunkoFilePath(funko.id);
    if (!fs.existsSync(filePath)) {
      console.log(
        chalk.red("Error: No se encontró el Funko con ID " + funko.id + "."),
      );
      return false;
    }
    fs.writeFileSync(filePath, JSON.stringify(funko.toJSON(), null, 2));
    console.log(chalk.green("Funko " + funko.name + " actualizado con éxito."));
    return true;
  }

  /**
   * Elimina un funko mediante su id
   * @param id - number
   * @returns - boolean - true si se eliminó correctamente
   */
  deleteFunko(id: number): boolean {
    const filePath = this.getFunkoFilePath(id);
    if (!fs.existsSync(filePath)) {
      console.log(
        chalk.red(
          "Error: No se encontró el Funko con ID " + id + " para eliminarlo.",
        ),
      );
      return false;
    }
    fs.unlinkSync(filePath);
    console.log(chalk.green("Funko con ID " + id + " eliminado."));
    return true;
  }

  /**
   * Retorna un array de todos los funkos registrados
   * @returns - Funko[]
   */
  getAllFunkos(): Funko[] {
    if (!fs.existsSync(this.userDir)) {
      return [];
    }
    const files = fs.readdirSync(this.userDir);
    const funkos: Funko[] = [];
    for (const file of files) {
      const filePath = path.join(this.userDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as FunkoData;
      funkos.push(Funko.fromJSON(data));
    }
    return funkos.sort((a, b) => a.id - b.id);
  }

  /**
   * Nos proporciona toda la información de un funko mediante su id
   * @param id - number
   * @returns Funko | null
   */
  getFunko(id: number): Funko | string {
    const filePath = this.getFunkoFilePath(id);
    if (!fs.existsSync(filePath)) {
      return "Error: No se encontró el Funko con ID " + id + ".";
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as FunkoData;
    return Funko.fromJSON(data);
  }

  /**
   * Obtenemos la ruta de donde se ubica el funko
   * @param id - id del funko
   * @returns string
   */
  private getFunkoFilePath(id: number): string {
    return path.join(this.userDir, `${id}.json`);
  }
}
