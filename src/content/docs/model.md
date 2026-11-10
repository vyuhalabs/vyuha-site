---
title: The model
description: "How vyuha works, in plain words: work, agents, decisions, evidence, playbooks, pods and budgets."
eyebrow: Model
lede: "vyuha runs a company of agents the way a small product team runs itself. Seven ideas carry it: work, agents, decisions, evidence, playbooks, pods and budgets."
numbered: true
ogImage: model
glance:
  - section: work
    term: Work
    summary: Teams, projects and issues, tracked the way your team already does.
  - section: agents
    term: Agents
    summary: Members of the company with a role, a manager and a lane.
  - section: decisions
    term: Decisions
    summary: Every kind has a tier. Autonomous, notify or approve.
  - section: evidence
    term: Evidence
    summary: What a run did, recorded, then checked by someone else.
  - section: playbooks
    term: Playbooks
    summary: The stages a project goes through, from charter to release.
  - section: pods
    term: Pods
    summary: The roles a stage needs, hired for the project.
  - section: budgets
    term: Budgets
    summary: Limits on spend, and a stop button for every run.
---

## Work

Work in vyuha is tracked the way a product team already tracks it: teams, projects, issues, cycles and milestones. A project has a brief, a goal and an owner. An issue has a description and acceptance criteria, each with its own id, so anyone can check them one by one.

Nothing about the tracker is special to agents. A person can read the board, file an issue, change its priority or take it over. Agents and people work on the same issues, in the same states.

## Agents

An agent is a member of the company, not a chat window. Each one has a role (engineer, reviewer, QA, delivery lead), a manager it reports to, and a lane that sets what it may do on its own.

When an agent picks up an issue, it starts a run: it works in a branch of your repository with a real coding harness, on a machine you control. Claude Code is the first harness; others connect through adapters. A run ends when the agent finishes, blocks with a clear need, or asks a person a question.

## Decisions

Every kind of decision has a tier:

- **Autonomous**: the agent decides and the decision is logged.
- **Notify**: the agent goes ahead and a person can object within a window.
- **Approve**: the agent waits until a person says yes.

Some decisions are always on approve: a charter, the core stack, a public launch, access to customer data, a change to an agent's autonomy. The decisions that need a person wait in the Inbox, each on one page: the question, the options with their cost and risk, a recommendation and the evidence behind it.

## Evidence

A run leaves evidence of what the agent did: the commands it ran with their exit codes, the tests, the type check, screenshots of the interface at phone and desktop widths, and the pull request. vyuha records the commands itself, so the evidence is not a summary the agent wrote about its own work.

Someone other than the author checks it. A reviewer agent reads the change; a QA agent or a person checks each acceptance criterion by its id. When the review and the checks pass, vyuha merges. The author never merges its own work.

## Playbooks

A playbook is the path a project follows, as stages: for example charter, plan, build, review, verify and release. Each stage says which documents it needs, which roles take part and which gate closes it.

A lead agent plans the work of a stage as issues, one per deliverable, and a stage passes when its gate does. Gates that matter, such as a public release, are held by a person.

## Pods

A pod is the group of agents that works on one project: a delivery lead and the roles the current stage needs, such as an engineer, a code reviewer, a QA engineer and a release engineer.

When a stage needs a role the company does not have yet, the lead asks to hire one from a role template, and a person approves the hire. Every member of the pod has a manager and a lane, so it is always clear who holds an issue and who answers for it.

## Budgets

Budgets put limits on what the company spends, and you set them. A spending threshold turns a cost above it into a decision that waits for a person in your Inbox, so an agent cannot spend past the line you drew without someone saying yes.

If you need everything to stop, the stop button halts every run within two seconds. Every action, decision and run is kept in an audit trail, so afterwards you can see who did what, when and why.
