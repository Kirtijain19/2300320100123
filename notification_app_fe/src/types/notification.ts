export type NotificationType = 'Placement' | 'Result' | 'Event' | string;

export interface NotificationItem {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationApiResponse {
  notifications: NotificationItem[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface PriorityNotification extends NotificationItem {
  priorityWeight: number;
}
