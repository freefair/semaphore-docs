# Schedules

The schedule function in Semaphore allows to automate the execution of templates (e.g. playbook runs) at predefined intervals. This feature allows to implement routine automation tasks, such as regular backups, compliance checks, system updates, and more.

Make sure to restart the Semaphore service after making changes for them to take effect.

[//]: # (## Setup and configuration)

## Timezone configuration {#timezone-configuration}

By default, schedules use the globally configured timezone.
The default global timezone is UTC.
Each schedule can select its own IANA timezone without changing other schedules.

Timezone precedence is:

1. A `CRON_TZ=<IANA timezone>` prefix in the cron expression.
2. The timezone selected on the schedule.
3. The globally configured schedule timezone.

The Schedule form displays the effective timezone and the next run returned by the backend before you save.
The Schedule list shows the same backend-authoritative values after saving.

Timezone abbreviations such as `CET` and `PST`, local aliases, numeric offsets such as `+02:00`, and unknown names are rejected because they are ambiguous or do not contain future daylight-saving rules.
Use an IANA identifier such as `Europe/Berlin`, `America/New_York`, or `Asia/Tokyo`.

### Daylight-saving behavior

Cron expressions use wall-clock time in their effective timezone.

- If a local time does not exist during a spring-forward transition, that occurrence is skipped and the next matching wall-clock occurrence is used.
- If a local time occurs twice during an autumn transition, the schedule has one occurrence at each valid UTC instant.
- Each intended UTC instant has a durable identity, so a service restart or multiple scheduler nodes do not create an accidental duplicate.

For example, `30 2 * * *` in `Europe/Berlin` skips the nonexistent 02:30 on the spring transition day.
On the autumn transition day, it runs once at 02:30 CEST and once at 02:30 CET.

### Global fallback

You can change the global fallback timezone by updating the configuration file or setting an environment variable:

You can change the timezone by updating the configuration file or setting an environment variable:

1. **Using the configuration file**:  
    Add or update the `timezone` field in your Semaphore configuration file:
    ```json
    {
      "schedule": {
        "timezone": "America/New_York"
      }
    }
    ```

2. **Using an environment variable**:  
    Set the `SEMAPHORE_SCHEDULE_TIMEZONE` environment variable:
    ```bash
    export SEMAPHORE_SCHEDULE_TIMEZONE="America/New_York"
    ```

Existing schedules without their own timezone continue to use this global fallback.
For a list of timezone names, refer to the [IANA Time Zone Database](https://www.iana.org/time-zones).

### Accessing the schedule feature {#accessing-the-schedule-feature}

1. Log in to the Semaphore web interface
2. Navigate to the "Schedule" tab in the main navigation menu
3. Click the "New Schedule" button in the top right corner to create a new schedule

![](/assets/schedule01.png)

### Creating a new schedule {#creating-a-new-schedule}

When creating a new schedule, you'll need to configure the following options:

| Field | Description |
|-------|-------------|
| Name | A descriptive name for the scheduled task |
| Template | The specific Task Template to execute |
| Timing | Either in cron format for more fexibility or using the built-in options for common intervals |
| Schedule Timezone | Optional IANA timezone; leave empty to use the global fallback |

![](/assets/schedule02.png) ![](/assets/schedule03.png)

### Cron format syntax {#cron-format-syntax}

The schedule uses standard cron syntax with five fields:

```
┌─────── minute (0-59)
│ ┌────── hour (0-23)
│ │ ┌───── day of month (1-31)
│ │ │ ┌───── month (1-12)
│ │ │ │ ┌───── day of week (0-6) (Sunday=0)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

Examples:

- `*/15 * * * *` - Run every 15 minutes
- `0 2 * * *` - Run at 2:00 AM every day
- `0 0 * * 0` - Run at midnight on Sundays
- `0 9 1 * *` - Run at 9:00 AM on the first day of every month
- `CRON_TZ=Asia/Tokyo 0 9 * * *` - Run at 9:00 AM in Tokyo regardless of the selected schedule timezone

Very helpful cron expression generator: [https://crontab.guru/](https://crontab.guru/)

## Use cases {#use-cases}

### System maintenance {#system-maintenance}

```yaml
# Example playbook for system updates
---
- hosts: all
  become: yes
  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes

    - name: Upgrade all packages
      apt:
        upgrade: yes

    - name: Remove dependencies that are no longer required
      apt:
        autoremove: yes
```

Schedule this playbook to run weekly during off-hours to ensure systems stay up-to-date.

### Backup operations {#backup-operations}

Create schedules for database backups with different frequencies:
- Daily backups that retain for one week
- Weekly backups that retain for one month
- Monthly backups that retain for one year

### Compliance checks {#compliance-checks}

Schedule regular compliance scans to ensure systems meet security requirements:

```yaml
# Example compliance check playbook
---
- hosts: all
  tasks:
    - name: Run compliance checks
      script: /path/to/compliance_script.sh

    - name: Collect compliance reports
      fetch:
        src: /var/log/compliance-report.log
        dest: reports/{{ inventory_hostname }}/
        flat: yes
```

### Environment provisioning and cleanup {#environment-provisioning-and-cleanup}

For development or testing environments. Schedule cloud environment creation in the morning and teardown in the evening to optimize costs.

## Best practices {#best-practices}

* Use descriptive names for schedules that indicate both function and timing (e.g. "Weekly-Backup-Sunday-2AM")
* Avoid scheduling too many resource-intensive tasks concurrently
* Consider the effect of long-running scheduled tasks on other schedules
* Test schedules with short intervals before setting up production schedules with longer intervals
* Document the purpose and expected outcomes of scheduled tasks

---

## Task parameters {#task-parameters}

Schedules can pass parameters to tasks. Enable prompts for the required fields in the template, then define parameter values in the schedule configuration so each run supplies the desired overrides (for example branch, variables, flags).
