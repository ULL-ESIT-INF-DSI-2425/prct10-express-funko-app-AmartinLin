import { describe, it, expect, afterAll} from 'vitest';
import { Funko, FunkoGenre, FunkoType } from '../../src/FunkoTienda/Funko.js';
import { FunkoManager } from '../../src/FunkoTienda/FunkoManager.js';
import fs from 'fs';
import path from 'path';


describe('FunkoManager', () => {
  const testUser = 'TestUser';
  const testDir = path.join("/tmp", "usuarios", testUser, "funkos"); //"./usuarios/TestUser/funkos";
  const testManager = new FunkoManager(testUser);

  // beforeEach(() => {
  //   // Crear directorio de prueba antes de cada prueba
  //   if (!fs.existsSync(testDir)) {
  //     fs.mkdirSync(testDir, { recursive: true });
  //   }
  // });

  afterAll(() => {
  
    if (fs.existsSync(testDir)) {
      fs.readdirSync(testDir).forEach(file => {
        const filePath = path.join(testDir, file);
        fs.unlinkSync(filePath); // Elimina cada archivo dentro del directorio
      });
    }
  });

  it('debería añadir un Funko', () => {
    const newFunko = new Funko(1, 'Spider-Man', 'Descripción de Spider-Man', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 1, false, '', 20);
    const result = testManager.addFunko(newFunko);
    expect(result).toBe(true);
    expect(fs.existsSync(path.join(testDir, '1.json'))).toBe(true);
  });

  it('no debería permitir añadir un Funko con el mismo ID', () => {
    const newFunko = new Funko(1, 'Spider-Man', 'Descripción de Spider-Man', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 1, false, '', 20);
    testManager.addFunko(newFunko);
    const duplicateResult = testManager.addFunko(newFunko);
    expect(duplicateResult).toBe(false);
  });

  it('debería actualizar un Funko existente', () => {
    const newFunko = new Funko(1, 'Spider-Man', 'Descripción de Spider-Man', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 1, false, '', 20);
    testManager.addFunko(newFunko);
    
    const updatedFunko = new Funko(1, 'Spider-Man (Actualizado)', 'Nueva descripción', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 1, false, '', 30);
    const updateResult = testManager.updateFunko(updatedFunko);
    expect(updateResult).toBe(true);
    
    const funkoData = JSON.parse(fs.readFileSync(path.join(testDir, '1.json'), 'utf-8'));
    expect(funkoData.name).toBe('Spider-Man (Actualizado)');
    expect(funkoData.marketValue).toBe(30);
  });

  it('no debería actualizar un Funko que no existe', () => {
    const updatedFunko = new Funko(99, 'Funko Inexistente', 'Descripción', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 1, false, '', 20);
    const updateResult = testManager.updateFunko(updatedFunko);
    expect(updateResult).toBe(false);
  });

  it('debería eliminar un Funko existente', () => {
    const newFunko = new Funko(1, 'Spider-Man', 'Descripción de Spider-Man', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 1, false, '', 20);
    testManager.addFunko(newFunko);
    const deleteResult = testManager.deleteFunko(1);
    expect(deleteResult).toBe(true);
    expect(fs.existsSync(path.join(testDir, '1.json'))).toBe(false);
  });

  it('no debería eliminar un Funko que no existe', () => {
    const deleteResult = testManager.deleteFunko(99);
    expect(deleteResult).toBe(false);
  });

  it('debería listar todos los Funkos', () => {
    const newFunko1 = new Funko(1, 'Spider-Man', 'Descripción de Spider-Man', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 1, false, '', 20);
    const newFunko2 = new Funko(2, 'Iron Man', 'Descripción de Iron Man', FunkoType.POP, FunkoGenre.MOVIES_TV, 'Marvel', 2, false, '', 30);
    testManager.addFunko(newFunko1);
    testManager.addFunko(newFunko2);
    
    const allFunkos = testManager.getAllFunkos();
    expect(allFunkos.length).toBe(2);
    expect(allFunkos[0].name).toBe('Spider-Man');
    expect(allFunkos[1].name).toBe('Iron Man');
  });
});
