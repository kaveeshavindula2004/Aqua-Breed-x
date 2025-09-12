import React from 'react';
import { ParentFishIcon } from './Icons';
import { UserProfile } from '../App';

interface AboutViewProps {
    userProfile: UserProfile;
}

const AboutView: React.FC<AboutViewProps> = ({ userProfile }) => {
  return (
    <div className="animate-fade-in h-full p-2">
      <h1 className="text-2xl font-bold mb-6">About</h1>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 flex flex-col items-center text-center">
        <div className="relative w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700 border-4 border-slate-200 dark:border-slate-600 mb-4 flex items-center justify-center p-3">
            {userProfile.profilePicture ? (
                <img src={userProfile.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
                <ParentFishIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
            )}
        </div>
        <h2 className="text-2xl font-bold">{userProfile.farmName}</h2>
        
        <div className="border-t border-gray-200 dark:border-slate-700 w-full my-6"></div>

        <div className="space-y-3 text-left self-stretch">
            {userProfile.contact ? (
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Contact</h3>
                    <a href={`tel:${userProfile.contact}`} className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">{userProfile.contact}</a>
                </div>
            ) : null }
             {userProfile.email ? (
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email</h3>
                    <a href={`mailto:${userProfile.email}`} className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">{userProfile.email}</a>
                </div>
             ) : null }
             {(!userProfile.contact && !userProfile.email) && (
                <p className="text-sm text-center text-gray-500">No contact information provided. Visit Settings to add details.</p>
             )}
        </div>
      </div>
       <div className="text-center mt-6 text-gray-500 dark:text-gray-400 text-xs">
          <p>App developed by Kaveesha Vindula.</p>
      </div>
    </div>
  );
};

export default AboutView;