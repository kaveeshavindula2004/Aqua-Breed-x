
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FeatureCard from './components/FeatureCard';
import StatCard from './components/StatCard';
import ActivityItem from './components/ActivityItem';
import BreedingManagementView from './components/BreedingManagementView';
import BreedingDetailView from './components/BreedingDetailView';
import FishStockView from './components/FishStockView';
import AddFishForm, { AddFishFormInitialData } from './components/AddFishForm';
import FishDetailView from './components/FishDetailView';
import SettingsView from './components/SettingsView';
import { ParentFishIcon, FryIcon, BreedingIcon, EggsIcon, TotalParentFishIcon, SuccessIcon, FailureIcon, LogoIcon, InfoIcon, XIcon, TrashIcon, FinanceIcon, InventoryIcon, EditIcon, CameraIcon } from './components/Icons';
import ParentStockView from './components/ParentStockView';
import FryView from './components/FryView';
import AddBreedingForm from './components/AddBreedingForm';
import CertificateView from './components/CertificateView';
import NotificationView from './components/NotificationView';
import DropdownMenu from './components/DropdownMenu';
import CertificatesView from './components/CertificatesView';
import PerformanceView from './components/PerformanceView';
import InventoryView from './components/InventoryView';
import DietPlansView from './components/DietPlansView';
import FinanceView from './components/FinanceView';
import SelectFishForCertificateForm from './components/SelectFishForCertificateForm';
import AboutView from './components/AboutView';
import SpeciesSettingsForm from './components/SpeciesSettingsForm';
import { db } from './db';

export type View = 'dashboard' | 'parentStock' | 'fry' | 'breeding' | 'fishStock' | 'settings' | 'breedingDetail' | 'fishDetail' | 'certificates' | 'performance' | 'inventory' | 'dietPlans' | 'finance' | 'about';

export type BreedingStatus = 'Paired' | 'Eggs Laid' | 'Hatched' | 'Fry Out' | 'Successful' | 'Unsuccessful';

export interface BreedingRecord {
  id: number;
  motherId: string;
  fatherId: string;
  species: string;
  pairingDate: string;
  eggsLaidDate?: string;
  hatchDate?: string;
  status: BreedingStatus;
  notes: string;
  fryCount?: number;
  dietPlan?: string;
}

export interface HealthRecord {
    id: number;
    date: string;
    type: 'Observation' | 'Treatment';
    notes: string;
}

export interface Fish {
  id: string;
  species: string;
  nickname?: string;
  photo?: string;
  dob: string | null;
  gender: 'Male' | 'Female' | 'Unknown';
  status: 'Active' | 'Sold' | 'Dead';
  healthHistory: HealthRecord[];
  causeOfDeath?: string;
  origin: 'Acquired' | 'Bred';
  motherId?: string;
  fatherId?: string;
  breedingId?: number;
  salePrice?: number;
  saleDate?: string;
  deathDate?: string;
}

export type NewFishPayload = Omit<Fish, 'id' | 'origin'>;
export type NewBreedingPayload = Omit<BreedingRecord, 'id' | 'species'>;

export interface AppNotification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    viewTarget?: View;
    recordId?: number;
}

export interface SpeciesTimeline {
  incubationDays: number;
  saleReadyDays: number;
  breedingCooldownDays: number;
  maturityDays: number;
}

export interface SpeciesSettings {
  [species: string]: SpeciesTimeline;
}

export type InventoryCategory = 'Fish Feeds' | 'Medicines' | 'Maintenance';
export interface InventoryItem {
    id: string;
    name: string;
    category: InventoryCategory;
    quantity: number;
    cost: number;
    photo?: string;
    purchaseDate: string;
}
export interface DietPlan {
    id: string;
    name: string;
    species: string;
    food: string;
    timesPerDay: number;
    feedingTimes: string[];
    target: 'Parents' | 'Fry' | 'All';
    isTemporary: boolean;
    endDate?: string;
}

export interface UserProfile {
    farmName: string;
    contact: string;
    email: string;
    profilePicture?: string;
}

export interface Activity {
  id?: number;
  type: 'new_parent' | 'fry_hatched' | 'eggs_laid' | 'new_breeding' | 'fish_sold' | 'fish_died' | 'inventory_added';
  title: string;
  subtitle: string;
  timestamp: number;
}

export interface Certificate {
  id?: number;
  fishId: string;
  issueDate: string;
}


const initialFishStock: Fish[] = [];

const initialBreedingRecords: BreedingRecord[] = [];

const defaultUserProfile: UserProfile = {
  farmName: 'Your Farm/Name',
  contact: '',
  email: '',
  profilePicture: undefined,
};

const defaultSpeciesSettings: SpeciesSettings = {
  'Guppy': { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 28, maturityDays: 90 },
  'Betta': { incubationDays: 3, saleReadyDays: 90, breedingCooldownDays: 14, maturityDays: 120 },
  'Angelfish': { incubationDays: 4, saleReadyDays: 60, breedingCooldownDays: 21, maturityDays: 180 },
  'Cichlid': { incubationDays: 5, saleReadyDays: 75, breedingCooldownDays: 30, maturityDays: 240 },
};

