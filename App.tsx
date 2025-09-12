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
import { ParentFishIcon, FryIcon, BreedingIcon, EggsIcon, TotalParentFishIcon, SuccessIcon, FailureIcon, LogoIcon, InfoIcon, XIcon, TrashIcon, FinanceIcon, InventoryIcon, EyeIcon, EyeOffIcon } from './components/Icons';
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
import { db, UserAccount } from './db';

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


const initialFishStock: Fish[] = [
  { id: 'GUP-A01', species: 'Guppy', nickname: 'Zeus', dob: '2024-05-10', gender: 'Male', status: 'Active', healthHistory: [{ id: 1, date: '2024-06-15', type: 'Observation', notes: 'Vibrant colors, very active.' }], origin: 'Acquired' },
  { id: 'GUP-A02', species: 'Guppy', nickname: 'Hera', dob: '2024-05-10', gender: 'Female', status: 'Active', healthHistory: [], origin: 'Acquired' },
  { id: 'BET-B01', species: 'Betta', dob: '2024-03-22', gender: 'Male', status: 'Sold', salePrice: 25, saleDate: '2024-07-25', healthHistory: [], origin: 'Acquired' },
  { id: 'ANG-C01', species: 'Angelfish', dob: '2024-02-15', gender: 'Unknown', status: 'Dead', deathDate: '2024-07-15', causeOfDeath: 'Columnaris infection', healthHistory: [{ id: 1, date: '2024-07-10', type: 'Treatment', notes: 'Treated with Furan-2.' }], origin: 'Acquired' },
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

const defaultUserProfile: UserProfile = {
  farmName: 'Your Farm/Name',
  contact: '',
  email: '',
  profilePicture: undefined,
};

const defaultSpeciesSettings: SpeciesSettings = {
  'Guppy': { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 28 },
  'Betta': { incubationDays: 3, saleReadyDays: 90, breedingCooldownDays: 14 },
  'Angelfish': { incubationDays: 4, saleReadyDays: 60, breedingCooldownDays: 21 },
  'Cichlid': { incubationDays: 5, saleReadyDays: 75, breedingCooldownDays: 30 },
};

// Helper function moved outside the component to prevent re-creation on every render
const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^a-zA-Z0-9]/)) score++;

    const level = [
        { text: 'Weak', color: 'text-red-500', barColor: 'bg-red-500' },
        { text: 'Weak', color: 'text-red-500', barColor: 'bg-red-500' },
        { text: 'Fair', color: 'text-orange-500', barColor: 'bg-orange-500' },
        { text: 'Good', color: 'text-yellow-500', barColor: 'bg-yellow-500' },
        { text: 'Strong', color: 'text-green-500', barColor: 'bg-green-500' },
        { text: 'Strong', color: 'text-green-500', barColor: 'bg-green-500' },
    ][score] || { text: 'Weak', color: 'text-red-500', barColor: 'bg-red-500' };

    return { score, ...level };
};

// PasswordField component moved outside the main component to prevent re-creation on every render
const PasswordField: React.FC<{
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    label: string;
    id: string;
    isVisible: boolean;
    onToggleVisibility: () => void;
    strength?: { score: number; text: string; color: string; barColor: string; };
    showStrength?: boolean;
}> = ({ value, onChange, label, id, isVisible, onToggleVisibility, strength, showStrength = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <input 
                type={isVisible ? 'text' : 'password'}
                id={id}
                value={value} 
                onChange={onChange}
                required
                className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-sky-500 focus:outline-none" 
            />
            <button 
                type="button" 
                onClick={onToggleVisibility} 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={isVisible ? "Hide password" : "Show password"}
            >
                {isVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
        </div>
        {showStrength && value.length > 0 && strength && (
            <div className="flex items-center space-x-2 mt-1">
                <div className="flex-grow grid grid-cols-5 gap-1 h-1.5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`rounded-full ${i < strength.score ? strength.barColor : 'bg-gray-200 dark:bg-slate-600'}`}></div>
                    ))}
                </div>
                <span className={`text-xs font-semibold ${strength.color}`}>{strength.text}</span>
            </div>
        )}
    </div>
);


