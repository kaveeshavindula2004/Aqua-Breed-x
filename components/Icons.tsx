import React from 'react';

type IconProps = {
  className?: string;
};

export const MenuIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);


export const BellIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g>
      <path fill="#4A90E2" d="M60.2,9.1c-8,0-15.5,3.3-20.9,8.7c3.9,2.8,8.2,4.8,12.8,5.8c11,2.5,19.6,9.9,23.3,20.4c2,5.7,2.2,11.8,0.7,17.5c4.6-2,8.9-4.8,12.7-8.2c-2.9-8.1-7.8-15.3-14.2-21.2C81.8,19.9,71.4,12.9,60.2,9.1z"/>
      <path fill="#4A90E2" d="M90.9,39.8c0,8-3.3,15.5-8.7,20.9c-2.8,3.9-4.8,8.2-5.8,12.8c-2.5,11-9.9,19.6-20.4,23.3c-5.7,2-11.8,2.2-17.5,0.7c2,4.6,4.8,8.9,8.2,12.7c8.1-2.9,15.3-7.8,21.2-14.2c9.8-9.8,16.8-20.2,20.6-31.4C93.4,66.4,94.2,53.2,90.9,39.8z"/>
      <path fill="#4A90E2" d="M39.8,90.9c8,0,15.5-3.3,20.9-8.7c-3.9-2.8-8.2-4.8-12.8-5.8c-11-2.5-19.6-9.9-23.3-20.4c-2-5.7-2.2-11.8-0.7-17.5c-4.6,2-8.9,4.8-12.7,8.2c2.9,8.1,7.8,15.3,14.2,21.2C32.2,84.1,42.6,91.1,53.8,94.9C50.2,93.4,45,92.6,39.8,90.9z"/>
      <path fill="#4A90E2" d="M9.1,60.2c0-8,3.3-15.5,8.7-20.9c2.8-3.9,4.8-8.2,5.8-12.8c2.5-11,9.9-19.6,20.4-23.3c5.7-2,11.8-2.2,17.5-0.7c-2-4.6-4.8-8.9-8.2-12.7c-8.1,2.9-15.3-7.8-21.2,14.2C22.2,19.9,15.2,30.3,11.4,41.5C8.9,54.7,9.7,67.9,13.1,81.3C11.5,74.5,10.6,67.4,9.1,60.2z"/>

      <path fill="#50E3C2" d="M81.3,13.1c-13.4-3.4-26.6-2.6-39.8,2.8C30.3,22.2,19.9,29.2,9.1,39.8c-6.8,6.8-11.3,15.2-13.1,24.5c4.6-2,8.9-4.8,12.7-8.2c-2.9-8.1-2.2-16.9,2-24.5c5.3-9.5,14.4-15.9,25.1-17.4C46.8,13,56.5,14.4,64.9,20.1C72.8,25.4,78.2,33.5,79.5,42.9C83.2,39.2,87.6,36.1,92.2,33.7C88.9,25.9,85.5,19.1,81.3,13.1z"/>
      <path fill="#50E3C2" d="M86.9,81.3c3.4-13.4,2.6-26.6-2.8-39.8c-6.3-11.2-13.3-21.6-23.1-31.4c-6.8-6.8-15.2-11.3-24.5-13.1c2,4.6,4.8,8.9,8.2,12.7c8.1,2.9,16.9,2.2,24.5-2c9.5-5.3,15.9-14.4,17.4-25.1c1.5-10.9-1.4-22.3-8.6-30.7c3.7,3.7,6.8,7.9,9.2,12.4C90.2,19.3,92.5,29,91.7,38.9C90.3,53.4,81.6,66.5,68.6,72.9C74.1,75.4,79.1,78.5,83.5,82.3C85.5,84.1,86.9,82.7,86.9,81.3z"/>
      <path fill="#50E3C2" d="M18.7,86.9c13.4,3.4,26.6,2.6,39.8-2.8c11.2-6.3,21.6-13.3,31.4-23.1c6.8-6.8,11.3-15.2,13.1-24.5c-4.6,2-8.9,4.8-12.7,8.2c2.9,8.1,2.2,16.9-2,24.5c-5.3,9.5-14.4,15.9-25.1,17.4c-10.9,1.5-22.3-1.4-30.7-8.6c-5.3-4.5-8.8-10.5-10.1-17.1C5.1,51.8,3,41.9,4.2,31.9C0.5,35.6,-3.1,39.7,-6,44.4C-2.2,56,1,67,6,76.5C9.7,82.1,14,85.6,18.7,86.9z"/>
      <path fill="#50E3C2" d="M13.1,18.7c-3.4,13.4-2.6,26.6,2.8,39.8c6.3,11.2,13.3,21.6,23.1,31.4c6.8-6.8,15.2-11.3,24.5,13.1c-2-4.6-4.8-8.9-8.2-12.7c-8.1-2.9-16.9-2.2-24.5,2c-9.5,5.3-15.9-14.4-17.4,25.1c-1.5,10.9,1.4,22.3,8.6,30.7c-3.7-3.7-6.8-7.9-9.2-12.4c-3.9-7.2-6.2-14.9-7-24.8c-1.4-14.5,4.3-28.9,15.5-39.2C19,29.1,23.3,23.4,28.2,18.8C24.5,15.1,20.1,12,15.5,9.6C14.5,12.7,13.8,15.7,13.1,18.7z"/>
    </g>
    <g transform="translate(50,50) scale(0.6)" stroke="#4A90E2" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0,0 a35,35 0 1 0 0.1,0 Z"/>
      <path d="M-2,23.5 C-2,23.5 14.5,16.7 19.4,0.1 C19.4,0.1 11.2,-15.9 -1.7,-19.1"/>
      <path d="M-2.2,-25.3 C-2.2,-25.3 -16.8,-19.8 -19.5,-0.6 C-19.5,-0.6 -12.8,17 -2.2,20.4"/>
      <circle cx="-20.8" cy="-8" r="2.5" fill="#4A90E2" stroke="none"/>
    </g>
  </svg>
);

