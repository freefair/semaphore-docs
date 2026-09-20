# ADR 0017: Preserve Git SSH Host Policy During Command Construction

## Status

Accepted

## Context

The repository clone command prepends `ssh` to its host-key options.
The `no` branch also included `ssh`, causing OpenSSH to interpret the second executable name as the destination host.
The `yes` and `accept-new` branches emitted an empty `UserKnownHostsFile` when the optional filename was unset.
Task-scoped Git commands duplicated the host-key logic and had the same missing-path problem.
Configuration comments promised a temporary-directory fallback but incorrectly implied that the filename selected the verification mode.

## Decision

Use one options-only helper for repository and task-scoped Git SSH commands.
Preserve `ssh.strict_host_key_checking`, including its existing default of `no`.
For `yes` and `accept-new`, use `ssh.known_hosts_file` when supplied and otherwise use `known_hosts` under `tmp_path`.
For `no`, continue using `/dev/null`.
Quote filenames when passing them through the shell to OpenSSH.

The fallback changes only the filename, never the trust policy.
Mode `yes` still requires a previously trusted key; it does not enroll a new host automatically.
Mode `accept-new` records new keys and rejects changed keys.
Operators must preserve the known-hosts file across restarts or configure a persistent path to retain trust.
Runner-wide cache clearing removes files under `tmp_path`, including the fallback file; configure a path outside that directory when trust must survive cache clearing.
Each server or runner uses its own configured path; HA deployments must provision the appropriate trusted keys on every execution node.

## Alternatives

Removing only the duplicate executable repairs the default mode but leaves the stricter modes with an invalid empty option.
Changing the default to `accept-new` introduces a separate authentication-policy change and still requires a valid filename.
Requiring an explicit filename contradicts the documented fallback and forces configuration changes for this repair.

## Verification

Exercise both command builders with `no`, `yes`, and `accept-new`, with explicit and omitted filenames.
Verify the resulting argument vector and OpenSSH's effective configuration without contacting external hosts.
Retain existing task-scoped identity and SSH agent lifecycle regressions.
