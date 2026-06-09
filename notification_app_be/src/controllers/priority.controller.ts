import { Request, Response } from 'express';
import { getPrioritizedNotifications } from '../services/priority.service';

/** Controller for GET /api/v1/priority
 * Query: top (optional) - number of top notifications to return (default 10)
 */
export async function priorityController(req: Request, res: Response) {
  try {
    const topParam = req.query.top as string | undefined;
    const top = topParam ? Number(topParam) : 10;

    // Validate top
    if (!Number.isInteger(top) || top <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid top value; must be a positive integer' });
    }

    const accessToken = process.env.ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ success: false, error: 'Server missing ACCESS_TOKEN configuration' });
    }

    const notifications = await getPrioritizedNotifications(top, accessToken);

    return res.json({ success: true, count: notifications.length, notifications });
  } catch (err: any) {
    // Network or upstream error
    if (err?.message === 'Missing ACCESS_TOKEN') {
      return res.status(500).json({ success: false, error: 'Server missing ACCESS_TOKEN configuration' });
    }

    const status = err?.response?.status || 502;
    const message = err?.response?.data || err?.message || 'Upstream service error';
    return res.status(status).json({ success: false, error: message });
  }
}
