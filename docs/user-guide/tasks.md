# Tasks

A task is an instance of launching an Ansible playbook. You can create the task from [Task Template](task-templates/) by clicking the button Run/Build/Deploy for the required template.

![](/assets/image6.png)

The **Deploy** task type allows you to specify a version of the build associated with the task. By default, it is the latest build version.

![](/assets/task_deploy1.png)

When the task is running, or it has finished, you can see the task status and the running log.

![](/assets/image7.png)

### Raw log view {#raw-log-view}

You can open the unprocessed raw task log from the task log window via the RAW LOG action.

### Ansible task summary

The enhanced edition shows a persisted result summary for Ansible tasks. It includes healthy and failed host totals, per-host recap counters, aggregated stage results, and redacted failure details. Large inventories are displayed in bounded pages.

The summary can be in one of these states:

- **Collecting** means the task is still producing results.
- **Complete** means every expected host summary was stored.
- **Partial** means some results are available but collection was interrupted. The warning explains what is missing; it does not change the task result.
- **Empty** means the finished task produced no supported host results.
- **Unsupported** means the runner used a result format newer than the server understands. The raw task log remains available.

Refreshing the task page loads the same persisted summary rather than reparsing the raw log. Failure messages are bounded and common credential values are redacted before they are stored.

## Tasks log retention {#tasks-log-retention}
You'll notice that logs of previous runs of your tasks are available in the tasks template or in the dashboard.

However, by default, log retention is infinite.

You can configure this by using the `max_tasks_per_template` parameter in `config.json` or the `SEMAPHORE_MAX_TASKS_PER_TEMPLATE` environment variable.
