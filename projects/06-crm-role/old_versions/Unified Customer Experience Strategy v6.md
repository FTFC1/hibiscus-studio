# Unified Customer Experience Strategy v6
## Mikano International Limited

---

## 🔹 Executive Summary

**The Goal**: A single, unified customer experience to boost satisfaction and revenue.

**The Strategy**: This is a ground-up plan focused on what works in reality. We will build a simple, robust foundation using tools we already control. The core principles are:
1.  **ERP is the King**: The ERP is the source of truth for all financial data. Our system works with it, not against it.
2.  **System-Driven Rules**: We will use data to solve problems like sales conflicts, not rely on people to "do the right thing."
3.  **Pragmatic Tech**: We use Excel because it is powerful, flexible, and has no contact limits. We will not over-engineer solutions.

---

## 🔹 Critical Success Factors & Risk Mitigation

This plan is simple, but execution requires discipline. These are the key risks and how we address them.

### Risk 1: Poor User Adoption
*   **The Problem**: Busy staff see this as "extra work" and don't log their interactions consistently. The Excel Hub becomes useless.
*   **The "What's In It For Me?" (WIIFM) for Staff**:
    *   **For Sales**: "Have a complete history of every interaction with your client's company at your fingertips. Never get surprised again by a colleague's conversation."
    *   **For Service**: "See a customer's full service history instantly, without digging through old emails or asking someone."
    *   **For Management**: "Get a clear, real-time view of pipeline and team activity without chasing people for updates."
*   **Mitigation**: Adoption cannot be optional. The Excel Hub must become the **standard operating procedure** for weekly sales and service reviews. If an interaction isn't in the hub, it didn't happen.

### Risk 2: Data Quality ("Garbage In, Garbage Out")
*   **The Problem**: Typos and inconsistent data entry (e.g., "Company Ltd" vs. "Company Limited") create duplicate records and make reporting impossible.
*   **Mitigation: Basic Data Governance**:
    *   **Rule 1: Always Search First**: Before creating a new Account or Contact, you must search to see if it already exists.
    *   **Rule 2: Standard Naming**: Company names must be entered exactly as they appear on official documents.
    *   **Rule 3: Assign a Data Steward**: One person per division must be assigned the role of "Data Steward," responsible for periodically cleaning the data and merging duplicates.

### Risk 3: Hidden Complexity
*   **The Problem**: We create a system that works technically but fails politically or practically.
*   **Mitigation: Address a Key Issue Upfront**:
    *   **Cross-Divisional Compensation**: The "Rules of Engagement" for ownership are a good start. However, Management must define the **compensation model for cross-selling**. If a Motors salesperson passes a lead to Power that closes, what is their incentive? This must be clarified to encourage collaboration.

### Risk 4: Scalability
*   **The Problem**: The Excel Hub becomes slow and difficult to manage as we add thousands of interactions.
*   **Mitigation: Define a Clear Trigger for Upgrading**:
    *   We will re-evaluate the Excel solution and begin a formal CRM project when any two of the following are true:
        *   The file size exceeds 100MB.
        *   The file takes more than 10 seconds to open and save.
        *   The Data Stewards spend more than 2 hours per week cleaning data.
        *   We have more than 25 concurrent users.

---

## 🔹 The Core System: Data, Structure & Rules

### The Excel Interaction Hub: Proposed Structure

*   **Tab 1: Accounts**: `Account ID`, `Company Name`, `Industry`, `Address`, `Main Phone Number`, `ERP Customer ID`, `Account Owner`.
*   **Tab 2: Contacts**: `Contact ID`, `Full Name`, `Job Title`, `Email`, `Mobile Number`, `Associated Account ID`.
*   **Tab 3: Interactions**: `Interaction ID`, `Date`, `Contact ID`, `Account ID`, `Channel`, `Notes`, `Next Action`, `Action Due Date`, `Logged By`.

---

## 🔹 Customer Journey Maps (Drafts for Refinement)

*(The content of the journey maps remains the same as v5, but they are explicitly positioned as drafts to be finalised during Phase 1 of the action plan).*

---

## 🔹 Define & Measure Success (KPIs)

*(KPIs remain the same as v5).*

---

## 🔹 Phased Action Plan (Revised)

### Phase 0: Discovery & Alignment (Weeks 1-2)

*This is the most critical phase. We do not build anything until we have answers.*

*   **Task 1: Stakeholder Alignment on this Initiative**
    *   Sub-Task 1.1: Hold a kickoff meeting with key stakeholders (Data Team, Divisional Heads) to present this v6 document.
    *   Sub-Task 1.2: Use the "Open Questions" section below as an agenda to gather initial requirements and identify unknowns.
    *   Sub-Task 1.3: Get formal buy-in from management to proceed with the plan.

### Phase 1: Foundation Setup (Weeks 3-6)

*   **Task 2: Finalise & Build the Excel Hub**
    *   Sub-Task 2.1: Based on feedback from Phase 0, make final adjustments to the Excel Hub structure.
    *   Sub-Task 2.2: Create the final, blank Excel file and save it to a shared, access-controlled drive.
*   **Task 3: Define Data & Governance Roles**
    *   Sub-Task 3.1: Meet with Divisional Management to **define and assign the role** responsible for the recurring ERP data export.
    *   Sub-Task 3.2: Document the export process.
    *   Sub-Task 3.3: **Assign one "Data Steward"** per division responsible for data quality.
*   **Task 4: Team Training**
    *   Sub-Task 4.1: Create a simple, 1-page guide on how to use the Excel Hub and the importance of data quality.
    *   Sub-Task 4.2: Schedule and run a training session with all customer-facing staff.

### Phase 2: Implementation & Refinement (Weeks 7-10)

*   **Task 5: Go-Live & Review**
    *   Sub-Task 5.1: Announce the official "Go-Live" date.
    *   Sub-Task 5.2: Begin the regular process of ERP exports and logging all new interactions in the hub.
    *   Sub-Task 5.3: Schedule a recurring 30-minute weekly meeting to review the hub's data, gather feedback, and track KPIs.

---

## 🔹 Open Questions for Discovery Phase

This is the agenda for the Phase 0 meetings.

### Overall Strategy
1.  Which divisions are officially in-scope for Phase 1 of this project? (e.g., Motors and Power only?)
2.  What is the single most important outcome management wants to see from this in the first 3 months?
3.  What is the policy for cross-divisional sales compensation?

### For the Data & ERP Team
1.  What are the unique identifiers for customers in the ERP? Can we use this as the `ERP Customer ID`?
2.  Is it possible to export customer records based on "last modified date" to avoid exporting the entire database each time?
3.  How frequently can we realistically run these exports without impacting system performance? Daily? Weekly?

### For Divisional Heads (Motors, Power, Medical, GRAS/Clinic)
1.  What is the biggest customer complaint you hear today that is NOT related to product price or quality?
2.  What is one piece of information your salespeople/staff constantly have to ask for that slows them down?
3.  What does a "qualified lead" look like for your division? What is the minimum information needed?

### For Sales & Marketing
1.  What is the current process for handing off a lead from marketing (or an inbound call) to a salesperson?
2.  How is "Account Ownership" currently decided? How are disputes resolved?
3.  What are the most common reasons a customer gives for not buying from us (after they have received a quote)? 