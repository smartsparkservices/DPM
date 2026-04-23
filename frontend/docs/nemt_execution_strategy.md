# NEMT Platform: Execution Strategy & Roadmap

This document translates the technical architecture into a practical, phased execution strategy. It is written from the perspective of an operator scaling Desert Path Mobility Services from a static website into a regional NEMT powerhouse and potential SaaS platform.

---

## 5. Feature Roadmap

Building everything at once is a recipe for failure. We must phase the rollout to solve immediate operational bottlenecks first, then scale efficiency.

### Phase 1: MVP (Fastest Usable Version)
*Goal: Stop the bleeding (move off email) and secure PHI.*
- **Intake:** Secure, HIPAA-compliant React booking form connected to the FastAPI backend.
- **Admin Dashboard:** A simple tabular view for Dispatchers to see all `pending` and `scheduled` rides.
- **Manual Scheduling:** Dispatchers assign a `Driver` and `Vehicle` via a dropdown.
- **Driver Communication:** System generates a secure link sent via SMS to the driver each morning with their daily manifest (no dedicated app yet).
- **Patient SMS:** Automated Twilio SMS sent upon booking confirmation and the day before the ride.

### Phase 2: V1 (Operational System)
*Goal: Scale the fleet and automate driver communication.*
- **Driver Web App (PWA):** Drivers log in on their phones to see their manifest, tap "En Route" / "Arrived", and collect finger-drawn digital signatures.
- **Facility Portal:** Hospitals and Dialysis centers get a login to book, modify, and track their patients without calling dispatch.
- **Recurring Schedules Engine:** Dispatchers can create a "M/W/F Dialysis" schedule, and the system auto-generates the rides 7 days in advance.
- **Real-time Status Sync:** When a driver taps "En Route," the system auto-texts the patient and updates the Facility Portal.

### Phase 3: V2 (Scaling & Margin Optimization)
*Goal: Maximize profitability per vehicle and expand revenue.*
- **Algorithmic Routing:** Integration with Mapbox/Google OR-Tools. The system suggests the most efficient driver for a new ride based on current GPS location, traffic, and vehicle capability (e.g., minimizing "deadhead" miles).
- **Medicaid/Broker Billing Exports:** 1-click export of trip logs formatted perfectly for Arizona Medicaid (AHCCCS) or brokers like Modivcare.
- **Private Pay Portal:** Stripe integration for upfront credit card holds on private rides.
- **EHR Integrations:** HL7/FHIR integrations to auto-book rides when a patient is marked for discharge in Epic or Cerner.

---

## 6. Operational Workflows

How the business will actually run on a Tuesday morning:

1. **Booking (The Intake):** A discharge nurse at Banner Health logs into the Facility Portal. She enters a patient going home, selects "Wheelchair Required," and sets the pickup time. The system validates the address and flags if the drop-off is outside the service radius.
2. **Confirmation & Triage:** The Dispatcher sees the new request pop up on the dashboard. They verify the billing details and click "Approve." The system instantly texts the patient: *"Your ride with Desert Path Mobility is confirmed for 2:00 PM."*
3. **Driver Assignment:** The Dispatcher looks at a Gantt chart view of their fleet. They drag the new ride onto John's timeline because John is driving a wheelchair van and will be near the hospital at 1:30 PM.
4. **Execution:** At 1:45 PM, John finishes his previous ride and taps "Next Trip: Banner Health." He taps **En Route**. 
5. **Facility Interaction:** The Banner Health nurse sees the dashboard update to *"Driver En Route (5 mins away)"* and begins wheeling the patient to the lobby, eliminating driver wait time.
6. **Completion:** John loads the patient, drives to the destination, and hands his tablet to the patient for a signature. He taps **Complete**. The backend logs the timestamp and signature for billing.

---

## 7. Automation Opportunities

Every manual touchpoint is a chance for human error. We will implement high-leverage automation:

- **Automated Sanity Checks:** The system will physically prevent a dispatcher from scheduling a driver for a 1:00 PM pickup in North Phoenix and a 1:15 PM pickup in South Phoenix.
- **"ETA Watchdog":** A background Celery task runs every 5 minutes. If a driver hasn't marked "En Route" within 15 minutes of a scheduled pickup, a loud visual alert flags on the Dispatcher dashboard for manual intervention.
- **Automated Manifest Generation:** Instead of dispatchers building schedules at 8 PM every night, recurring trips auto-populate, leaving dispatchers to only handle exceptions and ad-hoc rides.
- **"No-Show" Prevention:** Automated SMS reminders sent 24 hours prior, requiring the patient to reply "1" to confirm or "2" to cancel, automatically updating the system status.

---

## 8. Risks & Considerations

- **HIPAA/Privacy Compliance:** We are dealing with Protected Health Information (PHI). 
  - *Mitigation:* We must execute Business Associate Agreements (BAAs) with AWS, Twilio, and SendGrid. All databases must be encrypted at rest. Roles and permissions must be strictly enforced (e.g., Driver A cannot see Driver B's patients).
- **High-Stakes Reliability:** In NEMT, a missed ride isn't an inconvenience; it can mean a missed dialysis appointment leading to hospitalization. 
  - *Mitigation:* The system architecture must be highly available. The Driver App must have "Offline Mode" (using local storage/Service Workers) so they can still see addresses and collect signatures even in cellular dead zones.
- **Scaling the Routing Problem:** "Vehicle Routing with Time Windows" is notoriously complex.
  - *Mitigation:* We will not attempt to build a custom routing engine. We will rely on human dispatchers aided by simple distance calculations in V1, and integrate established routing solvers (like Google OR-Tools) in V2.

---

## 9. Monetization & Expansion

Right now, Desert Path Mobility is an operations company. By building this software, it becomes a **technology asset**.

### 1. The NEMT SaaS Pivot
Once the software successfully runs your Phoenix operations, you can white-label the software and sell it as a SaaS subscription to other NEMT providers in Texas, Florida, and California. You transition from selling rides (low margin, operational heavy) to selling software (high margin, scalable).

### 2. Premium Facility Tiering
Currently, facilities use NEMT as a cost center. You can offer a "Premium Facility Subscription" ($500/mo) that guarantees them SLA response times, dedicated driver allocation, and API integrations with their internal systems, turning a vendor relationship into a locked-in partnership.

### 3. Broker Bypassing
Most NEMT companies rely on massive brokers (like Modivcare) who take a 30% cut of the Medicaid payout. By offering facilities direct, frictionless booking via your portal, you can bypass the broker, contract directly with the facilities, and capture the full margin.
