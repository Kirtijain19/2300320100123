# Stage 1 - Notification System Design

## 1. Overview — Purpose

This document describes Stage 1 of a campus notification platform designed to reliably deliver short, actionable messages to students, faculty, and staff. The objectives for Stage 1 are to provide a dependable REST API, persistent storage of notifications, basic filtering, and real-time delivery for connected clients.

Key goals:
- Provide a simple, consistent API for creating and retrieving notifications.
- Enable real-time push for connected clients using Socket.IO.
- Keep the initial system lightweight and extensible for future features.

## 2. Supported notification categories — Placements

Stage 1 supports a controlled set of categories. The primary category for this stage is:
- `placements`: notifications concerning placement drives, interviews, and results.

Other supported categories (for future use): `announcements`, `events`,`results`, `maintenance`.

## 3. Events

Events are the triggers that result in notifications. Representative events:
- `placement:drive_published` — a new placement drive is announced.
- `placement:interview_scheduled` — interview slots are posted.
- `placement:result_posted` — results for a drive are published.
- `announcement:general` — a campus-wide announcement.

Each event typically results in one or more notification records created via the REST API.

## 4. Results

Result notifications provide outcome details (for `placements`), such as company name, role, and success/failure. Stage 1 stores the notification payload and optional metadata for client rendering.

## 5. General Announcements

General announcements are broader messages intended for large user groups. They are lower priority by default and may be delivered as broadcasts.

## 6. Functional Requirements — Create notification

- Endpoint to create a notification with `title`, `message`, `category`, `priority`, and optional `metadata`.
- Validate inputs and return the created resource ID.
- Emit a real-time event to connected clients when applicable.

## 7. View notifications

- Endpoint to list notifications for a user with pagination, filtering (category, read/unread) and sorting by `createdAt`.

## 8. View notification by ID

- Endpoint to retrieve a single notification by `_id`.

## 9. Mark notification as read

- Endpoint to mark a specific notification as read; updates `isRead` and `updatedAt`.

## 10. Mark all notifications as read

- Endpoint to mark all notifications for the authenticated user as read, optionally scoped to a category.

## 11. Delete notification

- Endpoint to delete a notification by `_id`. Stage 1 may implement soft deletes or hard deletes depending on retention policy.

## 12. Filter notifications by category

- Support `?category=placements` to return only notifications for the `placements` category.

## 13. Filter notifications by read/unread status

- Support `?status=unread` or `?status=read` to filter by `isRead`.

## 14. REST API Design

Base path: `/api/v1/notifications`

Common header expectations are documented in the HTTP Headers section.

### POST /api/v1/notifications
- Endpoint name: CreateNotification
- HTTP method: POST
- URL: `/api/v1/notifications`
- Purpose: Create a notification and persist it.
- Required headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Request body (JSON):

```json
{
  "title": "string",
  "message": "string",
  "category": "placements",
  "priority": "low|medium|high",
  "metadata": { "company": "string", "role": "string" }
}
```

- Success response (HTTP 201 Created):

```json
{
  "success": true,
  "data": {
    "_id": "612e3b8a1f4a2c00123abcd4",
    "createdAt": "2026-06-09T12:00:00.000Z"
  }
}
```

- Error response (HTTP 400 Bad Request):

```json
{
  "success": false,
  "error": "Validation failed: title is required"
}
```

### GET /api/v1/notifications
- Endpoint name: ListNotifications
- HTTP method: GET
- URL: `/api/v1/notifications`
- Purpose: Retrieve paginated notifications for the authenticated user.
- Required headers:
  - `Accept: application/json`
  - `Authorization: Bearer <token>`
- Query parameters:
  - `page` (integer, default 1)
  - `limit` (integer, default 20)
  - `category` (string, optional)
  - `status` (string, `read|unread`, optional)
  - `sort` (string, e.g. `createdAt:desc`)
- Success response (HTTP 200 OK):

```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "title": "Placement Drive Open",
      "message": "registration started.",
      "category": "placements",
      "priority": "high",
      "isRead": false,
      "createdAt": "2026-06-09T12:00:00.000Z",
      "updatedAt": "2026-06-09T12:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 42 }
}
```

- Error response (HTTP 401 Unauthorized):

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### GET /api/v1/notifications/:id
- Endpoint name: GetNotificationById
- HTTP method: GET
- URL: `/api/v1/notifications/:id`
- Purpose: Retrieve a single notification by its `_id`.
- Required headers:
  - `Accept: application/json`
  - `Authorization: Bearer <token>`
- Success response (HTTP 200 OK):

```json
{
  "success": true,
  "data": {
    "_id": "612e3b8a1f4a2c00123abcd4",
    "title": "Placement result published",
    "message": "Results for Company X are now available.",
    "category": "placements",
    "priority": "high",
    "isRead": false,
    "createdAt": "2026-06-09T12:00:00.000Z",
    "updatedAt": "2026-06-09T12:00:00.000Z",
    "metadata": { "company": "Company X", "resultUrl": "/results/123" }
  }
}
```

