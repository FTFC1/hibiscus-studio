# Unified Customer Experience Strategy v9
## Mikano International Limited

---

## 🔹 Executive Summary

**The Goal**: A single, unified customer experience to boost satisfaction and revenue.

**The Strategy**: This is a ground-up plan focused on what works in reality. We will build a simple, robust foundation using tools we already control. The core principles are:
1.  **ERP is the King**: The ERP is the source of truth for all financial data. Our system works with it, not against it.
2.  **System-Driven Rules**: We will use data to solve problems like sales conflicts, not rely on people to "do the right thing."
3.  **Pragmatic Tech**: We use Excel because it is powerful, flexible, and has no contact limits.

---

## 🔹 Critical Success Factors & Risk Mitigation

*(This section is carried over from v8 without changes.)*

---

## 🔹 The Core System: Data, Structure & Rules

### The Excel Interaction Hub: Structure & Example

#### Structure
| Tab Name        | Purpose                                            | Key Columns                                                                                                                          |
| :-------------- | :------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Accounts**    | Lists the business entities. One company per row.  | `Account ID`, `Company Name`, `Industry`, `Address`, `Main Phone Number`, `ERP Customer ID`, `Account Owner`                                 |
| **Contacts**    | Lists the people we talk to. One person per row.   | `Contact ID`, `Full Name`, `Job Title`, `Email`, `Mobile Number`, `Associated Account ID` (links to Accounts tab)                           |
| **Interactions**| Logs every meaningful interaction. One row per interaction. | `Interaction ID`, `Date`, `Contact ID`, `Account ID`, `Channel`, `Notes`, `Next Action`, `Action Due Date`, `Logged By`                  |

#### Example
*   **Accounts Tab**
| Account ID | Company Name | Industry | ERP Customer ID | Account Owner |
| :--- | :--- | :--- | :--- |:--- |
| A001 | Zenith Bank PLC | Finance | 102345 | Funke Ade |

*   **Contacts Tab**
| Contact ID | Full Name | Job Title | Associated Account ID |
| :--- | :--- | :--- | :--- |
| C001 | Tunde Leye | Project Manager | A001 |
| C002 | Ada Okoro | Procurement | A001 |

*   **Interactions Tab**
| Date | Contact ID | Channel | Notes | Next Action | Logged By |
| :--- | :--- | :--- | :--- |:--- |:--- |
| 2024-05-20 | C001 | Phone | Called to discuss generator specs for new branch. | Send specs for GSW-250 | Funke Ade |
| 2024-05-21 | C002 | Email | Sent quote as requested. | Follow up on Friday | Funke Ade |


### Rules of Engagement: A Robust Framework for Sales Conflicts

This multi-layered system is designed to handle common conflict scenarios with clear, data-driven rules.

1.  **For Existing Accounts with a Designated Owner**:
    *   **Rule**: The current "Account Owner" (defined as the salesperson who closed the last deal by value > 12 months ago) is the designated point of contact to close all new deals for that account.
    *   **Marketing/Inbound Leads**: If a new lead comes in for this account, it is automatically routed to the existing Account Owner.
2.  **For "Orphan" Accounts (No sales in >12 months)**:
    *   **Rule**: The first salesperson to log a new, substantive interaction (e.g., a meeting, a request for quote) in the Excel Hub becomes the new temporary "Lead."
    *   If they close a deal, they become the new "Account Owner." If the lead goes nowhere after 90 days, the account becomes an orphan again.
3.  **For Brand New Accounts (Not in our system)**:
    *   **Rule**: The salesperson who sources the new account and logs it first in the Excel Hub is the owner.
4.  **In Case of Dispute**:
    *   **Rule**: The data in the **Interactions Tab** is the final word. The manager's role is not to mediate a debate, but to interpret the logged data against these rules.

---

## 🔹 Customer Journey Maps & KPIs

*(Full, complete versions of these sections are included below.)*

### Motors Journey (B2C & Small Business)
*   **1. Awareness & Consideration**: ... *(content from v8)* ...
*   **2. Purchase**: ... *(content from v8)* ...
*   **3. Onboarding**: ... *(content from v8)* ...
*   **4. Usage & Loyalty**: ... *(content from v8)* ...

### Power & Industrial Journey (B2B) - *Draft*
*   ... *(content from v8)* ...

### Medical Division Journey (B2B2C - Syringes) - *Draft*
*   ... *(content from v8)* ...

### Define & Measure Success (KPIs)
*   ... *(content from v8)* ...

---

## 🔹 Phased Action Plan

### Underlying Assumptions to Validate in Phase 0
*   **Technical**: A shared, access-controlled drive (e.g., OneDrive, Google Drive) exists and can handle concurrent access from ~25 users without file corruption.
*   **Process**: The habit of a weekly sales/service review meeting is already in place or can be easily established.
*   **People**: Staff have basic Excel proficiency. The training may need to be more than a 1-page guide if this is not the case.

### Phase 0: Discovery & Alignment (Weeks 1-2)
*   ... *(content from v8)* ...

### Phase 1: Foundation Setup (Weeks 3-6)
*   **Task 2: Finalise & Build the Excel Hub** ...
*   **Task 3: Define Data & Governance Roles** ...
*   **Task 4: KPI Definition Workshop**
    *   Hold a dedicated meeting with divisional heads to define the precise calculation for each KPI.
    *   Example: For "Inquiry-to-Quote Rate," define what counts as a "qualified inquiry" and where the data for both numerator and denominator comes from.
*   **Task 5: Team Training** ...

### Phase 2: Go-Live & First Review Cycle (Weeks 7-8)
*   **Task 6: Develop & Execute Go-Live Plan**
    *   Develop a clear communication plan for the go-live.
    *   Announce the official "Go-Live" date to all staff.
    *   Begin logging all new interactions in the Excel Hub from this date.
*   **Task 7: Initial Data Synchronisation & Validation**
    *   Perform the first full ERP data export and populate the Accounts tab.
    *   The newly assigned Data Stewards must validate the initial export for accuracy.
*   **Task 8: Conduct First Weekly Review**
    *   Hold the first weekly review meeting using data from the Excel Hub. Use it as a practical training and validation session.

### Phase 3: Embed & Refine (Weeks 9-12)
*   ... *(content from v8)* ...

---

## 🔹 Plan on a Page

```mermaid
graph TD
    subgraph Phase 0: Discovery (Wks 1-2)
        A[Kickoff & Stakeholder Meetings] --> B[Gather Answers to Open Questions];
        B --> C[Get Management Buy-in];
    end
    subgraph Phase 1: Setup (Wks 3-6)
        C --> D[Finalise & Build Excel Hub];
        D --> E[Define Roles & KPI Calculations];
        E --> F[Train All Staff];
    end
    subgraph Phase 2: Go-Live (Wks 7-8)
        F --> G[Communicate & Execute Go-Live];
        G --> H[Initial ERP Data Sync];
        H --> I[Conduct First Weekly Review Using Hub];
    end
    subgraph Phase 3: Refine (Wks 9-12)
        I --> J[Establish Regular Cadence];
        J --> K[Gather User Feedback];
        K --> L[Iterate & Improve the System];
    end
```

---

## 🔹 Open Questions for Discovery Phase

*(This section is carried over from v8 without changes.)* 