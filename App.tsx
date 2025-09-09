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
import { ParentFishIcon, FryIcon, BreedingIcon, EggsIcon, TotalParentFishIcon, SuccessIcon, FailureIcon } from './components/Icons';
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
import LandingPage from './components/LandingPage';
import { useTheme } from './contexts/ThemeContext';
import SpeciesSettingsForm from './components/SpeciesSettingsForm';

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

const initialActivities = [
  { id: 1, icon: <ParentFishIcon className="w-5 h-5 text-white" />, bgColor: 'bg-blue-500', title: 'New Parent Stock Added', subtitle: 'Pair #12 - Guppies', time: '2h ago' },
  { id: 2, icon: <FryIcon className="w-5 h-5 text-white" />, bgColor: 'bg-green-500', title: 'Fry batch #B007 hatched', subtitle: '250+ fry from Pair #09', time: '1d ago' },
  { id: 3, icon: <EggsIcon className="w-5 h-5 text-white" />, bgColor: 'bg-purple-500', title: 'Pair #09 laid eggs', subtitle: 'Expected hatch: 2 days', time: '3d ago' },
];

const initialFishStock: Fish[] = [
  { id: 'GUP-A01', species: 'Guppy', nickname: 'Zeus', dob: '2024-05-10', gender: 'Male', status: 'Active', healthHistory: [{ id: 1, date: '2024-06-15', type: 'Observation', notes: 'Vibrant colors, very active.' }], origin: 'Acquired' },
  { id: 'GUP-A02', species: 'Guppy', nickname: 'Hera', dob: '2024-05-10', gender: 'Female', status: 'Active', healthHistory: [], origin: 'Acquired' },
  { id: 'BET-B01', species: 'Betta', dob: '2024-03-22', gender: 'Male', status: 'Sold', salePrice: 25, healthHistory: [], origin: 'Acquired' },
  { id: 'ANG-C01', species: 'Angelfish', dob: '2024-02-15', gender: 'Unknown', status: 'Dead', causeOfDeath: 'Columnaris infection', healthHistory: [{ id: 1, date: '2024-07-10', type: 'Treatment', notes: 'Treated with Furan-2.' }], origin: 'Acquired' },
  { id: 'ANG-C02', species: 'Angelfish', dob: '2024-02-15', gender: 'Unknown', status: 'Active', healthHistory: [], origin: 'Bred', motherId: 'ANG-P01', fatherId: 'ANG-P02', breedingId: 3 },
  { id: 'GUP-B05', species: 'Guppy', dob: '2024-07-22', gender: 'Unknown', status: 'Active', healthHistory: [], origin: 'Bred', motherId: 'GUP-A02', fatherId: 'GUP-A01', breedingId: 1 },
];

const initialBreedingRecords: BreedingRecord[] = [
    { id: 1, motherId: 'GUP-A02', fatherId: 'GUP-A01', species: 'Guppy', pairingDate: '2024-07-20', hatchDate: '2024-07-22', status: 'Successful', notes: 'First successful batch from this pair.', dietPlan: 'Baby brine shrimp twice daily.' },
    { id: 2, motherId: 'BET-P01', fatherId: 'BET-P02', species: 'Betta', pairingDate: '2024-07-18', eggsLaidDate: '2024-07-20', hatchDate: '2024-07-22', status: 'Hatched', notes: 'Vibrant colors expected.' },
    { id: 3, motherId: 'ANG-P01', fatherId: 'ANG-P02', species: 'Angelfish', pairingDate: '2024-07-15', eggsLaidDate: '2024-07-18', status: 'Eggs Laid', notes: 'Parents are very defensive.' },
    { id: 4, motherId: 'GUP-P03', fatherId: 'GUP-P04', species: 'Guppy', pairingDate: '2024-07-12', status: 'Unsuccessful', notes: 'Eggs were not viable.' },
    { id: 5, motherId: 'CIC-P01', fatherId: 'CIC-P02', species: 'Cichlid', pairingDate: '2024-07-21', status: 'Paired', notes: 'New pair, monitoring for compatibility.' },
];

const getStoredData = (key: string, defaultValue: any) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return defaultValue;
    }
}

