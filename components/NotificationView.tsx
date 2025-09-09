import React from 'react';
import { AppNotification } from '../App';
import { CheckCircleIcon, InfoIcon, XIcon } from './Icons';

interface NotificationViewProps {
  notifications: AppNotification[];
  onClose: () => void;
  onDismiss: (id: string) => void;
  onNotificationClick: (notification: AppNotification) => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({ notifications, onClose, onDismiss, onNotificationClick }) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#101f3c] rounded-2xl w-full max-w-sm max-h-[90vh] text-gray-900 dark:text-white shadow-lg border border-gray-300 dark:border-slate-700 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 space-y-3 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => {
              const isSuccess = notification.type === 'success';
              const Icon = isSuccess ? CheckCircleIcon : InfoIcon;
              const iconColor = isSuccess ? 'text-green-500 dark:text-green-400' : 'text-sky-500 dark:text-sky-400';

              return (
                <div key={notification.id} className="bg-gray-100 dark:bg-slate-800/50 rounded-lg flex items-start space-x-3 p-3">
                  <div className="flex-shrink-0 pt-1">
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-grow cursor-pointer" onClick={() => onNotificationClick(notification)}>
                    <p className="text-sm font-semibold">{notification.message}</p>
                  </div>
                  <button onClick={() => onDismiss(notification.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 flex-shrink-0">
                    <XIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <p>You have no new notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationView;