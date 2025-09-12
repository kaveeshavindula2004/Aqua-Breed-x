// FIX: Use a named import for Dexie, which is the standard for current versions of the library.
// This ensures the AquaBreedDB class properly extends Dexie and inherits its methods.
import { Dexie, type Table } from 'dexie';
import { Fish, BreedingRecord, InventoryItem, DietPlan, UserProfile, SpeciesSettings, Activity } from './App';

export interface AppState<T> {
    key: string;
    value: T;
    userId: number;
}

export interface UserAccount {
    id?: number;
    username: string;
    password: string; 
}


export class AquaBreedDB extends Dexie {
  fishStock!: Table<Fish & { userId: number }, string>;
  breedingRecords!: Table<BreedingRecord & { userId: number }, number>;
  inventory!: Table<InventoryItem & { userId: number }, string>;
  dietPlans!: Table<DietPlan & { userId: number }, string>;
  appState!: Table<AppState<any>, [number, string]>;
  userAccounts!: Table<UserAccount, number>;
  activities!: Table<Activity & { userId: number }, number>;

  constructor() {
    super('AquaBreedDB');
    this.version(1).stores({
      fishStock: 'id, species, status, origin',
      breedingRecords: '++id, motherId, fatherId, species, status',
      inventory: 'id, category',
      dietPlans: 'id, species',
      appState: 'key',
    });
    this.version(2).stores({
        userAccounts: '++id, &username',
        fishStock: 'id, userId, species, status, origin',
        breedingRecords: '++id, userId, motherId, fatherId, species, status',
        inventory: 'id, userId, category',
        dietPlans: 'id, userId, species',
        appState: '[userId+key]',
    });
    this.version(3).stores({
        userAccounts: '++id, &username',
        fishStock: 'id, userId, species, status, origin',
        breedingRecords: '++id, userId, motherId, fatherId, species, status',
        inventory: 'id, userId, category',
        dietPlans: 'id, userId, species',
        appState: '[userId+key]',
        activities: '++id, userId, timestamp',
    });
    this.version(4).stores({
        userAccounts: '++id, &username',
        fishStock: 'id, userId, species, status, origin, saleDate, deathDate',
        breedingRecords: '++id, userId, species, status, pairingDate',
        inventory: 'id, userId, category, purchaseDate',
        dietPlans: 'id, userId, species',
        appState: '[userId+key]',
        activities: '++id, userId, timestamp',
    });
  }
}

export const db = new AquaBreedDB();