export const ParentFishIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 10.5C18.5 10.5 21 12 21 14.5C21 17 18.5 18.5 16.5 18.5C14.5 18.5 12 17 12 14.5C12 12 14.5 10.5 16.5 10.5Z" />
        <path d="M12 14.5C12 14.5 8 18.5 3 14.5C3 10.5 8 10.5 12 14.5Z" />
    </svg>
);

export const FryIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11C10 11 11.5 11.5 11.5 12.5C11.5 13.5 10 14 9 14C8 14 6.5 13.5 6.5 12.5C6.5 11.5 8 11 9 11Z" />
        <path d="M6.5 12.5C6.5 12.5 4 14.5 2 12.5C2 10.5 4 10.5 6.5 12.5Z" />
        <path d="M15 7C16 7 17.5 7.5 17.5 8.5C17.5 9.5 16 10 15 10C14 10 12.5 9.5 12.5 8.5C12.5 7.5 14 7 15 7Z" />
        <path d="M12.5 8.5C12.5 8.5 10 10.5 8 8.5C8 6.5 10 6.5 12.5 8.5Z" />
        <path d="M18 15C19 15 20.5 15.5 20.5 16.5C20.5 17.5 19 18 18 18C17 18 15.5 17.5 15.5 16.5C15.5 15.5 17 15 18 15Z" />
        <path d="M15.5 16.5C15.5 16.5 13 18.5 11 16.5C11 14.5 13 14.5 15.5 16.5Z" />
    </svg>
);

export const BreedingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12c-3.333-3.333-6.667-3.333-10 0" />
        <path d="M21 18c0-3.333-1.667-5-5-5" />
        <path d="M3 6c0 3.333 1.667 5 5 5" />
        <path d="M9 12c3.333 3.333 6.667 3.333 10 0" />
        <path d="M11 7L9 5" />
        <path d="M13 17L15 19" />
    </svg>
);

export const EggsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="16" r="2" />
        <circle cx="12" cy="11" r="2" />
        <circle cx="16" cy="16" r="2" />
        <circle cx="12" cy="17" r="1.5" />
    </svg>
);

export const TotalParentFishIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 10.5C18.5 10.5 21 12 21 14.5C21 17 18.5 18.5 16.5 18.5C14.5 18.5 12 17 12 14.5C12 12 14.5 10.5 16.5 10.5Z" />
    <path d="M12 14.5C12 14.5 8 18.5 3 14.5C3 10.5 8 10.5 12 14.5Z" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export const SuccessIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export const FailureIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

export const BackIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

export const XIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const PrintIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export const CertificateIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
);

export const InventoryIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="21 8 21 21 3 21 3 8"></polyline>
        <rect x="1" y="3" width="22" height="5"></rect>
        <line x1="10" y1="12" x2="14" y2="12"></line>
    </svg>
);

export const DietPlanIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
);

export const FinanceIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

export const HeartbeatIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);