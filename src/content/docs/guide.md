---
title: Getting started
description: "Access to vyuha is by request. Once you have it: connect a repository, create a project, file a first issue and read a run's evidence."
eyebrow: Guide
lede: "Your first hour with vyuha: connect a repository, create a project, file a first issue and read the evidence of the run an agent does on it."
ogImage: guide
---

## Before you start

Access to vyuha is by request. To ask, open an issue from the [access request template](https://github.com/vyuhalabs/vyuha-site/issues/new?template=access-request.md) on GitHub. The issue is public, so write nothing private in it; you are answered on GitHub.

Once you have access, you need three things:

- A GitHub repository that agents may work in, through branches and pull requests.
- A machine you control for the runs: a laptop or a server, with your coding harness installed. Claude Code is the first harness vyuha supports.
- Ten minutes to read [the model](../model/), so the words below mean what vyuha means by them.

## Step 1: Connect a repository

Connect your GitHub organisation to vyuha, then register the repository agents may work in. For each repository you say:

- its default branch, usually `main`;
- the checks that must be green before anything merges, for example `build` and `quality`.

Agents never push to the default branch. Each run works in a branch of its own, named after the issue, and ends in a pull request. vyuha merges it only when review and verification have passed and the required checks are green.

## Step 2: Create a project

A project is a piece of work with a goal, such as a new page or a feature. Create one in a team and give it:

- a **brief**: what it is for, who it is for, and what done looks like;
- a **playbook**, the stages it goes through, from charter to release;
- the **repository** it works in.

The project's lead agent reads the brief and, before it plans anything, asks you what it cannot know, in one decision in your Inbox. When you have answered, it plans the work as issues, one per deliverable, and hires the roles the stage needs into the project's pod.

## Step 3: File a first issue

For a first issue, pick something small and easy to check, such as a fix to a page or a missing test. Write it as you would for a colleague:

- a title that says the change, for example `Invoice list: filter by status`;
- a description of what is wrong or missing;
- acceptance criteria, each on its own line with an id (`a1`, `a2`, …), so they can be checked one by one.

Delegate the issue to an agent of the pod, or leave it for the lead to assign. The agent starts a run on it. While it works, the issue's thread shows its progress, and any question it has for a person comes to your Inbox.

## Step 4: Read a run's evidence

When the run finishes, open it from the issue. Its evidence is a list, and every line can be checked:

- each **command** the agent ran for evidence, with its exit code, as vyuha recorded it;
- the **tests**, the type check and the linter, passed or failed;
- **screenshots** of the interface at phone and desktop widths, for work on a user interface;
- the **pull request**, with a summary of what changed and how it was checked.

The run then goes to review and verification. A reviewer agent reads the change, and a QA agent or a person checks each acceptance criterion by its id. If something does not hold, the issue goes back to its author with the finding. If it all holds, vyuha merges the pull request.

Decisions you put on approve wait for you in the Inbox throughout, and the stop button halts every run within two seconds.

## What to read next

- [The model](../model/): work, agents, decisions, evidence, playbooks, pods and budgets.
- [The FAQ](../faq/): short answers about harnesses, spend and access.
