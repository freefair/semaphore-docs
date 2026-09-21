# Workspaces

![Workspaces tab of a template](../../../../static/assets/template-workspaces.webp)

Semaphore provides built-in support for Terraform workspaces, allowing you to manage multiple environments and configurations within a single project. This feature helps you maintain separate state files for different environments like development, staging, and production.

<a id="features"></a>

## Features

- **Workspace Management**: Create, switch, and delete workspaces directly from the Semaphore UI.
- **State Isolation**: Each workspace maintains its own state file, preventing conflicts between environments.
- **Environment Variables**: Configure workspace-specific environment variables.
- **Workspace Selection**: Choose the target workspace when running Terraform commands.

<a id="using-workspaces-in-semaphore"></a>

## Using Workspaces in Semaphore

<a id="creating-a-workspace"></a>

### Creating a Workspace

In the **Workspaces** section of the Terraform/OpenTofu template where you want to add a workspace, follow these steps:

1. Click the ➕ button.
2. In the menu that appears, select **New Workspace**.
3. In the modal dialog, enter the workspace name and select the SSH key to be used for cloning modules.
4. Click the **Create** button to add the new workspace to the template.
5. You can now use this workspace to run tasks.

<a id="switching-workspaces"></a>

### Switching workspaces

You can set the default workspace for a Terraform/OpenTofu template by clicking the **MAKE DEFAULT** button.

<a id="workspace-specific-variables"></a>

### Workspace-specific variables

Semaphore currently does not support workspace-specific variables.