- Error response (HTTP 404 Not Found):

```json
{
  "success": false,
  "error": "Notification not found"
}
```

### PATCH /api/v1/notifications/:id/read
- Endpoint name: MarkNotificationRead
- HTTP method: PATCH
- URL: `/api/v1/notifications/:id/read`
- Purpose: Mark a specific notification as read.
- Required headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Request body: none required
- Success response (HTTP 200 OK):

```json
{
  "success": true,
  "data": { "_id": "612e3b8a1f4a2c00123abcd4", "isRead": true }
}
```

- Error response (HTTP 404 Not Found):

```json
{
  "success": false,
  "error": "Notification not found"
}
```

### PATCH /api/v1/notifications/read-all
- Endpoint name: MarkAllRead
- HTTP method: PATCH
- URL: `/api/v1/notifications/read-all`
- Purpose: Mark all notifications for the authenticated user as read, optionally scoped to a category.
- Required headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Request body (optional):

```json
{
  "category": "placements" // optional
}
```
- Success response (HTTP 200 OK):

```json
{
  "success": true,
  "data": { "modifiedCount": 12 }
}
```

- Error response (HTTP 500 Internal Server Error):

```json
{
  "success": false,
  "error": "Failed to mark notifications as read"
}
```

### DELETE /api/v1/notifications/:id
- Endpoint name: DeleteNotification
- HTTP method: DELETE
- URL: `/api/v1/notifications/:id`
- Purpose: Delete a notification by `_id`.
- Required headers:
  - `Authorization: Bearer <token>`
- Success response (HTTP 200 OK):

```json
{
  "success": true,
  "data": { "deletedCount": 1 }
}
```

- Error response (HTTP 404 Not Found):

```json
{
  "success": false,
  "error": "Notification not found"
}
```

### GET /api/v1/notifications?category=placements
- Endpoint name: ListNotificationsByCategory
- HTTP method: GET
- URL: `/api/v1/notifications?category=placements`
- Purpose: List notifications filtered by category.

### GET /api/v1/notifications?status=unread
- Endpoint name: ListNotificationsByStatus
- HTTP method: GET
- URL: `/api/v1/notifications?status=unread`
- Purpose: List notifications filtered by read/unread status.

## Notification Data Model

Collection: `notifications`

Fields and descriptions:
- `_id` — MongoDB ObjectId, primary identifier.
- `title` — Short headline describing the notification.
- `message` — Full message body.
- `category` — Category label (e.g., `placements`).
- `priority` — `low`, `medium`, or `high` to influence UI prominence.
- `isRead` — Boolean flag indicating read state (default `false`).
- `createdAt` — ISO datetime when the notification was created (server-generated).
- `updatedAt` — ISO datetime when the notification was last updated (server-generated).
- `metadata` — Optional object for category-specific fields (e.g., company, resultUrl).

Sample JSON document:

```json
{
  "_id": "612e3b8a1f4a2c00123abcd4",
  "title": "Placement results: Company X",
  "message": "Results for Company X are published. Please check your dashboard for details.",
  "category": "placements",
  "priority": "high",
  "isRead": false,
  "metadata": { "company": "Company X", "role": "Software Engineer", "resultUrl": "/results/123" },
  "createdAt": "2026-06-09T12:00:00.000Z",
  "updatedAt": "2026-06-09T12:00:00.000Z"
}
```

## HTTP Headers

Standard request headers:
- `Content-Type: application/json` — for endpoints that accept JSON payloads.
- `Accept: application/json` — to request JSON responses.
- `Authorization: Bearer <token>` — bearer credential provided by the client for authentication.

Standard response headers:
- `Content-Type: application/json; charset=utf-8`
- `Cache-Control: no-store`

## Error Handling Strategy

All errors should be returned in a consistent JSON envelope. The API uses appropriate HTTP status codes and a simple error message key.

- 400 Bad Request — validation or malformed data

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": "Validation failed: title is required"
}
```

- 401 Unauthorized — missing or invalid credentials

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": "Unauthorized"
}
```

- 404 Not Found — notification not found

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "success": false,
  "error": "Notification not found"
}
```

- 500 Internal Server Error — unexpected condition

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "success": false,
  "error": "Internal server error"
}
```

## Real-Time Notification Mechanism (Socket.IO)

Stage 1 uses Socket.IO to provide near-real-time delivery to connected clients.

Client connection flow:
1. Client authenticates through the existing auth system and then connects to the Socket.IO endpoint (for example `/socket.io`).
2. During connection, the client provides the bearer credential (JWT) in a handshake header or namespace query parameter; the server validates the credential and resolves the user id.
3. The server assigns the socket to rooms such as `user:{userId}` and optionally `category:{category}` for broadcast subscriptions.

