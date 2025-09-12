// FIX: Use a named import for Dexie, which is the standard for current versions of the library.
// This ensures the AquaBreedDB class properly extends Dexie and inherits its methods.
import { Dexie, type Table } from 'dexie';
import { Fish, BreedingRecord, InventoryItem, DietPlan, UserProfile, SpeciesSettings, Activity, Certificate } from './App';

export interface AppState<T> {
    key: string;
    value: T;
}

export class AquaBreedDB extends Dexie {
  fishStock!: Table<Fish, string>;
  breedingRecords!: Table<BreedingRecord, number>;
  inventory!: Table<InventoryItem, string>;
  dietPlans!: Table<DietPlan, string>;
  appState!: Table<AppState<any>, string>;
  activities!: Table<Activity, number>;
  certificates!: Table<Certificate, number>;

  constructor() {
    super('AquaBreedDB');
    this.version(5).stores({
        fishStock: 'id, species, status, origin, saleDate, deathDate',
        breedingRecords: '++id, species, status, pairingDate',
        inventory: 'id, category, purchaseDate',
        dietPlans: 'id, species',
        appState: 'key',
        activities: '++id, timestamp',
        certificates: '++id, fishId, issueDate',
    });
  }
}

export const db = new AquaBreedDB();