export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold",
}

export enum FunkoGenre {
  ANIMATION = "Animación",
  MOVIES_TV = "Películas y TV",
  VIDEO_GAMES = "Videojuegos",
  SPORTS = "Deportes",
  MUSIC = "Música",
  ANIME = "Ánime",
}

export interface FunkoData {
  id: number;
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  number: number;
  exclusive: boolean;
  specialFeatures: string;
  marketValue: number;
}

// Respuesta general del servidor al cliente
export type ResponseType = {
  success: boolean;
  message?: string;               // Mensaje adicional (éxito o error)
  funko?: FunkoData;               
  funkoPops?: FunkoData[];         // Lista de Funkos (por ejemplo, con "list")
  deletedId?: number;             // ID eliminado (en "remove")
};

export class Funko {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public type: FunkoType,
    public genre: FunkoGenre,
    public franchise: string,
    public number: number,
    public exclusive: boolean,
    public specialFeatures: string,
    public marketValue: number
  ) {}

  /**
   * Método para representar el Funko como objeto JSON
   * @returns - FunkoData
   */
  toJSON(): FunkoData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      genre: this.genre,
      franchise: this.franchise,
      number: this.number,
      exclusive: this.exclusive,
      specialFeatures: this.specialFeatures,
      marketValue: this.marketValue,
    };
  }

  /**
   * Método estático para crear un Funko desde un objeto JSON validado
   * @param json - FunkoData
   * @returns Funko
   */
  static fromJSON(json: FunkoData): Funko {
    return new Funko(
      json.id,
      json.name,
      json.description,
      json.type,
      json.genre,
      json.franchise,
      json.number,
      json.exclusive,
      json.specialFeatures,
      json.marketValue
    );
  }
}
