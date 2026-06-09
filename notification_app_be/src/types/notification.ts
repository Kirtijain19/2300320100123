// Types for the priority inbox feature

export interface ExternalNotification {
  ID: string;
  Type: string; // 'Placement' | 'Result' | 'Event' (case-insensitive mapping)
  Message: string;
  Timestamp: string; // e.g. '2026-04-22 17:51:18'
  [key: string]: unknown;
}

export interface PriorityNotification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}
