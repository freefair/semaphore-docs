# Workflow Artifacts

The Enhanced edition lets a workflow task publish bounded, typed JSON values for graph-reachable downstream tasks.
SQL stores the run-scoped value and provenance, while workflow definitions and user-visible payloads remain value-free.

## Table of Contents

- [Definition Contract](#definition-contract)
- [Publishing Outputs from Ansible](#publishing-outputs-from-ansible)
- [Validation and Capture](#validation-and-capture)
- [Downstream Input Resolution](#downstream-input-resolution)
- [Sensitive Values](#sensitive-values)
- [Run Metadata API and UI](#run-metadata-api-and-ui)
- [Persistence and Retry Semantics](#persistence-and-retry-semantics)

## Definition Contract

Task nodes declare outputs in `artifact_outputs` and reference outputs in `artifact_inputs`.
The output and input names must match `^[A-Za-z_][A-Za-z0-9_]{0,63}$`.
A node may declare at most 32 outputs and reference at most 64 inputs.

```json
{
  "id": 2,
  "kind": "task",
  "artifact_outputs": [
    {
      "name": "build_tag",
      "schema": { "type": "string" },
      "sensitive": false,
      "max_bytes": 128
    },
    {
      "name": "deployment_token",
      "schema": { "type": "string" },
      "sensitive": true,
      "max_bytes": 256
    }
  ]
}
```

The bounded schema supports `string`, `integer`, `number`, `boolean`, `object`, and `array`.
Object schemas are closed, support at most 64 declared properties, and may list required properties.
Array schemas require one `items` schema.
Schema and value nesting is limited to four levels.
Each declaration sets `max_bytes` between 1 and 65,536 bytes; the editor defaults it to 16,384 bytes.

A downstream node links a local input name to one declared output:

```json
{
  "name": "release_tag",
  "source_node_id": 2,
  "output": "build_tag",
  "required": true
}
```

The source must be a graph-reachable predecessor.
Unrelated nodes, downstream nodes, missing declarations, duplicate names, and invalid schemas fail authoritative workflow validation before persistence.

## Publishing Outputs from Ansible

An Ansible task publishes declared outputs through the run-level `semaphore_workflow_outputs` custom statistic.
Use the fully qualified `ansible.builtin.set_stats` module and set `per_host: false` so the values belong to the complete run rather than one host.

```yaml
- name: Publish workflow outputs
  ansible.builtin.set_stats:
    data:
      semaphore_workflow_outputs:
        build_tag: "{{ build_tag }}"
        deployment_token: "{{ deployment_token }}"
    per_host: false
    aggregate: false
```

The private callback reads only `stats.custom['_run']['semaphore_workflow_outputs']` at playbook completion.
It does not parse console output, task messages, or arbitrary statistics.
Only names declared by the producing workflow node are captured.

## Validation and Capture

The callback and service apply independent bounds before data reaches persistence.
The complete structured-output event is bounded, and each value is capped at the global artifact limit.
Each declared value is validated against its frozen schema and declaration-specific byte limit.
JSON is canonicalized before storage.

A missing declaration value or an invalid type, shape, or size records `invalid` availability with a diagnostic capped at 1,024 bytes.
An invalid or missing declared output fails the producing workflow node safely.
Undeclared keys in `semaphore_workflow_outputs` are ignored.

Artifact availability has three states:

| State | Meaning |
|---|---|
| `available` | The declared value passed validation for the current producer task attempt. |
| `unavailable` | No current producer value exists, for example because the source was skipped or never ran. |
| `invalid` | The producer emitted no declared value or emitted a value that failed validation. |

## Downstream Input Resolution

Inputs resolve immediately before the consumer task is created.
This keeps long-lived task definitions free of runtime values and binds the consumer to the current run and producer assignment attempt.

Plain values are merged into the consumer task environment JSON under the input alias.
Sensitive values are merged into the existing encrypted task-secret JSON under the input alias.
The run-node snapshot records only the alias, source node, output name, required flag, sensitivity, availability, producer task and attempt, and a value-free reference fingerprint.

A missing required input blocks the consumer node without creating its task.
A missing optional input leaves the alias absent and allows the consumer to proceed.

## Sensitive Values

Sensitive workflow artifacts require access-key encryption to be enabled.
Capture fails closed when the encryption key is unavailable.
The database stores ciphertext only for a sensitive value and plaintext only for a non-sensitive value.

Sensitive values never appear in workflow definition snapshots, fingerprints, logs, audit events, run API payloads, or the UI.
The reference fingerprint hashes run and provenance identifiers, not the artifact value.
Decryption happens only while preparing an authorized downstream task and uses the existing task-secret path.

## Run Metadata API and UI

`GET /api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/artifacts` returns one value-free metadata record per declared output in the frozen run definition.
The route uses the same project-scoped workflow-run authorization as the run detail endpoint.

```json
[
  {
    "workflow_node_id": 2,
    "name": "deployment_token",
    "schema": { "type": "string" },
    "sensitive": true,
    "availability": "available",
    "size_bytes": 48,
    "reference_fingerprint": "sha256:...",
    "producer_task_id": 314,
    "producer_attempt": 1
  }
]
```

The response never contains plaintext or ciphertext fields.
Workflow run details also expose value-free `artifact_inputs` snapshots on consumer nodes.
The existing run view shows output and input names, type/schema, availability, provenance, required or optional state, and an explicit redacted marker for sensitive entries.

The existing workflow editor properties panel provides compact declaration and reference rows.
It filters input sources to reachable predecessors and leaves the graph, project navigation, and Community host views unchanged.

## Persistence and Retry Semantics

Migration `v2.20.17` adds declaration and reference JSON to workflow nodes, resolved input snapshots to workflow run nodes, and the project-scoped workflow artifact table.
Each stored artifact is keyed by project, workflow run, workflow node, producer task, assignment attempt, and output name.

Retry capture replaces artifacts only for the exact task attempt being handled.
Input resolution selects only the producer task and attempt attached to the same workflow run.
Artifacts from another project, run, node, task, or attempt cannot satisfy a reference.
Binary files, downloads, retention policies, and garbage collection use the separate [workflow file artifact contract](workflow-file-artifacts.md).
