---
sidebar_position: 7
title: Review an execution
description: Check task and workflow plans before they start.
---

# Review an execution

Enhanced installations show an execution review inside the existing task and workflow start dialog.

1. Enter the task or workflow inputs and choose **Run**.
2. Review the definition, input names and sources, resolved references, provisional runner selection, command shape, warnings, and denials.
3. Choose **Confirm run** to start the unchanged plan.

Secret values are never displayed. A lock icon only confirms that a sensitive input is present.

Runner selection is provisional until enqueue. If no runner is currently eligible, the review explains the stable rejection reasons and prevents confirmation.

If a template, workflow, resource, credential reference, runner state, capability, permission, or policy changes after the review, the start is stopped. The dialog then shows the updated plan; review it and confirm again. The review also expires after a short period and must then be refreshed.
