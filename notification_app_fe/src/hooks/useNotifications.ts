import { useEffect, useMemo, useState } from 'react';
import { fetchNotifications, isViewed, markViewed, sortByPriority } from '../services/notificationService';
import { NotificationItem, PriorityNotification } from '../types/notification';

export interface NotificationsState {
  items: NotificationItem[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  type: string;
  viewedIds: Set<string>;
  hasNextPage: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setType: (type: string) => void;
  refresh: () => void;
  markAsViewed: (id: string) => void;
  priorityItems: PriorityNotification[];
}

export function useNotifications(initialLimit = 10): NotificationsState {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [type, setType] = useState('');
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [reloadToken, setReloadToken] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const priorityItems = useMemo(() => sortByPriority(items), [items]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchNotifications({ page, limit, type })
      .then((result) => {
        if (!active) {
          return;
        }
        setItems(result.notifications);
        setViewedIds(new Set(result.notifications.filter((item) => isViewed(item.ID)).map((item) => item.ID)));
        setHasNextPage(
          typeof result.total === 'number' ? page * limit < result.total : result.notifications.length === limit
        );
      })
      .catch((fetchError: unknown) => {
        if (!active) {
          return;
        }
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load notifications');
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit, type, reloadToken]);

  const refresh = () => setReloadToken((value) => value + 1);

  const markAsViewed = (id: string) => {
    const next = new Set(viewedIds);
    next.add(id);
    setViewedIds(next);
    markViewed(id);
  };

  return {
    items,
    loading,
    error,
    page,
    limit,
    type,
    viewedIds,
    hasNextPage,
    setPage,
    setLimit,
    setType,
    refresh,
    markAsViewed,
    priorityItems
  };
}