Notification broadcasting flow:
1. REST API creates and persists a notification.
2. The server determines the target recipient(s) and emits `notification:new` to the user's room(s).
3. If a user marks a notification as read, server updates the record and emits `notification:read` to the user's sockets so UI can sync.

Event names and sample payloads:
- `notification:new`

Payload example:

```json
{
  "_id": "612e3b8a1f4a2c00123abcd4",
  "title": "Placement results: Company X",
  "message": "Results for Company X are published.",
  "category": "placements",
  "priority": "high",
  "createdAt": "2026-06-09T12:00:00.000Z",
  "metadata": { "company": "Company X" }
}
```

- `notification:read`

Payload example:

```json
{
  "_id": "612e3b8a1f4a2c00123abcd4",
  "isRead": true,
  "updatedAt": "2026-06-09T12:05:00.000Z"
}
```

Reliability notes:
- Socket.IO provides automatic reconnection and acknowledgement; the server should provide an idempotent `_id` so clients can deduplicate notifications after reconnect.
- For missed messages, the client can reconcile by calling the list endpoint on reconnect to fetch any notifications with `createdAt` greater than the last seen timestamp.

## API Naming Conventions

- Use plural nouns for top-level resources (`/notifications`).
- Keep endpoints RESTful: use GET for reads, POST for creation, PATCH for partial updates, DELETE for deletes.
- Version APIs in the URL (`/api/v1`) to enable future changes.
- Use query parameters for filtering and pagination.

JSON response standards:
- Return a JSON envelope with `success` and `data` on success, or `success` and `error` on failure.
- Use appropriate HTTP status codes.

## Assumptions

- Authentication is provided by an external service; the notification service validates bearer credentials.
- Notifications are user-scoped; broadcast messages are handled via rooms or recipient lists.
- Stage 1 targets single-campus deployment; multi-tenant concerns are deferred.
- Delivery guarantees are initially best-effort; durable or guaranteed delivery can be added in later stages.

---

This Stage 1 design provides a pragmatic foundation for a campus notification platform: well-defined REST endpoints, a simple but extensible data model, consistent error handling, and Socket.IO-based real-time delivery for connected clients. Future stages can enhance delivery channels, add templating and scheduling, and introduce analytics and administrative controls.


# Stage 2
## Database Selection

MongoDB is selected for this system because notifications are document-oriented, schema flexibility is required for metadata, and it supports horizontal scaling through sharding. It also provides high write throughput which is suitable for notification workloads.

## Collection: notifications

{
  "_id": "ObjectId",
  "recipientId": "string",
  "title": "string",
  "message": "string",
  "category": "placements",
  "priority": "high",
  "isRead": false,
  "metadata": {},
  "createdAt": "Date",
  "updatedAt": "Date"
}

## Indexes
db.notifications.createIndex({ recipientId: 1 })

db.notifications.createIndex({
  recipientId: 1,
  isRead: 1
})

db.notifications.createIndex({
  recipientId: 1,
  category: 1
})

db.notifications.createIndex({
  createdAt: -1
})

## Example Queries
### Create Notification

db.notifications.insertOne({
  recipientId: "user123",
  title: "Placement Drive Open",
  message: "ABC Company registrations started",
  category: "placements",
  priority: "high",
  isRead: false,
  metadata: {
    company: "ABC Company"
  },
  createdAt: new Date(),
  updatedAt: new Date()
})

### List User Notifications
db.notifications.find({
  recipientId: "user123"
})
.sort({ createdAt: -1 })
.limit(20)

### Filter by Category
db.notifications.find({
  recipientId: "user123",
  category: "placements"
})

### Unread Notifications
db.notifications.find({
  recipientId: "user123",
  isRead: false
})

### Mark Read
db.notifications.updateOne(
  { _id: ObjectId("notificationId") },
  {
    $set: {
      isRead: true,
      updatedAt: new Date()
    }
  }
)

### Mark All Read
db.notifications.updateMany(
  {
    recipientId: "user123",
    isRead: false
  },
  {
    $set: {
      isRead: true,
      updatedAt: new Date()
    }
  }
)

# Problems as Data Grows

1. Slow Queries

Millions of notifications hone par fetch slow ho sakta hai.

Solution: Proper indexing.

2. Storage Growth

Purani notifications bahut storage consume karengi.

Solution:

Archival strategy
TTL collections
Old notifications move to cold storage

3. High Concurrent Reads

Exam results ya placement results ke time sudden traffic spike.

Solution:
Read replicas
Caching (Redis)

4. High Write Volume

Bulk notification campaigns.

Solution:
Batch inserts
Message queue (RabbitMQ/Kafka)

5. Single Server Bottleneck

Ek Mongo instance overload ho sakta hai.

Solution:
Sharding on recipientId