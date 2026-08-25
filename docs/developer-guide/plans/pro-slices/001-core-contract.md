# Slice 001 — Community and Enhanced Builds Share an Executable Contract

An enhanced test implementation can replace the Community `pro/` module while the Community binary retains its current disabled behavior.

| Field | Value |
|---|---|
| Selection | D02, F01 |
| Depends on | None |
| Primary paths | `pro_interfaces/`, `pro/`, `cli/cmd/root.go`, `api/router.go` |
| Out of scope | Real enhanced feature behavior and proprietary source access |

## Implementation

- [ ] Inventory every exported enhanced constructor, interface, route, and Community response.
- [ ] Add compile-time assertions for the Community module and a minimal clean-room test module.
- [ ] Specify disabled HTTP responses, empty collections, and absence of side effects as black-box contracts.
- [ ] Prove Go Workspace replacement without changing application imports.
- [ ] Document source-provenance rules and the core/enhanced compatibility version pair.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: compile-time interface assertions and constructor behavior |
| Integration | Required: build both modules against the same core commit |
| API | Required: disabled Community route contract with zero mutations |
| UI | N/A: this slice changes no visible feature state |

- [ ] Community builds without enhanced credentials or checkout.
- [ ] Replacing `pro/` with the test module requires no application-source edit.
- [ ] A contract change fails both implementations until reconciled.
