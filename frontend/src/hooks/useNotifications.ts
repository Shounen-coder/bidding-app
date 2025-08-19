import { useState, useCallback } from 'react';
import { type NotificationProps } from '../components/auction/NotificationToast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationProps = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Utility functions for common notification types
  const notifySuccess = useCallback((title: string, message: string, actions?: NotificationProps['actions']) => {
    return addNotification({
      type: 'success',
      title,
      message,
      actions,
      duration: 4000
    });
  }, [addNotification]);

  const notifyWarning = useCallback((title: string, message: string, actions?: NotificationProps['actions']) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      actions,
      duration: 6000
    });
  }, [addNotification]);

  const notifyError = useCallback((title: string, message: string, actions?: NotificationProps['actions']) => {
    return addNotification({
      type: 'error',
      title,
      message,
      actions,
      duration: 8000
    });
  }, [addNotification]);

  const notifyInfo = useCallback((title: string, message: string, actions?: NotificationProps['actions']) => {
    return addNotification({
      type: 'info',
      title,
      message,
      actions,
      duration: 5000
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notifySuccess,
    notifyWarning,
    notifyError,
    notifyInfo
  };
};
