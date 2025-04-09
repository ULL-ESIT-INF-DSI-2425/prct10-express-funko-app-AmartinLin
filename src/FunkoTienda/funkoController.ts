import { FunkoManager } from "./FunkoManager.js";
import { Funko, FunkoGenre, FunkoType, ResponseType } from "./Funko.js";

/**
 * Ejecuta un comando en base a la entrada del usuario.
 * @param username - Nombre del usuario
 * @param command - Comando a ejecutar (add, list, get, remove)
 * @param args - Argumentos del comando
 * @returns - Resultado del comando como string
 */
export const executeCommand = (
  username: string,
  command: string,
  args: string[],
): ResponseType => {
  let response: ResponseType;

  switch (command) {
    case "add": {
      if (args.length < 10) {
        response = {
          success: false,
          message: "Error: Faltan argumentos para añadir un Funko.",
        } as ResponseType;
        return response;
      }
      const tipo = args[3] as keyof typeof FunkoType;
      if (!FunkoType[tipo]) {
        response = {
          success: false,
          message: `Error: Tipo de Funko '${args[3]}' inválido.`,
        } as ResponseType;
        return response;
      }
      const genero = args[4] as keyof typeof FunkoGenre;
      if (!FunkoGenre[genero]) {
        response = {
          success: false,
          message: `Error: Género de Funko '${args[4]}' inválido.`,
        } as ResponseType;
        return response;
      }
      const newFunko = new Funko(
        parseInt(args[0]),
        args[1],
        args[2],
        FunkoType[tipo],
        FunkoGenre[genero],
        args[5],
        parseInt(args[6]),
        args[7] === "true",
        args[8],
        parseFloat(args[9]),
      );
      const manager = new FunkoManager(username);
      const verify: boolean = manager.addFunko(newFunko);
      response = {
        success: verify,
        message: verify
          ? `Funko ${args[1]} añadido.`
          : "Error al añadir el Funko.",
      };
      break;
    }

    case "list": {
      const manager = new FunkoManager(username);
      const funkos: Funko[] = manager.getAllFunkos();
      response = {
        success: true,
        funkoPops: funkos,
      };
      break;
    }

    case "get": {
      if (args.length < 1) {
        response = {
          success: false,
          message: "Error: Debes especificar un ID.",
        };
        return response;
      }
      const manager = new FunkoManager(username);
      const getFunkoResponse: Funko | string = manager.getFunko(
        parseInt(args[0]),
      );
      if (typeof getFunkoResponse === "string") {
        response = {
          success: false,
          message: getFunkoResponse,
        };
      } else {
        response = {
          success: true,
          funko: getFunkoResponse,
        };
      }
      break;
    }

    case "remove": {
      if (args.length < 1) {
        response = {
          success: false,
          message: "Error: Debes especificar un ID.",
        };
        return response;
      }
      const manager = new FunkoManager(username);
      if (manager.deleteFunko(parseInt(args[0]))) {
        response = {
          success: true,
          message: `Funko eliminado.`,
        };
      } else {
        response = {
          success: false,
          message: "Error al eliminar el Funko.",
        };
      }
      break;
    }

    default: {
      response = {
        success: false,
        message: "Comando no reconocido.",
      };
      break;
    }
  }

  return response;
};
