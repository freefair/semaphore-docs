# ADR 0016: Separate Audit Retry and Transport Tests

## Status

Accepted

## Context

The audit service retry regression combined a 10 ms HTTPS deadline with an expectation that the receiver observed both delivery attempts.
That deadline also covers connection acquisition and TLS negotiation, so a valid timeout can happen before the receiver sees the first request.
The service can correctly persist two attempts and recover while the receiver records only one request.
A handler-start handshake alone cannot guarantee receipt before that deadline.

## Decision

Keep transport timeout classification in `TestAuditWebhookClientBoundsTimeoutAndResponseSize`, including its existing real 10 ms timeout.
In the service retry test, complete a real signed and authenticated HTTPS delivery before injecting one retryable timeout result at the `auditWebhookClient` boundary.
Allow the next delivery to return its real successful result.
This models a recipient processing an event whose response is lost to the sender.

Retain assertions for two receiver observations, stable event IDs, both authorization headers, retry/success ordering, signing timestamps, and the durable attempt ledger.
Use the ordinary bounded delivery client for successful HTTPS requests; elapsed time no longer injects the service test's retry outcome.
Production deadlines, retry policy, persistence, and credential handling remain unchanged.

## Alternatives

Increasing the short fault-injection timeout keeps the result dependent on scheduler and TLS timing.
Waiting for the handler with the same deadline still permits expiry before the handler starts.
Accepting only one receiver observation weakens the duplicate-delivery and stable-identity regression.
A fully fake recipient would omit the existing signed and authenticated HTTPS request coverage.

## Verification

Run the service retry and real transport timeout regressions repeatedly, including a delayed connection that exceeds the former service fixture's 10 ms deadline.
Verify that omitting the injected retry or changing the retried event identity makes the service regression fail.
Run the complete Enhanced suite and retained product gates before publication.
