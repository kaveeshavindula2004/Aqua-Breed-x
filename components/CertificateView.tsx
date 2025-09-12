import React from 'react';
import { Fish } from '../App';
import { LogoIcon, ParentFishIcon, PrintIcon, XIcon } from './Icons';

interface CertificateViewProps {
  fish: Fish;
  mother?: Fish;
  father?: Fish;
  onClose: () => void;
  farmName: string;
}

const CertificateView: React.FC<CertificateViewProps> = ({ fish, mother, father, onClose, farmName }) => {
    const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 font-sans animate-fade-in">
      <div id="certificate-container" className="relative bg-white w-full max-w-4xl text-gray-800 shadow-2xl flex flex-col">
        {/* Main Certificate Content */}
        <div id="certificate-view" className="relative w-full aspect-[297/210] overflow-hidden bg-white p-6 md:p-8">
            {/* Background Graphics */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <svg className="absolute -top-12 left-0 w-full h-auto text-[#0B172E]" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="0.9" d="M0,224L80,208C160,192,320,160,480,149.3C640,139,800,149,960,170.7C1120,192,1280,224,1360,240L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
                <svg className="absolute -top-20 left-0 w-full h-auto text-[#43A4B2]" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="0.8" d="M0,192L80,170.7C160,149,320,107,480,112C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
                <svg className="absolute -bottom-24 left-0 w-full h-auto text-[#0B172E]" viewBox="0 0 1440 320" transform="scale(1, -1)"><path fill="currentColor" fillOpacity="0.9" d="M0,224L80,208C160,192,320,160,480,149.3C640,139,800,149,960,170.7C1120,192,1280,224,1360,240L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
                <svg className="absolute -bottom-28 left-0 w-full h-auto text-[#43A4B2]" viewBox="0 0 1440 320" transform="scale(1, -1)"><path fill="currentColor" fillOpacity="0.8" d="M0,192L80,170.7C160,149,320,107,480,112C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
            </div>
            
            <div className="relative z-10 flex flex-col h-full w-full">
                <header className="flex justify-between items-start w-full">
                    <div className="relative">
                        <svg width="200" height="240" viewBox="0 0 150 180" className="absolute -top-6 -left-8">
                            <path d="M0 0 L150 0 L150 160 L75 180 L0 160 Z" fill="#0B172E" />
                            <path d="M5 5 L145 5 L145 157 L75 174 L5 157 Z" fill="none" stroke="white" strokeWidth="2" />
                        </svg>
                        <div className="relative w-[150px] h-[180px] flex flex-col items-center justify-center text-white pl-4">
                            <div className="w-24 h-24">
                                <LogoIcon />
                            </div>
                            <h2 className="text-xl font-bold tracking-wider mt-2">AQUA BREED</h2>
                        </div>
                    </div>

                    <div className="flex-grow" />

                    <div className="w-48 h-48 rounded-full bg-slate-100 overflow-hidden border-8 border-white shadow-lg flex-shrink-0 -mr-4">
                        {fish.photo ? (
                            <img src={fish.photo} alt={fish.nickname || fish.id} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <ParentFishIcon className="w-2/3 h-2/3 text-gray-400" />
                            </div>
                        )}
                    </div>
                </header>
                
                <main className="flex-grow flex flex-col items-center justify-center text-center -mt-8">
                    <h1 className="text-5xl md:text-6xl font-bold text-[#0B172E] tracking-wider">CERTIFICATE</h1>
                    <p className="text-2xl md:text-3xl text-gray-500 font-light tracking-widest mt-1">OF ORIGIN</p>
                    <p className="text-gray-600 max-w-md mt-6 text-sm">This certificate confirms that the above fish was bred and raised by</p>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#0B172E] mt-2">{farmName}</h3>
                    <p className="text-xl md:text-2xl font-mono text-gray-700 mt-1 tracking-wide">[ {fish.id} ]</p>
                </main>

                <footer className="flex justify-between items-end w-full text-xs md:text-sm text-gray-700">
                    <div className="space-y-1">
                        <p><span className="font-bold">Born on:</span> {fish.dob || 'Unknown'}</p>
                        <p><span className="font-bold">Variety:</span> {fish.species}</p>
                        <p><span className="font-bold">Gender:</span> {fish.gender}</p>
                    </div>
                    {fish.origin === 'Bred' && (
                         <div className="space-y-1 text-right">
                            <p><span className="font-bold">Father (Sire):</span> {father?.nickname || father?.id || 'Unknown'}</p>
                            <p><span className="font-bold">Mother (Dam):</span> {mother?.nickname || mother?.id || 'Unknown'}</p>
                        </div>
                    )}
                    <div className="self-end text-right">
                        <div className="inline-block border-t-2 border-gray-600 w-48 pt-1 text-center">
                            <p className="text-xs">{farmName}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>

        <div className="no-print flex justify-end space-x-3 p-3 bg-gray-100 dark:bg-slate-900 rounded-b-lg">
            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg px-4 py-2 transition-colors flex items-center space-x-2">
                <XIcon className="w-5 h-5"/>
                <span>Close</span>
            </button>
            <button onClick={handlePrint} className="bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg flex items-center space-x-2">
                <PrintIcon className="w-5 h-5"/>
                <span>Print</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;