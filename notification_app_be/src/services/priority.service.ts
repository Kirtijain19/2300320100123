import axios from 'axios';
import { ExternalNotification, PriorityNotification } from '../types/notification';

const TYPE_WEIGHTS: Record<string, number> = {
  placement: 3,
  result: 2,
  event: 1
};

const SOURCE_URL = 'http://4.224.186.213/evaluation-service/notifications';

// Parse timestamp string into numeric epoch for comparison. Accepts 'YYYY-MM-DD HH:mm:ss'.
function parseTimestamp(ts: string): number {
  // Replace space with T to make it ISO-like for Date.parse
  const iso = ts.replace(' ', 'T');
  const t = Date.parse(iso);
  return isNaN(t) ? 0 : t;
}

function normalizeExternal(n: ExternalNotification): PriorityNotification {
  return {
    ID: String(n.ID),
    Type: String(n.Type),
    Message: String(n.Message),
    Timestamp: String(n.Timestamp)
  };
}

// Comparator implementing priority rules: higher type weight first, then newer timestamp.
function compare(a: PriorityNotification, b: PriorityNotification): number {
  const aType = (a.Type || '').toLowerCase();
  const bType = (b.Type || '').toLowerCase();
  const aWeight = TYPE_WEIGHTS[aType] ?? 0;
  const bWeight = TYPE_WEIGHTS[bType] ?? 0;

  if (aWeight !== bWeight) return bWeight - aWeight; // higher weight first

  const aTime = parseTimestamp(a.Timestamp);
  const bTime = parseTimestamp(b.Timestamp);
  return bTime - aTime; // newer first
}

/**
 * Fetches notifications from the configured external API and returns top N
 * prioritized notifications according to the priority rules. This function
 * always fetches live data and does not persist anything locally.
 */
export async function getPrioritizedNotifications(top: number, accessToken: string): Promise<PriorityNotification[]> {
  if (!accessToken || accessToken.trim() === '') {
    throw new Error('Missing ACCESS_TOKEN');
  }

  // Perform the external request; allow axios to throw for network/response errors
  const resp = await axios.get(SOURCE_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 10000
  });

  const body = resp.data as { notifications?: ExternalNotification[] };
  const items = Array.isArray(body?.notifications) ? body.notifications : [];

  // Map and validate entries conservatively
  const mapped = items.map(normalizeExternal);

  // Sort using the comparator
  mapped.sort(compare);

  // Return top N
  return mapped.slice(0, top);
}
