interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  created_at: string;
}

declare global {
  var notificationsDatabase: Map<string, NotificationItem[]>;
}

if (!global.notificationsDatabase) {
  global.notificationsDatabase = new Map<string, NotificationItem[]>();
}

const notifications = global.notificationsDatabase;

export function getNotifications(userId: string): NotificationItem[] {
  return notifications.get(userId) || [];
}

export function addNotification(item: NotificationItem): NotificationItem {
  const list = notifications.get(item.userId) || [];
  list.unshift(item);
  notifications.set(item.userId, list.slice(0, 100));
  return item;
}

export function markAllRead(userId: string): number {
  const list = notifications.get(userId) || [];
  const updated = list.map((n) => ({ ...n, read: true }));
  notifications.set(userId, updated);
  return updated.length;
}
