
import React, { useState, useEffect } from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'community' | 'system' | 'emergency';
  read: boolean;
  timestamp: Date;
}

const NotificationIcon: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const mockNotifications: Notification[] = [
        {
          id: 1,
          message: "New accessible place added near you",
          type: 'system',
          read: false,
          timestamp: new Date()
        },
        {
          id: 2,
          message: "Community tip: Great wheelchair accessible restaurant downtown",
          type: 'community',
          read: false,
          timestamp: new Date(Date.now() - 3600000)
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '4px'
        }}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <img 
          src="/assets/icons/notification.svg" 
          alt="Notifications" 
          width={28}
          style={{ filter: 'invert(0.3)' }}
        />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#e53935',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            minWidth: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Notifications</h3>
          </div>
          
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  background: notification.read ? 'white' : '#f8f9fa',
                  cursor: 'pointer'
                }}
                onClick={() => markAsRead(notification.id)}
              >
                <div style={{ 
                  fontWeight: notification.read ? 'normal' : 'bold',
                  fontSize: '14px',
                  marginBottom: '4px'
                }}>
                  {notification.message}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;