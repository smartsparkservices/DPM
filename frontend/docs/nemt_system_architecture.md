# NEMT Platform: System & Database Architecture

This document outlines the proposed production-ready architecture for the Desert Path Mobility Services platform, transitioning it from a static website into a fully operational, HIPAA-compliant web application.

---

## 1. High-Level Architecture Diagram

The system will use a modern, decoupled architecture allowing independent scaling of the frontend, backend, and background processing systems.

```mermaid
graph TD
    subgraph Clients
        P[Patient/Facility Portal\nNext.js / React]
        D[Driver/Admin Dashboard\nNext.js / React]
    end

    subgraph API Layer
        API[Core Backend API\nFastAPI + Uvicorn]
    end

    subgraph Data & Caching
        DB[(Primary Database\nPostgreSQL)]
        Cache[(Message Broker / Cache\nRedis)]
    end

    subgraph Background Processing
        W1[Celery Worker - Notifications]
        W2[Celery Worker - Routing/Cron]
    end

    subgraph External Integrations
        SMS[Twilio - SMS]
        Email[SendGrid - Email]
        Maps[Mapbox / Google Maps]
    end

    P -->|REST / JWT| API
    D -->|REST / JWT| API
    
    API <-->|SQLAlchemy ORM| DB
    API -->|Enqueue Jobs| Cache
    
    Cache <--> W1
    Cache <--> W2
    
    W1 -->|API Calls| SMS
    W1 -->|API Calls| Email
    W2 -->|Distance/Traffic Matrix| Maps
    W1 & W2 -->|Read/Write State| DB
```

---

## 2. Service Responsibilities

### Frontend (Next.js / React)
- **Role:** Delivers fast, SEO-optimized marketing pages and secure, gated portals for Patients, Facilities, and Admins.
- **Responsibilities:** Client-side validation, managing authentication state (JWT), rendering dynamic dashboards (e.g., calendar views, driver manifests), and capturing electronic signatures.

### Backend (FastAPI / Python)
- **Role:** The core business logic engine. FastAPI is chosen for its native async support, high performance, and strict Pydantic data validation (crucial for healthcare data integrity).
- **Responsibilities:** Authenticating requests, authorizing roles (e.g., Driver A cannot see Driver B's trips), enforcing HIPAA compliance logs, executing CRUD operations, and offloading heavy tasks to Celery.

### Database (PostgreSQL)
- **Role:** The persistent, relational source of truth.
- **Responsibilities:** Enforcing data integrity via foreign keys, managing concurrent transactions (e.g., ensuring two dispatchers don't assign the same vehicle simultaneously), and storing JSONB for flexible data like audit logs.

### Background Jobs (Redis + Celery)
- **Role:** Handles asynchronous processing and scheduled tasks.
- **Responsibilities:** 
  - **I/O Bound:** Sending SMS confirmations, dispatching emails.
  - **CPU Bound:** Generating PDF invoices, calculating optimal routes for the fleet.
  - **Cron:** Nightly jobs to generate the next day's trips based on recurring schedules.

---

## 3. Data Flow: Booking to Completion

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant FastAPI
    participant Celery/Redis
    participant Twilio/Maps
    
    %% Booking Phase
    User->>Frontend: Fills out Ride Request
    Frontend->>FastAPI: POST /api/rides
    FastAPI->>FastAPI: Validate Schema (Pydantic)
    FastAPI->>Database: INSERT Ride (status: pending)
    FastAPI->>Celery/Redis: Enqueue "Send Confirmation Email"
    FastAPI-->>Frontend: 201 Created
    Celery/Redis->>User: Async Email Sent
    
    %% Scheduling Phase
    Dispatcher->>Frontend: Assigns Driver/Vehicle
    Frontend->>FastAPI: PATCH /api/rides/{id} (status: scheduled)
    FastAPI->>Database: Update Ride
    FastAPI->>Celery/Redis: Enqueue "Notify Driver" & "SMS Patient"
    Celery/Redis->>Twilio/Maps: Send SMS
    
    %% Execution Phase
    Driver->>Frontend: Clicks "En Route"
    Frontend->>FastAPI: PATCH /api/rides/{id}/status
    FastAPI->>Celery/Redis: Enqueue "Patient ETA SMS"
    
    %% Completion Phase
    Driver->>Frontend: Submits Signature & Marks "Completed"
    Frontend->>FastAPI: POST /api/rides/{id}/complete
    FastAPI->>Database: Save Signature URL & Finalize
    FastAPI->>Celery/Redis: Enqueue "Generate Invoice/Manifest"
```

---

## 4. Database Schema Design

A clean, relational schema is vital. Below is the proposed entity relationship for the core system.

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string password_hash
        string first_name
        string last_name
        string phone
        enum role "admin, driver, patient, facility_manager"
        boolean is_active
        datetime created_at
    }

    FACILITIES {
        uuid id PK
        string name
        string address
        string phone
        uuid primary_contact_id FK "References USERS"
    }

    VEHICLES {
        uuid id PK
        string make_model
        string license_plate
        string vin
        enum capability "sedan, wheelchair, bariatric, stretcher"
        boolean is_active
    }

    RIDES {
        uuid id PK
        uuid patient_id FK "References USERS"
        uuid facility_id FK "Optional, References FACILITIES"
        uuid driver_id FK "Optional, References USERS"
        uuid vehicle_id FK "Optional, References VEHICLES"
        
        enum status "pending, scheduled, en_route, picked_up, completed, cancelled"
        enum mobility_need "ambulatory, wheelchair, stretcher"
        
        string pickup_address
        string dropoff_address
        datetime appointment_time
        datetime estimated_pickup_time
        datetime actual_pickup_time
        datetime actual_dropoff_time
        
        text driver_notes
        string signature_url
        datetime created_at
    }

    RECURRING_SCHEDULES {
        uuid id PK
        uuid patient_id FK
        uuid facility_id FK
        string days_of_week "e.g., '1,3,5' for M/W/F"
        time target_pickup_time
        date valid_until
    }

    USERS ||--o{ RIDES : "books / drives"
    FACILITIES ||--o{ RIDES : "requests"
    VEHICLES ||--o{ RIDES : "assigned to"
    USERS ||--o{ RECURRING_SCHEDULES : "has"
    FACILITIES ||--o{ RECURRING_SCHEDULES : "manages"
```

### Key Schema Design Decisions:
1. **Single `USERS` Table with Roles:** Allows a patient to become a facility manager or vice versa without duplicating identity data.
2. **`mobility_need` vs `capability`:** The Ride dictates the `mobility_need`. The backend scheduling logic ensures that a Ride is only assigned to a Vehicle whose `capability` matches or exceeds the need.
3. **Nullable Operational Fields:** `driver_id` and `vehicle_id` are nullable in the `RIDES` table because a ride starts in a `pending` state before it is assigned.
4. **Auditability:** Timestamp fields (`actual_pickup_time`, `actual_dropoff_time`) are strictly decoupled from `appointment_time`. This difference is exactly what Medicaid and brokers audit for on-time performance metrics.

## User Review Required
> [!IMPORTANT]
> Please review this architecture and schema. 
> 
> **Open Questions:**
> 1. Do you plan to handle **payments** (Stripe/Credit Card) directly on the platform for private-pay rides, or is this strictly billed through insurance/facility invoicing? If so, we will need to add a `BILLING` or `INVOICE` table.
> 2. Are there any specific integrations required immediately (e.g., an existing CRM, a specific Medicaid broker portal API like Modivcare)?
> 
> Let me know if you approve of this foundation, and I can begin setting up the backend structure.
