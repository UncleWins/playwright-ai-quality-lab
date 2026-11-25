---
description: Find the root cause of a failure before changing code
argument-hint: <paste the command and full error output>
---
This failed:

$ARGUMENTS

Do not change code yet.
1. Explain the error in plain words.
2. Give 2-3 likely causes ranked by probability, and how to confirm each (a command or a check).
3. Wait for me to run the checks.
Once we confirm the cause, propose the smallest fix and explain why it fixes the root cause
instead of hiding the symptom. No blind retries, no added sleeps or waitForTimeout.
