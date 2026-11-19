# BloodConnect 🩸

A blood donor matching and request management portal that connects hospitals and patients with compatible, available donors.

BloodConnect helps hospitals and requesters post urgent blood needs and identify compatible, available donors nearby without relying on slow manual calls or scattered messages.

> **Status: active development.** The core application structure includes a React frontend, a Spring Boot backend API, and PostgreSQL, with database migrations, role-based authentication, donor/request workflows, and UI views in progress[cite: 1]. See [Roadmap](#roadmap) for what is currently implemented and what is planned next.

---

## Author & Academic Context

- **Developer:** D. Lokesh Yadav (Final-Year CSE Student)
- **Project Title:** BloodConnect — Smart Blood Donation Portal
- **Overview:** Final-year computer science project focused on donor and hospital onboarding, role-based access, emergency blood requests, donor availability/cooldown tracking, matching/ranking logic, and notifications.

---

## Table of Contents

- [Author & Academic Context](#author--academic-context)
- [The Problem](#the-problem)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Frontend](#frontend)
- [Database Design](#database-design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing the API](#testing-the-api)
- [Scripts](#scripts)
- [Development Workflow](#development-workflow)
- [Roadmap](#roadmap)

---

## The Problem

During medical emergencies, finding a suitable blood donor quickly is often difficult because there is no centralized way to check blood group compatibility, donor availability, eligibility/cooldown status, and proximity at once. Contacting donors manually wastes critical time when every minute matters.

**BloodConnect's approach:** a hospital or requester posts a blood request specifying blood group, units needed, urgency, and location/city[cite: 1]. The system filters for compatible, available, and eligible donors, ranks strong matches, and enables donors to respond so requests can be coordinated and closed cleanly[cite: 1].

---

## Features

Three primary user roles interact with the portal[cite: 1]:

| Role | Capabilities |
|---|---|
| **Admin** | Review and approve or reject hospital registrations (with a reason), manage users and staff accounts, monitor requests and donors, and keep records clean[cite: 1] |
| **Hospital / Requester** | Register hospital details, post blood requests, view matched donors and responses (including withdrawals), and mark requests fulfilled or cancelled[cite: 1] |
| **Donor** | Register and manage profile details, toggle availability, view incoming requests, accept or decline (or withdraw after accepting), and track donation history[cite: 1] |

Signed-in users can also update their own password.

### Core business rules

1. A hospital account must be **approved by an admin** before posting active blood requests.
2. A donor is **eligible** to donate only when marked available **and** outside the post-donation waiting/cooldown period (90 days since last donation)[cite: 1].
3. A donor submits **one response per request** (`ACCEPTED` or `DECLINED`). After accepting, a donor may `WITHDRAW` while the request remains open, without re-responding again.
4. A request begins as `OPEN` and transitions to a final state (`FULFILLED`, `CANCELLED`, or `EXPIRED`).
5. When a request is created, top-ranked compatible matches are selected (`units needed × urgency multiplier`, capped at 25).
6. Hospital registration creates the hospital record (`PENDING`) along with its initial staff account; additional staff are managed by an admin.
7. An initial **admin** account can be seeded from environment configuration on startup rather than self-registration.
8. Users manage their own passwords; administrative password overrides are not exposed.

---

## How It Works

### Main flow: from request to donation

```mermaid
sequenceDiagram
    actor H as Hospital staff
    participant API as BloodConnect API
    participant DB as PostgreSQL
    actor D as Donor

    H->>API: POST /api/requests (blood group, units, urgency, city)
    API->>API: Verify hospital is APPROVED
    API->>DB: Save request (status OPEN)
    API->>DB: Query compatible, available, eligible donors
    API->>API: Rank candidate matches
    API->>DB: Create notifications for top matches
    D->>API: GET /api/donor/requests
    D->>API: POST /api/requests/{id}/responses (ACCEPTED / DECLINED)
    API->>DB: Save donor response
    opt Donor withdraws
        D->>API: PATCH /api/requests/{id}/responses/me -> WITHDRAWN
        API->>DB: Update response and notify hospital staff
    end
    H->>API: GET /api/requests/{id}/responses
    H->>API: PATCH /api/requests/{id}/status -> FULFILLED
    API->>DB: Record donation and update donor last donation date