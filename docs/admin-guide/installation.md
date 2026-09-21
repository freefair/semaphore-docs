# Installation

Choose how to install Semaphore based on where you plan to run it and how you
manage software. The guides below cover native packages, containers, standalone
binaries, and Kubernetes, with a separate guide for cloud deployments.

<a id="in-this-section"></a>

## In this section

| Method | Use it when |
|---|---|
| [Package manager](installation/package-manager.md) | You want a native package for your Linux distribution. |
| [Docker](installation/docker.md) | You want to run Semaphore in a container with Docker or Docker Compose. |
| [Cloud](installation/cloud.md) | You are deploying to a cloud platform and need guidance on managed services and infrastructure. |
| [Binary file](installation/binary-file.md) | You want to install a precompiled binary and manage the process yourself. |
| [Kubernetes (Helm chart)](installation/k8s.md) | You already run Kubernetes and want to manage the deployment with Helm. |

<a id="installing-additional-python-packages"></a>

## Additional Python packages

Some Ansible modules and roles need extra Python packages. If you run Semaphore in
Docker, list those packages in a `requirements.txt` file and mount it in the
container's `/etc/semaphore` directory. Add the mount to your Semaphore service in
`docker-compose.yml`:

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

The container installs these packages into the bundled Ansible virtual environment
every time it starts. The same mount works for the `semaphoreui/runner` image. See
[Additional Python dependencies](installation/docker.md#installing-additional-python-dependencies)
for details and a custom-image alternative.

For the file syntax, see the
[pip requirements file format reference](https://pip.pypa.io/en/stable/reference/requirements-file-format/).

<a id="where-to-start"></a>

## Where to start

Start with the guide for your deployment environment. For a binary installation,
follow the service instructions to keep Semaphore running. For service users, Python dependencies, and systemd configuration,
use the manual installation guide.

* [Run as a service](installation/binary-file.md#run-as-a-service)
* [Manual installation](installation_manually.md)
