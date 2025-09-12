import React, { useState, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { SpeciesSettings, UserProfile } from '../App';
import { CameraIcon, ParentFishIcon, PlusIcon, EditIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsViewProps {
  showInactive: boolean;
  onToggleInactive: (show: boolean) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  speciesSettings: SpeciesSettings;
  allSpecies: string[];
  onEditSpeciesSettings: (species: string) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onAddNewSpecies: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
    showInactive, 
    onToggleInactive, 
    notificationsEnabled, 
    onToggleNotifications,
    allSpecies,
    onEditSpeciesSettings,
    userProfile,
    onUpdateProfile,
    onAddNewSpecies,
}) => {
    const { theme, setTheme } = useTheme();
    const [profile, setProfile] = useState(userProfile);
    const [isEditingProfile, setIsEditingProfile] = useState(() => {
        return userProfile.farmName === 'Your Farm/Name' || !userProfile.farmName;
    });

    useEffect(() => {
        setProfile(userProfile);
        if (userProfile.farmName === 'Your Farm/Name' || !userProfile.farmName) {
            setIsEditingProfile(true);
        }
    }, [userProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile(prev => ({ ...prev, profilePicture: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSaveProfile = () => {
        onUpdateProfile(profile);
        setIsEditingProfile(false);
    };
    
    const handleCancelEdit = () => {
        setProfile(userProfile); // Reset changes
        if (userProfile.farmName !== 'Your Farm/Name' && userProfile.farmName) {
            setIsEditingProfile(false);
        }
    }

  return (
    <div className="animate-fade-in h-full p-2 pb-20">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mb-4">
        {isEditingProfile ? (
             <div>
                <h2 className="text-xl font-bold mb-3">Edit Profile</h2>
                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <img 
                            src={profile.profilePicture || undefined}
                            alt="Profile Preview" 
                            className="w-full h-full rounded-full object-cover bg-gray-200 dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600" 
                        />
                         {!profile.profilePicture && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ParentFishIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                        <label htmlFor="profile-pic" className="absolute -bottom-1 -right-1 bg-sky-600 rounded-full p-1.5 cursor-pointer hover:bg-sky-500 transition-colors border-2 border-white dark:border-slate-800">
                            <CameraIcon className="w-4 h-4 text-white" />
                        </label>
                        <input id="profile-pic" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                    <div className="flex-grow">
                        <label htmlFor="farmName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Farm/Breeder Name</label>
                        <input type="text" id="farmName" name="farmName" value={profile.farmName} onChange={handleInputChange} className="w-full text-sm bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-1 focus:ring-sky-500 focus:outline-none" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Contact Details</label>
                        <input type="text" id="contact" name="contact" value={profile.contact} onChange={handleInputChange} placeholder="e.g., +1 234 567 890" className="w-full text-sm bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-1 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={profile.email} onChange={handleInputChange} placeholder="e.g., name@farm.com" className="w-full text-sm bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-1 focus:ring-sky-500 focus:outline-none" />
                    </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button onClick={handleCancelEdit} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSaveProfile} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700">
                        Save Profile
                    </button>
                </div>
            </div>
        ) : (
            <div>
                 <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Profile</h2>
                    <button onClick={() => setIsEditingProfile(true)} className="flex items-center space-x-1.5 text-sm font-semibold text-sky-500 dark:text-sky-400 p-2 -my-2 -mr-2 rounded-lg hover:bg-sky-500/10 transition-colors">
                        <EditIcon className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <img 
                            src={profile.profilePicture || undefined} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover bg-gray-200 dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600" 
                        />
                        {!profile.profilePicture && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ParentFishIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                    </div>
                    <div className="flex-grow space-y-0.5">
                        <p className="text-lg font-bold">{profile.farmName}</p>
                        {profile.contact && <p className="text-sm text-gray-500 dark:text-gray-400">{profile.contact}</p>}
                        {profile.email && <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>}
                    </div>
                </div>
            </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 space-y-4 divide-y divide-gray-200 dark:divide-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Dark Mode</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes.</p>
          </div>
          <ToggleSwitch checked={theme === 'dark'} onChange={(isDark) => setTheme(isDark ? 'dark' : 'light')} />
        </div>
        <div className="flex justify-between items-center pt-4">
          <div>
            <h2 className="font-semibold">Show Sold & Dead Fish</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Display fish marked as sold or dead in your stock list.</p>
          </div>
          <ToggleSwitch checked={showInactive} onChange={onToggleInactive} />
        </div>
         <div className="flex justify-between items-center pt-4">
          <div>
            <h2 className="font-semibold">Enable Breeding Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get alerts for key breeding events like hatching.</p>
          </div>
          <ToggleSwitch checked={notificationsEnabled} onChange={onToggleNotifications} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mt-4">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Species Timelines</h2>
            <button
                onClick={onAddNewSpecies}
                className="flex items-center space-x-1 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg px-3 py-1 transition-colors"
                aria-label="Add new species category"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New</span>
            </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Set custom notification timers for each species.</p>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {allSpecies.length > 0 ? allSpecies.map(species => {
                return (
                    <div key={species} className="p-3 bg-gray-100 dark:bg-slate-900/50 rounded-lg flex justify-between items-center">
                        <h3 className="font-semibold">{species}</h3>
                        <button 
                            onClick={() => onEditSpeciesSettings(species)}
                            className="flex items-center space-x-1.5 text-sm font-semibold text-sky-500 dark:text-sky-400 p-2 -my-2 -mr-2 rounded-lg hover:bg-sky-500/10 transition-colors"
                        >
                            <EditIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    </div>
                )
            }) : <p className="text-sm text-center text-gray-500 py-4">Add fish to your stock to set species timelines.</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;