const StandaloneCertificatePage: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const fishId = params.get('fishId');

    const fishStock: Fish[] = getStoredData('fishStock', []);
    const userProfile: UserProfile = getStoredData('userProfile', { farmName: 'Your Farm/Name' });
    const farmName = userProfile.farmName;


    const fish = fishStock.find(f => f.id === fishId);
    const mother = fishStock.find(f => f.id === fish?.motherId);
    const father = fishStock.find(f => f.id === fish?.fatherId);

    if (!fish) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-200">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600">Certificate Error</h1>
                    <p className="text-gray-700 mt-2">Could not find data for the requested fish. Please close this tab and try again from the app.</p>
                </div>
            </div>
        );
    }

    return <CertificateView fish={fish} mother={mother} father={father} onClose={() => window.close()} farmName={farmName} />;
}

const App: React.FC = () => {
  const [appEntered, setAppEntered] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activities, setActivities] = useState(initialActivities);
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>(() => getStoredData('breedingRecords', initialBreedingRecords));
  const [selectedBreedingId, setSelectedBreedingId] = useState<number | null>(null);
  const [fishStock, setFishStock] = useState<Fish[]>(() => getStoredData('fishStock', initialFishStock));
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

  const [inventory, setInventory] = useState<InventoryItem[]>(() => getStoredData('inventory', []));
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => getStoredData('dietPlans', []));
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getStoredData('userProfile', {
    farmName: 'Your Farm/Name',
    contact: '',
    email: '',
    profilePicture: undefined,
  }));
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });

  const [speciesSettings, setSpeciesSettings] = useState<SpeciesSettings>(() => {
    const defaultSettings: SpeciesSettings = {
        'Guppy': { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 28 },
        'Betta': { incubationDays: 3, saleReadyDays: 90, breedingCooldownDays: 14 },
        'Angelfish': { incubationDays: 4, saleReadyDays: 60, breedingCooldownDays: 21 },
        'Cichlid': { incubationDays: 5, saleReadyDays: 75, breedingCooldownDays: 30 },
    };
    return getStoredData('speciesSettings', defaultSettings);
  });

  useEffect(() => {
    localStorage.setItem('fishStock', JSON.stringify(fishStock));
  }, [fishStock]);
  useEffect(() => {
    localStorage.setItem('breedingRecords', JSON.stringify(breedingRecords));
  }, [breedingRecords]);
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('dietPlans', JSON.stringify(dietPlans));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [inventory, dietPlans, userProfile]);


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
          const settings = speciesSettings[record.species] || { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 30 };
  
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

  // FIX: Moved URL param check after all hooks to comply with Rules of Hooks.
  // This prevents an error when opening the certificate page in a new tab.
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'certificate') {
    return <StandaloneCertificatePage />;
  }
  
  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('notificationsEnabled', String(enabled));
  };
  
  const handleUpdateSpeciesSetting = (species: string, timeline: Partial<SpeciesTimeline>) => {
    const newSettings = {
        ...speciesSettings,
        [species]: {
            ...speciesSettings[species] || { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 30 },
            ...timeline
        }
    };
    setSpeciesSettings(newSettings);
    localStorage.setItem('speciesSettings', JSON.stringify(newSettings));
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
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
    setBreedingRecords(prev =>
      prev.map(record => {
        if (record.id === id) {
          const updatedRecord = { ...record, status };
          const today = new Date().toISOString().split('T')[0];
          if (status === 'Eggs Laid' && !updatedRecord.eggsLaidDate) updatedRecord.eggsLaidDate = today;
          if (status === 'Hatched' && !updatedRecord.hatchDate) updatedRecord.hatchDate = today;
          return updatedRecord;
        }
        return record;
      })
    );
    if(status === 'Successful' || status === 'Unsuccessful') setCurrentView('breeding');
  };

  const handleUpdateBreedingRecord = (updatedRecord: BreedingRecord) => {
    setBreedingRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
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
    setIsAddingFish(false);
    setAddFishInitialData(undefined);
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

  const handleAddBreeding = (payload: NewBreedingPayload) => {
    const mother = fishStock.find(f => f.id === payload.motherId);
    if (!mother) return;

    const newRecord: BreedingRecord = {
      ...payload,
      id: Date.now(),
      species: mother.species,
    }
    setBreedingRecords(prev => [newRecord, ...prev]);
    setIsAddingBreeding(false);
  }

  const handleUpdateFish = (updatedFish: Fish) => {
    setFishStock(prev => prev.map(fish => fish.id === updatedFish.id ? updatedFish : fish));
  };

  const handleMenuSelect = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  }

  const handleViewCertificate = (fishId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?view=certificate&fishId=${fishId}`;
    window.open(url, '_blank');
  };
  
  const handleConfirmCertSale = (fishId: string, price: number) => {
    const fish = fishStock.find(f => f.id === fishId);
    if (!fish) return;
    
    handleUpdateFish({ ...fish, status: 'Sold', salePrice: price });
    handleViewCertificate(fishId);
    setIsSelectingFishForCert(false);
  };

  if (!appEntered) {
    return <LandingPage onEnter={() => setAppEntered(true)} />;
  }

  const selectedBreedingRecord = breedingRecords.find(r => r.id === selectedBreedingId);
  const selectedFish = fishStock.find(f => f.id === selectedFishId);
  
  const allSpecies = [...new Set(fishStock.map(f => f.species))].sort();

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
        {activities.map(activity => (<ActivityItem key={activity.id} icon={activity.icon} bgColor={activity.bgColor} title={activity.title} subtitle={activity.subtitle} time={activity.time} onDelete={() => handleDeleteActivity(activity.id)} />))}
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
      case 'fishStock': return <FishStockView fishStock={fishStock} onAddFish={() => { setAddFishInitialData(undefined); setIsAddingFish(true); }} onSelectFish={handleSelectFish} showInactiveFish={showInactiveFish} onEditSpeciesSettings={setEditingSpecies} />;
      case 'fishDetail':
        return selectedFish ? (
            <FishDetailView fish={selectedFish} onUpdateFish={handleUpdateFish} onGenerateCertificate={handleViewCertificate} fishStock={fishStock} breedingRecords={breedingRecords} />
        ) : <PlaceholderView title="Fish not found"/>;
      case 'settings': return <SettingsView showInactive={showInactiveFish} onToggleInactive={setShowInactiveFish} notificationsEnabled={notificationsEnabled} onToggleNotifications={handleToggleNotifications} speciesSettings={speciesSettings} allSpecies={allSpecies} onUpdateSpeciesSetting={handleUpdateSpeciesSetting} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />;
      case 'certificates': return <CertificatesView fishStock={fishStock} onViewCertificate={handleViewCertificate} onNewCertificate={() => setIsSelectingFishForCert(true)} />;
      case 'performance': return <PerformanceView breedingRecords={breedingRecords} fishStock={fishStock} />;
      case 'inventory': return <InventoryView inventory={inventory} setInventory={setInventory} />;
      case 'dietPlans': return <DietPlansView dietPlans={dietPlans} setDietPlans={setDietPlans} allSpecies={allSpecies} />;
      case 'finance': return <FinanceView fishStock={fishStock} inventory={inventory} />;
      case 'about': return <AboutView />;
      case 'dashboard': default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B172E] text-gray-900 dark:text-white flex flex-col">
        
        {isAddingFish && <AddFishForm onClose={() => setIsAddingFish(false)} onSave={handleAddFish} existingSpecies={[...new Set(fishStock.map(f => f.species))]} initialData={addFishInitialData} />}
        {isAddingBreeding && <AddBreedingForm onClose={() => setIsAddingBreeding(false)} onSave={handleAddBreeding} parentStock={fishStock.filter(f => f.status === 'Active')} />}
        {isNotificationViewOpen && <NotificationView notifications={notifications} onClose={() => setIsNotificationViewOpen(false)} onNotificationClick={handleNotificationClick} onDismiss={handleDismissNotification} />}
        {isSelectingFishForCert && <SelectFishForCertificateForm eligibleFish={fishStock.filter(f => f.status === 'Active')} onClose={() => setIsSelectingFishForCert(false)} onConfirm={handleConfirmCertSale} />}
        {editingSpecies && (
            <SpeciesSettingsForm
                species={editingSpecies}
                settings={speciesSettings[editingSpecies] || { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 30 }}
                onSave={(timeline) => {
                    handleUpdateSpeciesSetting(editingSpecies, timeline);
                    setEditingSpecies(null);
                }}
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