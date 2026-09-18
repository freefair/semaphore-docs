# ADR 0012: Share Task Repository SSH Identities

## Status

Accepted; implementation and release verification are in progress.

## Context

Semaphore's Git clone uses the Repository access key through a short-lived SSH agent.
The task previously received an agent only when its Inventory supplied an SSH key.
Consequently, a successful Repository checkout did not let requirements installers or task commands authenticate to the same Git service.
Operators compensated with private keys and SSH configuration on runner hosts, outside the task's configured credential lifecycle.

## Decision

Give the task one agent containing the Inventory SSH identity, when configured, and the template Repository SSH identity, when configured.
Offer a repeated identity only once.
Keep Repository clone authentication independent of this task agent.
Repository keys of type `none` or `login_password` do not contribute an SSH identity.
Inventory Repository credentials are not added automatically.

Prepare the agent before requirements installation and application execution.
Publish its task-specific `SSH_AUTH_SOCK` to every app using the existing task environment construction.
Local and remote runners use the same executor preparation and existing credential hydration.

Offer the Inventory identity first in the shared agent for Ansible managed-host connections. Nested Git explicitly offers the Repository identity followed by the Inventory identity, preserving dependencies that already use the latter.
Preserve explicit administrator and task SSH settings, repository Ansible configuration and the application's ordinary connection defaults.
Use the configured host-key verification policy and SSH configuration for generated Git commands. Do not set an Ansible private-key environment override, which would take precedence over repository configuration.
When `IdentitiesOnly=yes` needs an explicit selector, write only a public identity file; the private key stays in the agent.
OpenSSH supports selecting an agent-held private key through a [public identity file](https://man.openbsd.org/ssh.1#i).
Task completion, failed preparation, execution failure and cancellation close the agent and remove its socket.
Closing an agent also ends already accepted client connections so an open connection cannot extend the signing lifetime.

Container workloads keep an isolated agent inside the container and the same selected identity set.
Preserve the executor boundaries in [ADR 0007](0007-generate-executor-workloads-from-policy.md): no host socket mounts and no additional Kubernetes permissions.
The existing protected read-only credential bundle is outside `/workspace` and is retained for Repository and additional SSH keys. The task code can read this bundle; client-side host selection is therefore not a security boundary against task-controlled programs.

### Additional key bindings

Use a bounded value-free `{access_key_id, hosts}` binding shared by projects,
templates and tasks. Host lists contain exact canonical hostnames or IP addresses.
Repository-specific selection of different keys on the same host is excluded.

Use automatic client-side host selection, with the existing trusted-task model.
With fewer than five distinct public-key identities in the task agent, host
lists may be empty and clients can offer the shared agent's identities.
At five or more identities, require host routing. Count Repository, Inventory
and additional keys together and deduplicate by public-key identity. An explicit
host list applies even below the threshold. The Repository URL can supply its
implicit hostname; Inventory destinations generally cannot be inferred.
Five is the chosen product threshold, not a guarantee of authentication success:
the destination server controls [MaxAuthTries](https://man.openbsd.org/sshd_config#MaxAuthTries).

Projects persist `default_ssh_keys` and `always_ssh_keys`. Templates and tasks
persist nullable `ssh_keys`. A null task selection inherits the template, and a
null template selection inherits the project defaults. An explicit empty list
replaces the inherited selection. Project always bindings are appended in all
cases. Merge repeated references to the same key and reject conflicting keys
for the same explicitly routed hostname.

Keep these fields on existing records using bounded JSON database columns and
the existing CRUD permissions, rather than introduce a separate policy resource.
This avoids another independent update lifecycle and lets templates and tasks
retain their reviewed selection. Execution snapshots contain resolved bindings,
never private key material. Resolve current key values at dispatch so rotation
and removal remain effective. Cross-project tasks use the template owner's key
namespace and project policy.

Per-run overrides require permission to manage project resources; run-only users
inherit the authored selection. Existing API clients that omit the new fields
retain stored bindings. Explicit null and empty lists retain their distinct
inheritance semantics. Project and template bindings prevent key deletion;
historical task references remain informational.

Render host selection through native OpenSSH configuration, including the normal
user configuration before the system configuration. Prepend the generated `-F`
argument so an explicit later `-F` keeps OpenSSH's normal last-option precedence.
Match hostnames as names: distinct DNS aliases may resolve to the same address
and intentionally select different identities. This is not an IP-based policy.

The UI distinguishes inheritance, explicit empty overrides and always-applied
keys. Host lists are edited alongside the selected key, making the intended use
visible in project settings, templates and individual runs.

## Alternatives

Extending the clone agent's lifetime couples cache and clone operations to task execution and still leaves Inventory identity selection unresolved.
Separate task agents would require selecting different sockets for different applications and requirements installers.
Host-wide keys bypass the configured Key Store and do not follow task cleanup or project credential selection.
Mounting a runner's agent socket into containers would break the existing isolation contract.

## Verification

Cover the Repository/Inventory key combinations, application environments and remote hydration with focused tests.
Use an isolated SSH service that accepts only the Repository key and execute a real nested Git command through the task environment.
Retain a failing comparison without the feature so a later upstream merge cannot silently remove this behavior.
Exercise both identities, explicit public-key selection and cleanup after success, failure and cancellation.

## Consequences

Commands in the task can authenticate with the selected Repository and Inventory identities for the duration of that task.
Dependency repositories must still authorize the configured public key.
Local execution retains the documented trusted-process model; the task agent does not create an operating-system isolation boundary between processes running as the same user.
If SSH agent forwarding is explicitly enabled, it forwards the agent's entire identity set, including the Repository key; selecting a public identity for the connection does not filter the forwarded agent.
The original repository-key fix introduces no credential type or host-level key installation.
Offering several identities alone does not select the correct deploy key for different repositories on the same Git host: SSH authentication can succeed before Git rejects repository access. Repository-specific selection is explicitly excluded from this delivery. Automatic host selection does not restrict task code that deliberately overrides the generated SSH configuration or reads the credential bundle; cryptographic destination enforcement would require a different credential boundary.
See the [Key Store guide](../../user-guide/key-store.md#ssh-keys-available-to-a-task) for the user-visible behavior.