const AuthView: React.FC<{
    onLogin: (username: string, password: string) => Promise<string | null>;
    onSignUp: (username: string, password: string, farmName: string, contact: string, email: string) => Promise<string | null>;
    onCheckUsername: (username: string) => Promise<boolean>;
    onForgotPasswordRequest: (username: string, email: string, contact: string) => Promise<string | null>;
    onResetPassword: (username: string, newPassword: string) => Promise<string | null>;
}> = ({ onLogin, onSignUp, onCheckUsername, onForgotPasswordRequest, onResetPassword }) => {
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
    const [loginStep, setLoginStep] = useState<'username' | 'password'>('username');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [farmName, setFarmName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [usernameToReset, setUsernameToReset] = useState<string | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    
    // Calculate password strength here and pass it down as a prop
    const passwordStrength = getPasswordStrength(password);

    const clearState = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setFarmName('');
        setContact('');
        setEmail('');
        setError(null);
        setSuccess(null);
        setLoginStep('username');
        setIsPasswordVisible(false);
        setIsConfirmPasswordVisible(false);
    };
    
    const handleModeChange = (mode: 'login' | 'signup' | 'forgot') => {
        setAuthMode(mode);
        clearState();
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        const trimmedUsername = username.trim();
        const trimmedFarmName = farmName.trim();
        const trimmedContact = contact.trim();
        const trimmedEmail = email.trim();
        
        let errorMessage: string | null = null;
        
        switch (authMode) {
            case 'login':
                if (loginStep === 'username') {
                    if (!trimmedUsername) {
                        errorMessage = "Username cannot be empty.";
                    } else {
                        const userExists = await onCheckUsername(trimmedUsername);
                        if (userExists) {
                            setUsername(trimmedUsername);
                            setLoginStep('password');
                        } else {
                            errorMessage = "Username not found.";
                        }
                    }
                } else { // password step
                    if (!password.trim()) {
                        errorMessage = "Password cannot be empty.";
                    } else {
                        errorMessage = await onLogin(username, password);
                    }
                }
                break;
            case 'signup':
                {
                    if (!trimmedUsername || !password.trim() || !trimmedFarmName || !trimmedContact || !trimmedEmail) {
                        errorMessage = "All fields are required.";
                    } else if (passwordStrength.score < 2) {
                        errorMessage = "Password is too weak. Please choose a stronger one.";
                    } else {
                        errorMessage = await onSignUp(trimmedUsername, password, trimmedFarmName, trimmedContact, trimmedEmail);
                    }
                }
                break;
            case 'forgot':
                {
                    if (!trimmedUsername || !trimmedEmail || !trimmedContact) {
                        errorMessage = "All fields are required for verification.";
                    } else {
                        errorMessage = await onForgotPasswordRequest(trimmedUsername, trimmedEmail, trimmedContact);
                        if (!errorMessage) {
                            setUsernameToReset(trimmedUsername);
                            setAuthMode('reset');
                            setSuccess("Verification successful. Please set a new password.");
                        }
                    }
                }
                break;
            case 'reset':
                if (passwordStrength.score < 2) {
                     errorMessage = "Password is too weak.";
                } else if (password !== confirmPassword) {
                    errorMessage = "Passwords do not match.";
                } else if (usernameToReset) {
                    errorMessage = await onResetPassword(usernameToReset, password);
                    if (!errorMessage) {
                        handleModeChange('login');
                        setSuccess("Password reset successfully. You can now log in.");
                    }
                } else {
                    errorMessage = "An unexpected error occurred. Please try again.";
                }
                break;
        }

        if (errorMessage) {
            setError(errorMessage);
        }
        setIsLoading(false);
    };

    const renderFormContent = () => {
        switch (authMode) {
            case 'forgot':
                return {
                    title: "Forgot Password",
                    fields: (
                        <>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">Enter your details to verify your account.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Username</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Contact No.</label>
                                <input type="text" value={contact} onChange={e => setContact(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                            </div>
                        </>
                    ),
                    buttonText: "Verify",
                    footer: <button onClick={() => handleModeChange('login')} className="font-semibold text-sky-500 dark:text-sky-400 hover:underline">Back to Login</button>
                };
            case 'reset':
                 return {
                    title: "Reset Password",
                    fields: (
                        <>
                            <PasswordField
                                label="New Password"
                                id="new-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                isVisible={isPasswordVisible}
                                onToggleVisibility={() => setIsPasswordVisible(p => !p)}
                                showStrength
                                strength={passwordStrength}
                            />
                            <PasswordField
                                label="Confirm New Password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                isVisible={isConfirmPasswordVisible}
                                onToggleVisibility={() => setIsConfirmPasswordVisible(p => !p)}
                            />
                        </>
                    ),
                    buttonText: "Set New Password",
                    footer: null
                };
            case 'signup':
                 return {
                    title: "Create Account",
                    fields: (
                        <>
                           <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Farm/Breeder Name *</label>
                                <input type="text" value={farmName} onChange={(e) => setFarmName(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Contact *</label>
                                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email *</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Username *</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                            </div>
                            <PasswordField
                                label="Password *"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                isVisible={isPasswordVisible}
                                onToggleVisibility={() => setIsPasswordVisible(p => !p)}
                                showStrength
                                strength={passwordStrength}
                            />
                        </>
                    ),
                    buttonText: "Create Account",
                    footer: <>Already have an account? <button onClick={() => handleModeChange('login')} className="font-semibold text-sky-500 dark:text-sky-400 hover:underline ml-1">Login</button></>
                };
            default: // login
                if (loginStep === 'password') {
                     return {
                        title: "Enter Password",
                        fields: (
                            <>
                                <div className="text-center mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Logging in as</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <span className="font-semibold">{username}</span>
                                        <button type="button" onClick={() => { setPassword(''); setLoginStep('username'); setError(null); }} className="text-xs font-semibold text-sky-500 dark:text-sky-400 hover:underline">(Change)</button>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Password</label>
                                        <button type="button" onClick={() => handleModeChange('forgot')} className="text-xs font-semibold text-sky-500 dark:text-sky-400 hover:underline">Forgot Password?</button>
                                    </div>
                                    <PasswordField
                                        label=""
                                        id="login-password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        isVisible={isPasswordVisible}
                                        onToggleVisibility={() => setIsPasswordVisible(p => !p)}
                                    />
                                </div>
                            </>
                        ),
                        buttonText: "Login",
                        footer: <>Don't have an account? <button onClick={() => handleModeChange('signup')} className="font-semibold text-sky-500 dark:text-sky-400 hover:underline ml-1">Sign Up</button></>
                    };
                }
                // username step
                return {
                    title: "Login",
                    fields: (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Username</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none" autoFocus />
                            </div>
                        </>
                    ),
                    buttonText: "Next",
                    footer: <>Don't have an account? <button onClick={() => handleModeChange('signup')} className="font-semibold text-sky-500 dark:text-sky-400 hover:underline ml-1">Sign Up</button></>
                };
        }
    };

    const { title, fields, buttonText, footer } = renderFormContent();

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B172E] text-gray-900 dark:text-white flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20"><LogoIcon /></div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700/50">
                    <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
                    {error && <p className="bg-red-500/20 text-red-500 dark:text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}
                    {success && <p className="bg-green-500/20 text-green-500 dark:text-green-400 text-sm p-3 rounded-md mb-4">{success}</p>}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {fields}
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg py-2 shadow-md transition-all active:scale-95 hover:shadow-lg disabled:opacity-50">
                            {isLoading ? 'Processing...' : buttonText}
                        </button>
                    </form>
                    {footer && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">{footer}</p>}
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [appEntered, setAppEntered] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const [viewingCertificateForFishId, setViewingCertificateForFishId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [speciesSettings, setSpeciesSettings] = useState<SpeciesSettings>({});

  const loadAndSetDataForUser = async (user: UserAccount) => {
    const userId = user.id!;
    try {
      const fishCount = await db.fishStock.where({ userId }).count();
      if (fishCount === 0) {
        await db.transaction('rw', db.tables, async () => {
          const withUserId = (item: any) => ({ ...item, userId });
          await db.fishStock.bulkAdd(initialFishStock.map(withUserId));
          await db.breedingRecords.bulkAdd(initialBreedingRecords.map(withUserId));
          const initialActivitiesToSeed: Omit<Activity, 'id'>[] = [
            { type: 'new_parent', title: 'New Parent Stock Added', subtitle: 'Pair #12 - Guppies', timestamp: Date.now() - 2 * 3600 * 1000 },
            { type: 'fry_hatched', title: 'Fry batch #B007 hatched', subtitle: '250+ fry from Pair #09', timestamp: Date.now() - 24 * 3600 * 1000 },
            { type: 'eggs_laid', title: 'Pair #09 laid eggs', subtitle: 'Expected hatch: 2 days', timestamp: Date.now() - 3 * 24 * 3600 * 1000 },
          ];
          await db.activities.bulkAdd(initialActivitiesToSeed.map(withUserId));
          
          const userProfileExists = await db.appState.get([userId, 'userProfile']);
          if (!userProfileExists) {
              await db.appState.put({ userId, key: 'userProfile', value: defaultUserProfile });
          }

          await db.appState.put({ userId, key: 'speciesSettings', value: defaultSpeciesSettings });
          await db.appState.put({ userId, key: 'notificationsEnabled', value: true });
          await db.appState.put({ userId, key: 'showInactiveFish', value: true });
        });
      }
      
      const [fishes, records, inv, diets, profile, settings, notifsEnabled, showInactive, acts] = await Promise.all([
        db.fishStock.where({ userId }).toArray(),
        db.breedingRecords.where({ userId }).toArray(),
        db.inventory.where({ userId }).toArray(),
        db.dietPlans.where({ userId }).toArray(),
        db.appState.get([userId, 'userProfile']),
        db.appState.get([userId, 'speciesSettings']),
        db.appState.get([userId, 'notificationsEnabled']),
        db.appState.get([userId, 'showInactiveFish']),
        db.activities.where({ userId }).sortBy('timestamp').then(a => a.reverse().slice(0, 20))
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

    } catch (error) {
      console.error("Failed to load or initialize user database:", error);
      handleLogout(); // Log out if data fails to load
    }
  };

  const handleLoginSuccess = async (user: UserAccount) => {
    setIsLoading(true);
    setCurrentUser(user);
    localStorage.setItem('currentUserId', String(user.id!));
    await loadAndSetDataForUser(user);
    setIsLoading(false);
  };

  const findUserByUsernameRobustly = async (username: string): Promise<UserAccount | undefined> => {
      const trimmedUsername = username.trim();
      if (!trimmedUsername) return undefined;

      // Efficient path first: check for clean username
      let user = await db.userAccounts.where('username').equalsIgnoreCase(trimmedUsername).first();
      if (user) return user;

      // Robust path for dirty data (with untrimmed whitespace)
      const allUsers = await db.userAccounts.toArray();
      user = allUsers.find(u => u.username.trim().toLowerCase() === trimmedUsername.toLowerCase());
      return user;
  };

  const handleSignUp = async (username: string, password: string, farmName: string, contact: string, email: string): Promise<string | null> => {
    const trimmedUsername = username.trim();
    try {
        // Use a transaction to ensure all or nothing is written to the DB.
        const newUserId = await db.transaction('rw', db.userAccounts, db.appState, async () => {
            const existingUser = await db.userAccounts.where('username').equalsIgnoreCase(trimmedUsername).first();
            if (existingUser) {
                // Throwing an error aborts the transaction and can be caught outside.
                throw new Error('Username already exists.');
            }

            const newUserAccountData = { username: trimmedUsername, password };
            const id = await db.userAccounts.add(newUserAccountData);

            const newUserProfile: UserProfile = {
                farmName: farmName.trim(),
                contact: contact.trim(),
                email: email.trim(),
                profilePicture: undefined
            };
            await db.appState.put({ userId: id, key: 'userProfile', value: newUserProfile });
            
            return id;
        });

        // If transaction was successful, log the user in.
        const newUserForLogin: UserAccount = {
            id: newUserId,
            username: trimmedUsername,
            password
        };

        await handleLoginSuccess(newUserForLogin);
        return null; // Success
        
    } catch (error: any) {
        console.error("Sign up failed:", error);
        // Provide specific feedback if it's a known error.
        if (error.message === 'Username already exists.') {
            return error.message;
        }
        return 'An error occurred during sign up.';
    }
  };

  const handleLogin = async (username: string, password: string): Promise<string | null> => {
      try {
          const user = await findUserByUsernameRobustly(username);
          if (!user || user.password !== password) {
              return 'Invalid username or password.';
          }
          
          const trimmedUsername = username.trim();
          if (user.username !== trimmedUsername && user.id) {
              await db.userAccounts.update(user.id, { username: trimmedUsername });
              user.username = trimmedUsername;
          }

          await handleLoginSuccess(user);
          return null;
      } catch (error) {
          console.error("Login failed:", error);
          return 'An error occurred during login.';
      }
  };
  
  const handleCheckUsername = async (username: string): Promise<boolean> => {
    try {
        const user = await findUserByUsernameRobustly(username);
        return !!user;
    } catch (error) {
        console.error("Username check failed:", error);
        return false;
    }
  };
  
  const handleForgotPasswordRequest = async (username: string, email: string, contact: string): Promise<string | null> => {
    try {
        const user = await findUserByUsernameRobustly(username);
        if (!user || !user.id) {
            return "Username not found.";
        }
        const profileState = await db.appState.get([user.id, 'userProfile']);
        const profile = profileState?.value as UserProfile;

        if (!profile) {
            return "Profile data not found for this user.";
        }

        if (profile.email.toLowerCase().trim() !== email.toLowerCase().trim() || profile.contact.trim() !== contact.trim()) {
            return "The provided email or contact number does not match our records.";
        }
        
        return null; // Success
    } catch (error) {
        console.error("Forgot password request failed:", error);
        return "An error occurred during verification.";
    }
  };

  const handleResetPassword = async (username: string, newPassword: string): Promise<string | null> => {
    try {
        const user = await findUserByUsernameRobustly(username);
        if (!user || !user.id) {
            return "An error occurred. User not found.";
        }
        
        const trimmedUsername = username.trim();
        const updates: { password: string, username?: string } = { password: newPassword };
        if (user.username !== trimmedUsername) {
            updates.username = trimmedUsername;
        }
        await db.userAccounts.update(user.id, updates);

        return null; // Success
    } catch (error) {
        console.error("Password reset failed:", error);
        return "An error occurred while resetting the password.";
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
    setBreedingRecords([]);
    setFishStock([]);
    setInventory([]);
    setDietPlans([]);
    setUserProfile(defaultUserProfile);
    setSpeciesSettings({});
    setActivities([]);
    setCurrentView('dashboard');
  };

  useEffect(() => {
    const autoLogin = async () => {
        setIsLoading(true);
        const userIdStr = localStorage.getItem('currentUserId');
        if (userIdStr) {
            const user = await db.userAccounts.get(Number(userIdStr));
            if (user) {
                setCurrentUser(user);
                await loadAndSetDataForUser(user);
            }
        }
        setIsLoading(false);
    };
    if (appEntered) {
        autoLogin();
    }
  }, [appEntered]);
  
  useEffect(() => {
    const checkNotifications = () => {
      if (!notificationsEnabled || !currentUser) {
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
    if(!isLoading) checkNotifications();
    const intervalId = setInterval(checkNotifications, 60000);
    return () => clearInterval(intervalId);
  }, [breedingRecords, notificationsEnabled, fishStock, speciesSettings, inventory, dietPlans, isLoading, currentUser]);
  
  const addActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
      if (!currentUser) return;
      const newActivity: Activity = {
          ...activity,
          timestamp: Date.now()
      };
      try {
          const newId = await db.activities.add({ ...newActivity, userId: currentUser.id! });
          setActivities(prev => [{ ...newActivity, id: newId }, ...prev].slice(0, 20));
      } catch (error) {
          console.error("Failed to add activity:", error);
      }
  };

  const handleToggleNotifications = (enabled: boolean) => {
    if (!currentUser) return;
    setNotificationsEnabled(enabled);
    db.appState.put({ userId: currentUser.id!, key: 'notificationsEnabled', value: enabled });
  };
  
  const handleUpdateSpeciesSetting = (species: string, timeline: Partial<SpeciesTimeline>) => {
    if (!currentUser) return;
    const newSettings = {
        ...speciesSettings,
        [species]: {
            ...speciesSettings[species] || { incubationDays: 3, saleReadyDays: 30, breedingCooldownDays: 30 },
            ...timeline
        }
    };
    setSpeciesSettings(newSettings);
    db.appState.put({ userId: currentUser.id!, key: 'speciesSettings', value: newSettings });
  };

    const handleAddNewSpecies = () => {
        const currentAllSpecies = [...new Set([...fishStock.map(f => f.species), ...Object.keys(speciesSettings)])];
        const newSpeciesName = window.prompt("Enter the name for the new fish category:");
        if (newSpeciesName && newSpeciesName.trim() !== '') {
            const trimmedName = newSpeciesName.trim();
            if (currentAllSpecies.find(s => s.toLowerCase() === trimmedName.toLowerCase())) {
                alert(`Category "${trimmedName}" already exists.`);
                return;
            }
            handleUpdateSpeciesSetting(trimmedName, {});
        }
    };

  const handleUpdateProfile = (profile: UserProfile) => {
    if (!currentUser) return;
    setUserProfile(profile);
    db.appState.put({ userId: currentUser.id!, key: 'userProfile', value: profile });
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
    if (!currentUser) return;
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
    if (!currentUser) return;
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
    db.breedingRecords.put({ ...updatedRecord, userId: currentUser.id! });
    if(status === 'Successful' || status === 'Unsuccessful') setCurrentView('breeding');
  };

  const handleUpdateBreedingRecord = (updatedRecord: BreedingRecord) => {
    if (!currentUser) return;
    setBreedingRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    db.breedingRecords.put({ ...updatedRecord, userId: currentUser.id! });
  }

  const handleAddFish = (newFishPayload: NewFishPayload) => {
    if (!currentUser) return;
    const speciesCode = newFishPayload.species.trim().substring(0, 3).toUpperCase();
    const uniqueId = `${speciesCode}-${Date.now()}`;
    const newFish: Fish = {
      ...newFishPayload,
      id: uniqueId,
      origin: newFishPayload.motherId ? 'Bred' : 'Acquired',
    };
    setFishStock(prev => [...prev, newFish]);
    db.fishStock.add({ ...newFish, userId: currentUser.id! });
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
    if (!currentUser) return;
    const mother = fishStock.find(f => f.id === payload.motherId);
    if (!mother) return;

    const recordToAdd: Omit<BreedingRecord & { userId: number }, 'id'> = {
      ...payload,
      species: mother.species,
      userId: currentUser.id!,
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
    if (!currentUser) return;
    
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
    db.fishStock.put({ ...fishToUpdate, userId: currentUser.id! });
  };

  const handleMenuSelect = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  }

  const handleViewCertificate = (fishId: string) => {
    setViewingCertificateForFishId(fishId);
  };
  
  const handleConfirmCertSale = (fishId: string, price: number) => {
    const fish = fishStock.find(f => f.id === fishId);
    if (!fish) return;
    
    handleUpdateFish({ ...fish, status: 'Sold', salePrice: price });
    handleViewCertificate(fishId);
    setIsSelectingFishForCert(false);
  };

  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id' | 'purchaseDate'>) => {
    if (!currentUser) return;
    const newItem: InventoryItem = { 
        ...item, 
        id: `item-${Date.now()}`,
        purchaseDate: new Date().toISOString().split('T')[0]
    };
    db.inventory.add({ ...newItem, userId: currentUser.id! });
    setInventory(prev => [...prev, newItem]);
    addActivity({
        type: 'inventory_added',
        title: 'Inventory Updated',
        subtitle: `Added ${item.quantity} x ${item.name}`
    });
  }
  const handleUpdateInventoryItem = (item: InventoryItem) => {
    if (!currentUser) return;
    db.inventory.put({ ...item, userId: currentUser.id! });
    setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  }
  const handleDeleteInventoryItem = (itemId: string) => {
    if (!currentUser) return;
    db.inventory.delete(itemId);
    setInventory(prev => prev.filter(i => i.id !== itemId));
  }
  
  const handleAddDietPlan = async (plan: Omit<DietPlan, 'id'>) => {
    if (!currentUser) return;
    const newPlan = { ...plan, id: `diet-${Date.now()}` };
    try {
        await db.dietPlans.add({ ...newPlan, userId: currentUser.id! });
        setDietPlans(prev => [...prev, newPlan]);
    } catch (error) {
        console.error("Failed to add diet plan:", error);
        alert("Error: Could not save the new diet plan.");
    }
  };
  
  const handleUpdateDietPlan = async (plan: DietPlan) => {
      if (!currentUser) return;
      try {
          await db.dietPlans.put({ ...plan, userId: currentUser.id! });
          setDietPlans(prev => prev.map(p => (p.id === plan.id ? plan : p)));
      } catch (error) {
          console.error("Failed to update diet plan:", error);
          alert("Error: Could not update the diet plan.");
      }
  };

  const handleDeleteDietPlan = async (planId: string) => {
      if (!currentUser) return;
      try {
          await db.dietPlans.delete(planId);
          setDietPlans(prev => prev.filter(p => p.id !== planId));
      } catch (error) {
          console.error("Failed to delete diet plan:", error);
          alert("Error: Could not delete the diet plan.");
      }
  };

  const handleToggleInactiveFish = (show: boolean) => {
    if (!currentUser) return;
    setShowInactiveFish(show);
    db.appState.put({ userId: currentUser.id!, key: 'showInactiveFish', value: show });
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

  if (!appEntered) {
    return <LandingPage onEnter={() => setAppEntered(true)} />;
  }
  
  if (isLoading) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0B172E] flex items-center justify-center">
            <ParentFishIcon className="w-16 h-16 text-sky-500 animate-pulse" />
        </div>
    );
  }

  if (!currentUser) {
    return <AuthView 
        onLogin={handleLogin} 
        onSignUp={handleSignUp}
        onCheckUsername={handleCheckUsername}
        onForgotPasswordRequest={handleForgotPasswordRequest}
        onResetPassword={handleResetPassword}
    />;
  }

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
      case 'settings': return <SettingsView showInactive={showInactiveFish} onToggleInactive={handleToggleInactiveFish} notificationsEnabled={notificationsEnabled} onToggleNotifications={handleToggleNotifications} speciesSettings={speciesSettings} allSpecies={allSpecies} onUpdateSpeciesSetting={handleUpdateSpeciesSetting} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} onAddNewSpecies={handleAddNewSpecies} onLogout={handleLogout} currentUser={currentUser} />;
      case 'certificates': return <CertificatesView fishStock={fishStock} onViewCertificate={handleViewCertificate} onNewCertificate={() => setIsSelectingFishForCert(true)} />;
      case 'performance': return <PerformanceView breedingRecords={breedingRecords} fishStock={fishStock} />;
      case 'inventory': return <InventoryView inventory={inventory} onAddItem={handleAddInventoryItem} onUpdateItem={handleUpdateInventoryItem} onDeleteItem={handleDeleteInventoryItem} />;
      case 'dietPlans': return <DietPlansView dietPlans={dietPlans} allSpecies={allSpecies} onAdd={handleAddDietPlan} onUpdate={handleUpdateDietPlan} onDelete={handleDeleteDietPlan} fishFeeds={fishFeeds} />;
      case 'finance': return <FinanceView fishStock={fishStock} inventory={inventory} />;
      case 'about': return <AboutView userProfile={userProfile} />;
      case 'dashboard': default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B172E] text-gray-900 dark:text-white flex flex-col">
        
        {viewingFishForCert && (
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