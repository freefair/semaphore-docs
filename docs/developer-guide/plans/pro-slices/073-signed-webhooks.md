# Slice 073 — Signed Webhooks

A webhook receiver can verify payload authenticity, freshness, and event identity, while Semaphore retries the same signed logical event and exposes its delivery history.

| Field | Value |
|---|---|
| Selection | X09 |
| Depends on | 022, 035, 056 |
| Primary paths | webhook signing/verifying services, secret rotation, delivery/invocation repositories, webhook APIs and UI |
| Out of scope | Public-key signatures and using a webhook secret as a user session token |

## Implementation

- [x] Define a versioned canonical signing input containing HTTP method, path, event ID, timestamp, and exact payload bytes.
- [x] Sign outbound deliveries with HMAC-SHA-256 and distinct versioned headers for signature, event ID, and timestamp.
- [x] Generate high-entropy secrets server-side, store only encrypted secret material, display once, and support overlapping current/next keys during rotation.
- [x] Keep event ID and logical payload stable across retries while generating a fresh bounded timestamp and signature for each HTTP attempt.
- [x] Publish a [receiver verification contract](../../signed-webhooks.md) with constant-time comparison, allowed clock skew, and durable event-ID deduplication guidance.
- [x] Require the same signature verification, timestamp window, and durable replay claim for inbound workflow webhooks.
- [x] Persist attempt metadata and redacted verification failures without headers or secrets.
- [x] Add secret creation/rotation, signed test delivery, inbound status, replay rejection, and history UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: canonical bytes, signature vectors, constant-time verification path, timestamp bounds, rotation overlap, and redaction |
| Integration | Required: fake receiver plus inbound trigger for valid, tampered, stale, replayed, retried, and rotated-key cases |
| API | Required: secret create/rotate/status, signed test/history, inbound verification/replay, write-only secret, and permission contracts |
| UI | Required: browser evidence for one-time secret display, copy acknowledgment, rotation, signed test, replay failure, and history |

- [x] Changing any signed method, path, identity, timestamp, or payload byte invalidates verification.
- [x] One inbound event ID starts at most one workflow even under concurrent replay.
- [x] Secrets and full signature headers are absent from read APIs, logs, audit details, and retained browser state.
