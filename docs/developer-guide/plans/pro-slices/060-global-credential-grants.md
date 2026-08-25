# Slice 060 — Global Credential Grants

A global administrator can create a reusable credential reference and grant a project permission to use it without revealing or copying its value.

| Field | Value |
|---|---|
| Selection | E10 |
| Depends on | 025, 046 |
| Primary paths | credential/grant models and repositories, credential service/API, admin and project UI |
| Out of scope | Runtime resolution and usage audit, delivered by slice 061 |

## Implementation

- [ ] Define global credential metadata with stable ID, type, display name, provider/reference, owner, enabled state, and rotation metadata.
- [ ] Store only encrypted local credential material or an external secret reference, never a recoverable plaintext API response.
- [ ] Model explicit grants from one credential to one project with allowed operations and optional expiry.
- [ ] Separate permissions to administer metadata, rotate value, grant use, list granted metadata, and consume a credential.
- [ ] Return credential values as write-only and expose only safe metadata and fingerprints.
- [ ] Protect deletion with dependency checks and model revoke/disable as explicit reversible state transitions.
- [ ] Audit create, rotate, grant, revoke, disable, and delete attempts without credential content.
- [ ] Add global credential administration and project-visible granted-reference selection UI with effective permission explanations.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: grant scope/expiry, permission separation, state transitions, fingerprints, and redaction |
| Integration | Required: encrypted persistence, two-project isolation, rotate/revoke/disable/delete guards, concurrency, and audit records |
| API | Required: credential/grant CRUD, write-only value, filtered project list, expired/revoked grant, and permission contracts |
| UI | Required: multi-user browser evidence for create, grant, project selection, rotate, revoke, and denied metadata/value access |

- [ ] A project user can select granted metadata but cannot retrieve credential plaintext.
- [ ] A grant applies only to its credential, project, allowed operation, and validity interval.
- [ ] Rotation does not require copying the new value into every consuming project.