// Form for adding or editing a diet plan
const AddDietPlanForm: React.FC<{
    onSave: (plan: DietPlan | Omit<DietPlan, 'id'>) => void,
    onClose: () => void,
    allSpecies: string[],
    initialData?: DietPlan,
    fishFeeds: InventoryItem[],
}> = ({ onSave, onClose, allSpecies, initialData, fishFeeds }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [food, setFood] = useState('');
    const [target, setTarget] = useState<'Parents' | 'Fry' | 'All'>('All');
    const [feedingTimes, setFeedingTimes] = useState<string[]>(['09:00']);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setSpecies(initialData.species);
            setFood(initialData.food);
            setTarget(initialData.target);
            setFeedingTimes(initialData.feedingTimes);
        }
    }, [initialData]);

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...feedingTimes];
        newTimes[index] = value;
        setFeedingTimes(newTimes);
    };

    const addTimeField = () => setFeedingTimes([...feedingTimes, '']);
    const removeTimeField = (index: number) => {
        if (feedingTimes.length > 1) {
            setFeedingTimes(feedingTimes.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !species || !food || feedingTimes.some(t => !t)) {
            alert("Please fill out all required fields and ensure feeding times are set.");
            return;
        }
        
        const planData = {
            name,
            species,
            food,
            target,
            feedingTimes: feedingTimes.filter(t => t),
            timesPerDay: feedingTimes.filter(t => t).length,
            isTemporary: false
        };

        if (initialData) {
            onSave({ ...planData, id: initialData.id });
        } else {
            onSave(planData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Diet Plan' : 'New Diet Plan'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto">
                    <input type="text" placeholder="Plan Name (e.g., Guppy Fry Growth)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required />
                    <select value={species} onChange={e => setSpecies(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required>
                        <option value="">Select Species</option>
                        {allSpecies.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={food} onChange={e => setFood(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required>
                        <option value="">Select Food Type</option>
                        {fishFeeds.length > 0 ? (
                            fishFeeds.map(feed => <option key={feed.id} value={feed.name}>{feed.name}</option>)
                        ) : (
                            <option value="" disabled>No fish feeds in inventory</option>
                        )}
                    </select>
                    {fishFeeds.length === 0 && <p className="text-xs text-yellow-500 text-center -mt-2">Please add items to the 'Fish Feeds' category in your inventory first.</p>}
                    <select value={target} onChange={e => setTarget(e.target.value as any)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none">
                        <option value="All">All</option>
                        <option value="Parents">Parents</option>
                        <option value="Fry">Fry</option>
                    </select>
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Feeding Times</label>
                        {feedingTimes.map((time, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-1">
                                <input type="time" value={time} onChange={e => handleTimeChange(index, e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none" required/>
                                {feedingTimes.length > 1 && (
                                    <button type="button" onClick={() => removeTimeField(index)} className="p-1 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-full">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addTimeField} className="text-sky-500 dark:text-sky-400 text-sm font-semibold mt-2 hover:underline">+ Add Time</button>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-lg px-4 py-2 transition-colors">Cancel</button>
                        <button type="submit" className="bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-6 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Confirmation dialog for deleting a plan
const DietPlanConfirmationDialog: React.FC<{ plan: DietPlan; onConfirm: () => void; onCancel: () => void; }> = ({ plan, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white p-6 space-y-4 border border-gray-300 dark:border-slate-700 text-center shadow-lg">
            <h3 className="text-xl font-bold">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300">Are you sure you want to delete the plan <span className="font-semibold text-gray-900 dark:text-white">{plan.name}</span>?</p>
            <div className="flex justify-center space-x-4 pt-2">
                <button onClick={onCancel} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Delete</button>
            </div>
        </div>
    </div>
);

const AddInventoryItemForm: React.FC<{ onSave: (item: Omit<InventoryItem, 'id' | 'purchaseDate'>) => void, onClose: () => void }> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<InventoryCategory>('Fish Feeds');
    const [quantity, setQuantity] = useState(1);
    const [unitCost, setUnitCost] = useState(0);
    const [photo, setPhoto] = useState<string | undefined>();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhoto(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || quantity <= 0 || unitCost < 0) {
            alert("Please fill out all fields with valid values.");
            return;
        }
        const cost = quantity * unitCost;
        onSave({ name, category, quantity, cost, photo });
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">Add New Item</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-lg relative group">
                            <input type="file" id="item-photo-upload" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                            <label htmlFor="item-photo-upload" className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer">
                                {photo ? (
                                    <img src={photo} alt="Item preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <>
                                        <CameraIcon className="w-8 h-8" />
                                        <span className="text-xs mt-1">Add Photo</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value as InventoryCategory)} className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none">
                            <option>Fish Feeds</option>
                            <option>Medicines</option>
                            <option>Maintenance</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Quantity</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} min="1" className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Unit Cost ($)</label>
                            <input type="number" value={unitCost} onChange={e => setUnitCost(parseFloat(e.target.value) || 0)} min="0" step="0.01" className="w-full bg-gray-100 dark:bg-slate-800 rounded p-2 text-sm mt-1 border border-gray-300 dark:border-slate-600 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                        <button type="submit" className="bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-6 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const InventoryConfirmationDialog: React.FC<{ item: InventoryItem; onConfirm: () => void; onCancel: () => void; }> = ({ item, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm text-gray-900 dark:text-white p-6 space-y-4 border border-gray-300 dark:border-slate-700 text-center shadow-lg">
            <h3 className="text-xl font-bold">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300">Are you sure you want to permanently delete <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4 pt-2">
                <button onClick={onCancel} className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">Delete</button>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [selectedBreedingId, setSelectedBreedingId] = useState<number | null>(null);
  const [fishStock, setFishStock] = useState<Fish[]>([]);
  const [isAddingFish, setIsAddingFish] = useState(false);
  const [addFishInitialData, setAddFishInitialData] = useState<AddFishFormInitialData | undefined>(undefined);
  const [isAddingBreeding, setIsAddingBreeding] = useState(false);
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null);
  const [showInactiveFish, setShowInactiveFish] = useState(true);
  const [isSelectingFishForCert, setIsSelectingFishForCert] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotificationViewOpen, setIsNotificationViewOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState<string | null>(null);
  const [isAddingSpecies, setIsAddingSpecies] = useState(false);
  const [viewingCertificateForFishId, setViewingCertificateForFishId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [speciesSettings, setSpeciesSettings] = useState<SpeciesSettings>({});
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  // State for Diet Plan Modals
  const [isDietPlanFormOpen, setIsDietPlanFormOpen] = useState(false);
  const [editingDietPlan, setEditingDietPlan] = useState<DietPlan | undefined>(undefined);
  const [dietPlanToDelete, setDietPlanToDelete] = useState<DietPlan | null>(null);
  
  // State for Inventory Modals
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fishCount = await db.fishStock.count();
        if (fishCount === 0) {
          // Seed the database on first run
          await db.transaction('rw', db.tables, async () => {
            await db.fishStock.bulkAdd(initialFishStock);
            await db.breedingRecords.bulkAdd(initialBreedingRecords);
            const initialActivitiesToSeed: Omit<Activity, 'id'>[] = [];
            await db.activities.bulkAdd(initialActivitiesToSeed);
            await db.appState.put({ key: 'userProfile', value: defaultUserProfile });
            await db.appState.put({ key: 'speciesSettings', value: defaultSpeciesSettings });
            await db.appState.put({ key: 'notificationsEnabled', value: true });
            await db.appState.put({ key: 'showInactiveFish', value: true });
          });
        }
        
        const [fishes, records, inv, diets, profile, settings, notifsEnabled, showInactive, acts, certs] = await Promise.all([
          db.fishStock.toArray(),
          db.breedingRecords.toArray(),
          db.inventory.toArray(),
          db.dietPlans.toArray(),
          db.appState.get('userProfile'),
          db.appState.get('speciesSettings'),
          db.appState.get('notificationsEnabled'),
          db.appState.get('showInactiveFish'),
          db.activities.orderBy('timestamp').reverse().limit(20).toArray(),
          db.certificates.toArray(),
        ]);

        setFishStock(fishes);
        setBreedingRecords(records);
        setInventory(inv);
        setDietPlans(diets);
        setUserProfile(profile?.value || defaultUserProfile);
        setSpeciesSettings(settings?.value || defaultSpeciesSettings);
        setNotificationsEnabled(notifsEnabled?.value === true);
        setShowInactiveFish(showInactive?.value !== false);
        setActivities(acts);
        setCertificates(certs);

      } catch (error) {
        console.error("Failed to load or initialize database:", error);
      }
    };

    loadData();
  }, []);
  
  useEffect(() => {
    const checkNotifications = () => {
      if (!notificationsEnabled) {
        setNotifications([]);
        return;
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newNotifications: AppNotification[] = [];
      const dismissedNotifs = JSON.parse(sessionStorage.getItem('dismissedNotifications') || '[]');
  
      breedingRecords.forEach(record => {
          const mother = fishStock.find(f => f.id === record.motherId);
          const father = fishStock.find(f => f.id === record.fatherId);
          const pairLabel = `${mother?.nickname || record.motherId} x ${father?.nickname || record.fatherId}`;
          const settings = speciesSettings[record.species] || { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 30, maturityDays: 90 };
  
          if (record.status === 'Eggs Laid' && record.eggsLaidDate) {
              const expectedHatchDate = new Date(record.eggsLaidDate);
              expectedHatchDate.setDate(expectedHatchDate.getDate() + settings.incubationDays);
              const notifId = `hatch-${record.id}`;
              if (today >= expectedHatchDate && !dismissedNotifs.includes(notifId)) {
                  newNotifications.push({ id: notifId, message: `Eggs from ${pairLabel} may be hatching!`, type: 'info', viewTarget: 'breedingDetail', recordId: record.id });
              }
          }
  
          if ((record.status === 'Hatched' || record.status === 'Fry Out' || record.status === 'Successful') && record.hatchDate) {
              const readyForSaleDate = new Date(record.hatchDate);
              readyForSaleDate.setDate(readyForSaleDate.getDate() + settings.saleReadyDays);
              const notifId = `sale-${record.id}`;
              if (today >= readyForSaleDate && !dismissedNotifs.includes(notifId)) {
                   newNotifications.push({ id: notifId, message: `Fry from ${pairLabel} may be ready for sale.`, type: 'success', viewTarget: 'breedingDetail', recordId: record.id });
              }
          }
      });
      
      inventory.forEach(item => {
        const notifId = `stock-${item.id}`;
        if(item.quantity <= 0 && !dismissedNotifs.includes(notifId)) {
            newNotifications.push({ id: notifId, message: `${item.name} is out of stock.`, type: 'warning', viewTarget: 'inventory' });
        }
      });

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      dietPlans.forEach(plan => {
        if(plan.feedingTimes.includes(currentTime)) {
            const notifId = `diet-${plan.id}-${currentTime}`;
             if (!dismissedNotifs.includes(notifId)) {
                 newNotifications.push({ id: notifId, message: `Feeding time: ${plan.name}`, type: 'info', viewTarget: 'dietPlans' });
             }
        }
      });

      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
        return [...prev, ...uniqueNew];
      });
    };
    checkNotifications();
    const intervalId = setInterval(checkNotifications, 60000);
    return () => clearInterval(intervalId);
  }, [breedingRecords, notificationsEnabled, fishStock, speciesSettings, inventory, dietPlans]);
  
  const addActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
      const newActivity: Activity = {
          ...activity,
          timestamp: Date.now()
      };
      try {
          const newId = await db.activities.add(newActivity);
          setActivities(prev => [{ ...newActivity, id: newId }, ...prev].slice(0, 20));
      } catch (error) {
          console.error("Failed to add activity:", error);
      }
  };

  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    db.appState.put({ key: 'notificationsEnabled', value: enabled });
  };
  
  const handleSaveSpeciesSettings = (species: string, timeline: SpeciesTimeline) => {
    const trimmedSpecies = species.trim();
    if (!trimmedSpecies) {
      alert("Species name cannot be empty.");
      return;
    }

    const isAdding = !Object.keys(speciesSettings).find(s => s.toLowerCase() === trimmedSpecies.toLowerCase());
    if (isAdding) {
      const currentAllSpecies = [...new Set([...fishStock.map(f => f.species), ...Object.keys(speciesSettings)])];
      if (currentAllSpecies.some(s => s.toLowerCase() === trimmedSpecies.toLowerCase())) {
        alert(`Species "${trimmedSpecies}" already exists.`);
        return;
      }
    }
    
    const newSettings = { ...speciesSettings, [trimmedSpecies]: timeline };
    setSpeciesSettings(newSettings);
    db.appState.put({ key: 'speciesSettings', value: newSettings });

    setEditingSpecies(null);
    setIsAddingSpecies(false);
  };

  const handleAddNewSpecies = () => {
    setIsAddingSpecies(true);
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    db.appState.put({ key: 'userProfile', value: profile });
  };

  const handleDismissNotification = (id: string) => {
    const dismissedNotifs = JSON.parse(sessionStorage.getItem('dismissedNotifications') || '[]');
    if (!dismissedNotifs.includes(id)) {
        sessionStorage.setItem('dismissedNotifications', JSON.stringify([...dismissedNotifs, id]));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const handleNotificationClick = (notification: AppNotification) => {
    handleDismissNotification(notification.id);
    if (notification.viewTarget && notification.recordId) {
        setSelectedBreedingId(notification.recordId);
        setCurrentView(notification.viewTarget);
    } else if (notification.viewTarget) {
        setCurrentView(notification.viewTarget);
    }
    setIsNotificationViewOpen(false);
  };

  const handleDeleteActivity = (id: number) => {
    db.activities.delete(id);
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };
  
  const handleBack = () => {
    if (currentView === 'breedingDetail') setCurrentView('breeding');
    else if (currentView === 'fishDetail') {
        const fish = fishStock.find(f => f.id === selectedFishId);
        if (fish?.origin === 'Bred') setCurrentView('fry');
        else setCurrentView('fishStock');
    }
    else setCurrentView('dashboard');
  };
  
  const handleSelectBreeding = (id: number) => {
    setSelectedBreedingId(id);
    setCurrentView('breedingDetail');
  };

  const handleSelectFish = (id: string) => {
    setSelectedFishId(id);
    setCurrentView('fishDetail');
  };
  
  const handleUpdateBreedingStatus = (id: number, status: BreedingStatus) => {
    let updatedRecord: BreedingRecord | null = null;
    const recordToUpdate = breedingRecords.find(r => r.id === id);
    if (!recordToUpdate) return;

    if (status === 'Eggs Laid') {
        const mother = fishStock.find(f => f.id === recordToUpdate.motherId);
        const father = fishStock.find(f => f.id === recordToUpdate.fatherId);
        const pairLabel = `${mother?.nickname || recordToUpdate.motherId} x ${father?.nickname || recordToUpdate.fatherId}`;
        addActivity({ type: 'eggs_laid', title: 'Eggs Laid', subtitle: `Pair: ${pairLabel}` });
    }
    if (status === 'Hatched') {
        const mother = fishStock.find(f => f.id === recordToUpdate.motherId);
        const father = fishStock.find(f => f.id === recordToUpdate.fatherId);
        const pairLabel = `${mother?.nickname || recordToUpdate.motherId} x ${father?.nickname || recordToUpdate.fatherId}`;
        addActivity({ type: 'fry_hatched', title: 'Fry Hatched!', subtitle: `From pair: ${pairLabel}` });
    }

    const today = new Date().toISOString().split('T')[0];
    updatedRecord = { ...recordToUpdate, status };
    if (status === 'Eggs Laid' && !updatedRecord.eggsLaidDate) updatedRecord.eggsLaidDate = today;
    if (status === 'Hatched' && !updatedRecord.hatchDate) updatedRecord.hatchDate = today;

    setBreedingRecords(prev => prev.map(r => r.id === id ? updatedRecord! : r));
    db.breedingRecords.put(updatedRecord);
    if(status === 'Successful' || status === 'Unsuccessful') setCurrentView('breeding');
  };

  const handleUpdateBreedingRecord = (updatedRecord: BreedingRecord) => {
    setBreedingRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    db.breedingRecords.put(updatedRecord);
  }

  const handleAddFish = (newFishPayload: NewFishPayload) => {
    const speciesCode = newFishPayload.species.trim().substring(0, 3).toUpperCase();
    const uniqueId = `${speciesCode}-${Date.now()}`;
    const newFish: Fish = {
      ...newFishPayload,
      id: uniqueId,
      origin: newFishPayload.motherId ? 'Bred' : 'Acquired',
    };
    setFishStock(prev => [...prev, newFish]);
    db.fishStock.add(newFish);
    setIsAddingFish(false);
    setAddFishInitialData(undefined);

    if (newFish.origin === 'Acquired') {
      addActivity({
        type: 'new_parent',
        title: 'New Fish Added',
        subtitle: `${newFishPayload.nickname || newFishPayload.species} (${uniqueId})`
      });
    }
  };
  
  const handleInitiateAddFry = (record: BreedingRecord) => {
    setAddFishInitialData({
      species: record.species,
      dob: record.hatchDate || new Date().toISOString().split('T')[0],
      motherId: record.motherId,
      fatherId: record.fatherId,
      breedingId: record.id,
    });
    setIsAddingFish(true);
  };

  const handleAddBreeding = async (payload: NewBreedingPayload) => {
    const mother = fishStock.find(f => f.id === payload.motherId);
    if (!mother) return;

    const recordToAdd = {
      ...payload,
      species: mother.species,
    };
    
    const newId = await db.breedingRecords.add(recordToAdd as any);
    const newRecord = { ...payload, species: mother.species, id: newId };

    setBreedingRecords(prev => [newRecord, ...prev]);
    setIsAddingBreeding(false);

    const father = fishStock.find(f => f.id === payload.fatherId);
    const pairLabel = `${mother.nickname || mother.id} x ${father?.nickname || father?.id}`;
    addActivity({
        type: 'new_breeding',
        title: 'New Breeding Pair Created',
        subtitle: pairLabel
    });
  }

  const handleUpdateFish = (updatedFish: Fish) => {
    const oldFish = fishStock.find(f => f.id === updatedFish.id);
    let fishToUpdate = { ...updatedFish };

    if (oldFish) {
        if (fishToUpdate.status === 'Sold' && oldFish.status !== 'Sold') {
            fishToUpdate.saleDate = new Date().toISOString().split('T')[0];
            addActivity({
                type: 'fish_sold',
                title: 'Fish Sold',
                subtitle: `${fishToUpdate.nickname || fishToUpdate.id} for $${fishToUpdate.salePrice?.toFixed(2) || '0.00'}`
            });
        }
        if (fishToUpdate.status === 'Dead' && oldFish.status !== 'Dead') {
            fishToUpdate.deathDate = new Date().toISOString().split('T')[0];
            addActivity({
                type: 'fish_died',
                title: 'Fish Mortality',
                subtitle: `${fishToUpdate.nickname || fishToUpdate.id}`
            });
        }
    }
    
    setFishStock(prev => prev.map(fish => fish.id === fishToUpdate.id ? fishToUpdate : fish));
    db.fishStock.put(fishToUpdate);
  };

  const handleMenuSelect = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  }

  const handleViewCertificate = (fishId: string) => {
    setViewingCertificateForFishId(fishId);
  };
  
  const handleConfirmCertSale = async (fishId: string, price: number) => {
    const fish = fishStock.find(f => f.id === fishId);
    if (!fish) return;
    
    try {
      // 1. Update fish status and save
      // FIX: Explicitly type `updatedFish` as `Fish` to prevent TypeScript from widening the 'status' property to a generic 'string'.
      const updatedFish: Fish = { ...fish, status: 'Sold', salePrice: price };
      await db.fishStock.put(updatedFish);
      setFishStock(prev => prev.map(f => (f.id === fishId ? updatedFish : f)));
      
      // 2. Create and save certificate record
      const newCertificate: Certificate = {
        fishId: fishId,
        issueDate: new Date().toISOString().split('T')[0]
      };
      const newCertId = await db.certificates.add(newCertificate);
      setCertificates(prev => [...prev, { ...newCertificate, id: newCertId }]);

      // 3. Close selection form and open view
      setIsSelectingFishForCert(false);
      handleViewCertificate(fishId);

    } catch (error) {
      console.error("Failed to confirm certificate sale:", error);
      alert("Error: Could not save the sale information.");
    }
  };

  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id' | 'purchaseDate'>) => {
    const newItem: InventoryItem = { 
        ...item, 
        id: `item-${Date.now()}`,
        purchaseDate: new Date().toISOString().split('T')[0]
    };
    db.inventory.add(newItem);
    setInventory(prev => [...prev, newItem]);
    addActivity({
        type: 'inventory_added',
        title: 'Inventory Updated',
        subtitle: `Added ${item.quantity} x ${item.name}`
    });
    setIsAddItemFormOpen(false);
  }
  const handleUpdateInventoryItem = (item: InventoryItem) => {
    db.inventory.put(item);
    setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  }
  const handleDeleteInventoryItem = (itemId: string) => {
    db.inventory.delete(itemId);
    setInventory(prev => prev.filter(i => i.id !== itemId));
  }
  
  const handleAddDietPlan = async (plan: Omit<DietPlan, 'id'>) => {
    const newPlan = { ...plan, id: `diet-${Date.now()}` };
    try {
        await db.dietPlans.add(newPlan);
        setDietPlans(prev => [...prev, newPlan]);
    } catch (error) {
        console.error("Failed to add diet plan:", error);
        alert("Error: Could not save the new diet plan.");
    }
  };
  
  const handleUpdateDietPlan = async (plan: DietPlan) => {
      try {
          await db.dietPlans.put(plan);
          setDietPlans(prev => prev.map(p => (p.id === plan.id ? plan : p)));
      } catch (error) {
          console.error("Failed to update diet plan:", error);
          alert("Error: Could not update the diet plan.");
      }
  };

  const handleDeleteDietPlan = async (planId: string) => {
      try {
          await db.dietPlans.delete(planId);
          setDietPlans(prev => prev.filter(p => p.id !== planId));
      } catch (error) {
          console.error("Failed to delete diet plan:", error);
          alert("Error: Could not delete the diet plan.");
      }
  };

  const handleOpenAddDietPlan = () => {
    setEditingDietPlan(undefined);
    setIsDietPlanFormOpen(true);
  };
  
  const handleOpenEditDietPlan = (plan: DietPlan) => {
    setEditingDietPlan(plan);
    setIsDietPlanFormOpen(true);
  };

  const handleCloseDietPlanForm = () => {
    setIsDietPlanFormOpen(false);
    setEditingDietPlan(undefined);
  };

  const handleSaveDietPlan = async (planData: DietPlan | Omit<DietPlan, 'id'>) => {
    if ('id' in planData) {
      await handleUpdateDietPlan(planData as DietPlan);
    } else {
      await handleAddDietPlan(planData as Omit<DietPlan, 'id'>);
    }
    handleCloseDietPlanForm();
  };
  
  const handleConfirmDeleteDietPlan = async () => {
    if (dietPlanToDelete) {
      await handleDeleteDietPlan(dietPlanToDelete.id);
      setDietPlanToDelete(null);
    }
  };

  const handleOpenAddItem = () => setIsAddItemFormOpen(true);
  const handleCloseAddItem = () => setIsAddItemFormOpen(false);
  const handleOpenDeleteItem = (item: InventoryItem) => setItemToDelete(item);
  const handleCloseDeleteItem = () => setItemToDelete(null);
  
  const handleConfirmDeleteItem = () => {
      if(itemToDelete) {
        handleDeleteInventoryItem(itemToDelete.id);
        handleCloseDeleteItem();
      }
  }

  const handleToggleInactiveFish = (show: boolean) => {
    setShowInactiveFish(show);
    db.appState.put({ key: 'showInactiveFish', value: show });
  }

  const formatTimeAgo = (timestamp: number) => {
      const now = Date.now();
      const seconds = Math.floor((now - timestamp) / 1000);
      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}d ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months}mo ago`;
      const years = Math.floor(months / 12);
      return `${years}y ago`;
  };

  const getActivityIcon = (type: Activity['type']) => {
      switch (type) {
          case 'new_parent': return { icon: <ParentFishIcon className="w-5 h-5 text-white" />, bgColor: 'bg-blue-500' };
          case 'fry_hatched': return { icon: <FryIcon className="w-5 h-5 text-white" />, bgColor: 'bg-green-500' };
          case 'eggs_laid': return { icon: <EggsIcon className="w-5 h-5 text-white" />, bgColor: 'bg-purple-500' };
          case 'new_breeding': return { icon: <BreedingIcon className="w-5 h-5 text-white" />, bgColor: 'bg-sky-500' };
          case 'fish_sold': return { icon: <FinanceIcon className="w-5 h-5 text-white" />, bgColor: 'bg-green-500' };
          case 'fish_died': return { icon: <FailureIcon className="w-5 h-5 text-white" />, bgColor: 'bg-red-500' };
          case 'inventory_added': return { icon: <InventoryIcon className="w-5 h-5 text-white" />, bgColor: 'bg-indigo-500' };
          default: return { icon: <InfoIcon className="w-5 h-5 text-white" />, bgColor: 'bg-gray-500' };
      }
  };

  const selectedBreedingRecord = breedingRecords.find(r => r.id === selectedBreedingId);
  const selectedFish = fishStock.find(f => f.id === selectedFishId);
  
  const viewingFishForCert = viewingCertificateForFishId ? fishStock.find(f => f.id === viewingCertificateForFishId) : null;
  const motherForCert = viewingFishForCert ? fishStock.find(f => f.id === viewingFishForCert.motherId) : undefined;
  const fatherForCert = viewingFishForCert ? fishStock.find(f => f.id === viewingFishForCert.fatherId) : undefined;

  const fishFeeds = inventory.filter(item => item.category === 'Fish Feeds');
  const allSpecies = [...new Set([...fishStock.map(f => f.species), ...Object.keys(speciesSettings)])].sort();

  const ongoingStatuses: BreedingStatus[] = ['Paired', 'Eggs Laid', 'Hatched', 'Fry Out'];
  const ongoingBreedings = breedingRecords.filter(r => ongoingStatuses.includes(r.status)).length;
  const eggsLaidStatuses: BreedingStatus[] = ['Eggs Laid', 'Hatched', 'Fry Out', 'Successful'];
  const eggsLaidCount = breedingRecords.filter(r => eggsLaidStatuses.includes(r.status)).length;
  const fryOutStatuses: BreedingStatus[] = ['Fry Out', 'Successful'];
  const fryOutCount = breedingRecords.filter(r => fryOutStatuses.includes(r.status)).length;
  const totalParentFish = fishStock.filter(f => f.status === 'Active').length;
  const successfulBreedings = breedingRecords.filter(r => r.status === 'Successful').length;
  const unsuccessfulBreedings = breedingRecords.filter(r => r.status === 'Unsuccessful').length;

  const Dashboard = () => (
    <div className="animate-fade-in py-6">
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <FeatureCard icon={<ParentFishIcon className="w-10 h-10 text-white/90" />} label="Parent Stock" onClick={() => setCurrentView('parentStock')} />
        <FeatureCard icon={<FryIcon className="w-10 h-10 text-white/90" />} label="Fry & Juveniles" onClick={() => setCurrentView('fry')} />
      </div>
      <div className="flex items-center justify-center my-6 max-w-4xl mx-auto"><div className="flex-grow border-t border-gray-300 dark:border-gray-600/50"></div><span className="px-4 text-gray-500 dark:text-gray-400 font-semibold text-sm tracking-wider">SUMMARY</span><div className="flex-grow border-t border-gray-300 dark:border-gray-600/50"></div></div>
      <div className="bg-gray-100 dark:bg-gray-800/20 rounded-3xl p-4 max-w-4xl mx-auto"><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<BreedingIcon className="w-8 h-8 text-sky-600" />} label="Total Breedings" value={String(ongoingBreedings)} />
        <StatCard icon={<EggsIcon className="w-8 h-8 text-sky-600" />} label="Eggs Laid" value={String(eggsLaidCount)} />
        <StatCard icon={<FryIcon className="w-8 h-8 text-sky-600" />} label="Fry Out" value={String(fryOutCount)} />
        <StatCard icon={<TotalParentFishIcon className="w-8 h-8 text-sky-600" />} label="Total Parent Fish" value={String(totalParentFish)} />
        <StatCard icon={<SuccessIcon className="w-8 h-8 text-green-500" />} label="Successful Breedings" value={String(successfulBreedings)} />
        <StatCard icon={<FailureIcon className="w-8 h-8 text-red-500" />} label="Unsuccessful Breedings" value={String(unsuccessfulBreedings)} />
      </div></div>
      <div className="mt-6 max-w-2xl mx-auto"><h2 className="font-bold text-lg mb-3 px-2">Recent Activity</h2><div className="space-y-3">
        {activities.map(activity => {
            if (!activity.id) return null;
            const { icon, bgColor } = getActivityIcon(activity.type);
            return (
                <ActivityItem 
                    key={activity.id} 
                    icon={icon} 
                    bgColor={bgColor} 
                    title={activity.title} 
                    subtitle={activity.subtitle} 
                    time={formatTimeAgo(activity.timestamp)} 
                    onDelete={() => handleDeleteActivity(activity.id!)} 
                />
            );
        })}
        {activities.length === 0 && <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No recent activity.</p>}
      </div></div>
    </div>
  );
  
  const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-4 animate-fade-in h-full flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">This is a placeholder for the {title} screen. Full functionality will be implemented here soon.</p>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'parentStock': return <ParentStockView fishStock={fishStock} onAddFish={() => { setAddFishInitialData(undefined); setIsAddingFish(true); }} onSelectFish={handleSelectFish} onEditSpeciesSettings={setEditingSpecies} />;
      case 'fry': return <FryView fishStock={fishStock} onSelectFish={handleSelectFish} showInactiveFish={showInactiveFish} onEditSpeciesSettings={setEditingSpecies} />;
      case 'breeding': return <BreedingManagementView records={breedingRecords} onSelectRecord={handleSelectBreeding} onAddBreeding={() => setIsAddingBreeding(true)} fishStock={fishStock} />;
      case 'breedingDetail': 
        return selectedBreedingRecord ? (
          <BreedingDetailView record={selectedBreedingRecord} onUpdateStatus={handleUpdateBreedingStatus} onUpdateRecord={handleUpdateBreedingRecord} onAddFry={handleInitiateAddFry} fishStock={fishStock} />
        ) : <PlaceholderView title="Record not found" />;
      case 'fishStock': return <FishStockView fishStock={fishStock} onAddFish={() => { setAddFishInitialData(undefined); setIsAddingFish(true); }} onSelectFish={handleSelectFish} showInactiveFish={showInactiveFish} onEditSpeciesSettings={setEditingSpecies} onAddNewSpecies={handleAddNewSpecies} allSpecies={allSpecies} />;
      case 'fishDetail':
        return selectedFish ? (
            <FishDetailView fish={selectedFish} onUpdateFish={handleUpdateFish} onGenerateCertificate={handleViewCertificate} fishStock={fishStock} breedingRecords={breedingRecords} />
        ) : <PlaceholderView title="Fish not found"/>;
      case 'settings': return <SettingsView showInactive={showInactiveFish} onToggleInactive={handleToggleInactiveFish} notificationsEnabled={notificationsEnabled} onToggleNotifications={handleToggleNotifications} speciesSettings={speciesSettings} allSpecies={allSpecies} onEditSpeciesSettings={setEditingSpecies} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} onAddNewSpecies={handleAddNewSpecies} />;
      case 'certificates': return <CertificatesView certificates={certificates} fishStock={fishStock} onViewCertificate={handleViewCertificate} onNewCertificate={() => setIsSelectingFishForCert(true)} />;
      case 'performance': return <PerformanceView breedingRecords={breedingRecords} fishStock={fishStock} />;
      case 'inventory': return <InventoryView inventory={inventory} onUpdateItem={handleUpdateInventoryItem} onOpenAddItem={handleOpenAddItem} onOpenDeleteItem={handleOpenDeleteItem} />;
      case 'dietPlans': return <DietPlansView dietPlans={dietPlans} onOpenAdd={handleOpenAddDietPlan} onOpenEdit={handleOpenEditDietPlan} onOpenDelete={setDietPlanToDelete} />;
      case 'finance': return <FinanceView fishStock={fishStock} inventory={inventory} />;
      case 'about': return <AboutView />;
      case 'dashboard': default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B172E] text-gray-900 dark:text-white flex flex-col">
        
        {viewingCertificateForFishId && (
            <CertificateView
                fish={viewingFishForCert}
                mother={motherForCert}
                father={fatherForCert}
                onClose={() => setViewingCertificateForFishId(null)}
                farmName={userProfile.farmName}
            />
        )}
        {isAddingFish && <AddFishForm onClose={() => setIsAddingFish(false)} onSave={handleAddFish} existingSpecies={allSpecies} initialData={addFishInitialData} />}
        {isAddingBreeding && <AddBreedingForm onClose={() => setIsAddingBreeding(false)} onSave={handleAddBreeding} parentStock={fishStock.filter(f => f.status === 'Active')} />}
        {isNotificationViewOpen && <NotificationView notifications={notifications} onClose={() => setIsNotificationViewOpen(false)} onNotificationClick={handleNotificationClick} onDismiss={handleDismissNotification} />}
        {isSelectingFishForCert && <SelectFishForCertificateForm eligibleFish={fishStock.filter(f => f.status === 'Active')} onClose={() => setIsSelectingFishForCert(false)} onConfirm={handleConfirmCertSale} />}
        
        {isDietPlanFormOpen && (
            <AddDietPlanForm
                onSave={handleSaveDietPlan}
                onClose={handleCloseDietPlanForm}
                allSpecies={allSpecies}
                initialData={editingDietPlan}
                fishFeeds={fishFeeds}
            />
        )}
        {dietPlanToDelete && (
            <DietPlanConfirmationDialog
                plan={dietPlanToDelete}
                onConfirm={handleConfirmDeleteDietPlan}
                onCancel={() => setDietPlanToDelete(null)}
            />
        )}
        
        {isAddItemFormOpen && (
            <AddInventoryItemForm onSave={handleAddInventoryItem} onClose={handleCloseAddItem}/>
        )}
        {itemToDelete && (
            <InventoryConfirmationDialog item={itemToDelete} onConfirm={handleConfirmDeleteItem} onCancel={handleCloseDeleteItem} />
        )}
        
        {isAddingSpecies && (
            <SpeciesSettingsForm
                allSpecies={allSpecies}
                onSave={handleSaveSpeciesSettings}
                onClose={() => setIsAddingSpecies(false)}
            />
        )}
        {editingSpecies && (
            <SpeciesSettingsForm
                speciesToEdit={editingSpecies}
                settings={speciesSettings[editingSpecies]}
                allSpecies={allSpecies}
                onSave={handleSaveSpeciesSettings}
                onClose={() => setEditingSpecies(null)}
            />
        )}

        <div className="flex-shrink-0 w-full sticky top-0 z-20 backdrop-blur-sm bg-white/80 dark:bg-[#0B172E]/80 border-b border-gray-200 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto">
            <Header currentView={currentView} onBack={handleBack} notificationCount={notifications.length} onBellClick={() => setIsNotificationViewOpen(true)} onMenuClick={() => setIsMenuOpen(prev => !prev)} isMenuOpen={isMenuOpen} />
          </div>
        </div>
        {isMenuOpen && currentView === 'dashboard' && <div className="relative max-w-7xl mx-auto w-full"><DropdownMenu onSelect={handleMenuSelect} /></div>}
        
        <main className="flex-grow overflow-y-auto px-4 pb-24 relative w-full max-w-7xl mx-auto">
          {renderContent()}
        </main>
        <BottomNav activeTab={currentView} setActiveTab={setCurrentView} />
    </div>
  );
};

export default App;
