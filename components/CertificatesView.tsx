import React from 'react';
import { Fish } from '../App';
import { PlusIcon } from './Icons';

interface CertificatesViewProps {
    fishStock: Fish[];
    onViewCertificate: (fishId: string) => void;
    onNewCertificate: () => void;
}

const CertificatesView: React.FC<CertificatesViewProps> = ({ fishStock, onViewCertificate, onNewCertificate }) => {
    const issuedCertificates = fishStock.filter(f => f.status === 'Sold');

    return (
        <div className="animate-fade-in h-full p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Issued Certificates</h1>
                 <button
                    onClick={onNewCertificate}
                    className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold rounded-lg px-3 py-2 shadow-md transition-all active:scale-95 hover:shadow-lg"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>New Certificate</span>
                </button>
            </div>


            <div className="space-y-3 pb-20">
                {issuedCertificates.length > 0 ? (
                    issuedCertificates.map(fish => (
                        <div key={fish.id} className="bg-white dark:bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{fish.nickname || fish.id}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{fish.species} - Sold</p>
                            </div>
                            <button
                                onClick={() => onViewCertificate(fish.id)}
                                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-md px-3 py-1 transition-colors"
                            >
                                View/Print
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <p>No certificates have been issued.</p>
                        <p className="text-sm">Certificates can be generated for 'Bred' fish after they are marked as 'Sold'.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificatesView;