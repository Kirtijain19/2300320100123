import { NotificationApiResponse, NotificationItem, PriorityNotification } from '../types/notification';

const BASE_URL = 'http://4.224.186.213/evaluation-service/notifications';
const VIEWED_STORAGE_KEY = 'campus-notifications:viewed';

const TYPE_PRIORITY: Record<string, number> = {
  placement: 3,
  result: 2,
  event: 1
};

function normalizeType(value: string): string {
  return value.trim().toLowerCase();
}

function parseTimestamp(timestamp: string): number {
  const parsed = Date.parse(timestamp.replace(' ', 'T'));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getViewedIds(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VIEWED_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(parsed);
  } catch {
    return new Set<string>();
  }
}

export function setViewedIds(ids: Set<string>): void {
  window.localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify([...ids]));
}

export function markViewed(id: string): Set<string> {
  const viewed = getViewedIds();
  viewed.add(id);
  setViewedIds(viewed);
  return viewed;
}

export function isViewed(id: string): boolean {
  return getViewedIds().has(id);
}

export function getPriorityWeight(type: string): number {
  return TYPE_PRIORITY[normalizeType(type)] ?? 0;
}

export function sortByPriority(items: NotificationItem[]): PriorityNotification[] {
  return [...items]
    .map((item) => ({ ...item, priorityWeight: getPriorityWeight(item.Type) }))
    .sort((a, b) => {
      if (a.priorityWeight !== b.priorityWeight) {
        return b.priorityWeight - a.priorityWeight;
      }
      return parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp);
    });
}

export async function fetchNotifications(params: {
  page: number;
  limit: number;
  type: string;
}): Promise<{ notifications: NotificationItem[]; total?: number }> {
  const url = new URL(BASE_URL);
  url.searchParams.set('page', String(params.page));
  url.searchParams.set('limit', String(params.limit));
  if (params.type) {
    url.searchParams.set('type', params.type);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications (${response.status})`);
  }

  const data = (await response.json()) as NotificationApiResponse;
  const notifications = Array.isArray(data.notifications) ? data.notifications : [];
  return {
    notifications,
    total: typeof data.total === 'number' ? data.total : undefined
  };
}
