# Project Blueprint: The Unified Customer Experience
## An Operational Playbook for Growth
_Mikano International Limited | FINAL_

| Category | Component | Description |
| :--- | :--- | :--- |
| **Inputs** | ERP Customer Data & Daily Interactions | Combines customer data with daily conversations. |
| **Engine** | Excel Hub & Weekly Review | Logs all interactions for a weekly team review. |
| **Outputs**| Improved Journeys & KPIs | Creates a better customer experience and clear results. |
| **Goal** | Revenue Growth & Satisfaction | Aims to increase sales and customer happiness. |

---

## 🔹 Executive Summary

**The Goal**: To create one great customer experience. This will increase satisfaction, improve our processes, and grow revenue.

**The Strategy**: We will start with a simple, manual system. The goal is to fix our process first, before buying new technology. The plan uses Microsoft Excel, a tool we already have. The core principles are:
1.  **ERP is King**: The ERP is our main source for **customer master data**. This plan supports it.
2.  **Data-Driven Rules**: We will use data to solve sales conflicts fairly.
3.  **Smart Technology Path**: We start with Excel because it's simple and free. We will use clear goals to decide when to buy a CRM.

---

## 🔹 Phased Action Plan
This is a **sequential, division-by-division rollout**. We will start with a pilot in one division to create a blueprint for success. After the pilot, we will apply the lessons learned to the next division, and so on. This iterative approach allows us to learn and improve as we go.

| Phase | Task Description | Key Deliverable(s) | Est. Timeline |
| :--- | :--- | :--- | :--- |
| **Phase 0: Discovery (All Stakeholders)** | Hold Kickoff & Gather Requirements | Divisional Buy-in; Answered Questions | Weeks 1-2 |
| **Phase 1: Motors Division Pilot** | Build, Launch & Refine the System | Motors: Trained Team & Working Hub; <br/> Reusable Training Kit (1-pager & video) | Weeks 3-12 |
| **Phase 2: Power Division Rollout** | Apply Lessons & Launch for Power | Power: Trained Team & Working Hub | Est. 4-6 Weeks Post-Pilot |
| **Phase 3: Medical Division Rollout** | Apply Lessons & Launch for Medical | Medical: Trained Team & Working Hub | Est. 4-6 Weeks Post-Phase 2 |
| **Phase 4: Future Divisions** | Plan & Execute for Remaining Divisions | Rollout for remaining divisions | TBD |

---
**The Post-Pilot Review & Next Phase Kickoff**

The transition between phases is a two-step process to ensure lessons are captured and applied effectively.

**Step 1: The After-Action Review (Motors Pilot)**
*   **Purpose**: To review the pilot's performance against its metrics and document key lessons.
*   **Attendees**: The Product & BI Team Lead and the Head of the Motors Division.
*   **Outcome**: A list of specific, actionable recommendations for improving the process.

**Step 2: The Next Phase Strategy Meeting (Power Division)**
*   **Purpose**: To present the updated blueprint (incorporating lessons from the pilot) and agree on the plan for the Power Division rollout.
*   **Attendees**: The Product & BI Team Lead and the Head of the Power Division.
*   **Outcome**: A finalised plan and kickoff date for the Power Division pilot.

This two-stage approach ensures each rollout is faster and more effective than the last.

---

## 🔹 Pilot Success Metrics (Motors Division)
The Motors Division pilot will be considered a success if we achieve all of these by the end of Week 12.

*   **Adoption Rate (Target: >80%)**: At least 80% of customer-facing staff actively log interactions weekly.
    *   **How We Measure**: Each week, the Data Steward will count the unique names in the 'Logged By' column and divide this by the total number of customer-facing staff. This gives a clear, weekly percentage.
*   **Process Compliance (Target: 100%)**: All weekly sales and service review meetings are conducted using the Excel Hub as the primary source of data.
*   **Data Quality (Target: <10% Errors)**: A weekly audit of new entries shows fewer than 10% require correction.
    *   **What is an "Error"**: An error includes duplicate entries, missing key information (like a `Contact ID` or `Next Action`), or non-standard formatting.
*   **Stakeholder Confidence (Qualitative)**: A post-pilot survey of Motors staff and management shows a positive sentiment regarding the new process's ease of use and value.

---
**Monitoring & Intervention**

To ensure the pilot stays on track, the **Product & BI Team Lead** will review the metrics with the **Head of the Motors Division** every two weeks.

If any metric is off-track for two consecutive review periods, a formal intervention meeting will be called to identify the root cause and agree on a corrective action plan. This ensures we can solve problems early and don't wait until the end of the pilot to react.

---
## 🔹 A Note on Technology: ERP & The Excel Hub
The ERP is our official system for **customer master data**.

However, the ERP is slow for logging daily sales calls. This means staff often don't log their work, and we lose important data.

The **Excel Interaction Hub** is a simple fix. It is a fast and easy tool for people to use, which will help us capture conversations we currently miss. If this works, we will have better data. Later, we can push this data back to the ERP.

---

## 🔹 The Core System: Structure & Rules

The system is a single Excel workbook with three tabs, stored on a shared OneDrive.

| Tab Name | Purpose | Key Columns |
| :--- | :--- | :--- |
| **Accounts** | Lists business entities. One company per row. | `Account ID`, `Company Name`, `Industry`, `ERP Customer ID`, `Account Owner` |
| **Contacts** | Lists people we talk to. One person per row. | `Contact ID`, `Full Name`, `Job Title`, `Associated Account ID` |
| **Interactions**| Logs every meaningful interaction. One row per interaction. | `Interaction ID`, `Date`, `Contact ID`, `Channel`, `Notes`, `Next Action`, `Logged By` |

---
### Key Definitions
To ensure everyone speaks the same language, we will use the following standard definitions.

| Term | Definition |
| :--- | :--- |
| **Account** | A business or organisation we have a commercial relationship with. One company per record. |
| **Contact** | A specific individual person who works at an Account. |
| **Interaction** | A single, meaningful touchpoint with a Contact (e.g., a call, a meeting, a key email). |
| **Account Owner**| The single salesperson responsible for the commercial relationship with an Account. |
---

### Rules of Engagement: Solving Sales Conflicts

**1. For New Ownership**
| Trigger | Action | Outcome |
| :--- | :--- | :--- |
| A deal is successfully closed for an Account. | The closing salesperson's name is entered into the `Account Owner` field in the **Accounts Tab**. | This salesperson is now the main contact for all future deals with this Account. |

**2. For "Orphan" Accounts**
| Trigger | Action | Outcome |
| :--- | :--- | :--- |
| **Initial Cleanup**: Before the pilot launch. | The Head of Division reviews and assigns all unassigned accounts. | Every account has a clear owner on Day 1, preventing initial chaos. |
| **Ongoing Review**: An employee leaves the company. | On a monthly basis, the Head of Division reviews and reassigns that person's accounts. | Ensures a smooth transition for customers and prevents accounts from becoming dormant. |

---

## 🔹 Customer Journey Maps

### Motors Division (B2C & Small Business)
*   **1. Awareness & Consideration**
    *   **Problem**: Customers often only think about price.
    *   **Solution**: Show our full value (warranty, service, awards) in all marketing.
    *   **Why it Matters**: This changes the focus from price to value and builds trust.
*   **2. Purchase**
    *   **Problem**: A slow sales process can lose a customer's interest.
    *   **Solution**: Reply to all inquiries in under 12 hours. Use a standard checklist for test drives.
    *   **Why it Matters**: Being fast and professional shows we respect the customer and builds our brand.
*   **3. Onboarding**
    *   **Problem**: A poor handover can ruin a great buying experience.
    *   **Solution**: Use a delivery checklist. Book the first service at the point of delivery.
    *   **Why it Matters**: This makes the handover smooth and shows we care about the customer long-term.
*   **4. Usage & Loyalty**
    *   **Problem**: Customers fear hidden costs when they need service.
    *   **Solution**: Give a full service quote for approval before work starts.
    *   **Why it Matters**: This honesty builds trust and brings customers back.

### Power & Industrial Division (B2B)
*   **1. Lead Generation**
    *   **Problem**: Important leads can get lost or delayed.
    *   **Solution**: Log all leads in Excel. Send them to a specialist within 4 hours.
    *   **Why it Matters**: Being fast gives us an edge and shows clients they matter.
*   **2. Technical Qualification**
    *   **Problem**: If we misunderstand a client's needs, we waste time.
    *   **Solution**: Use a standard checklist for all first calls and log it.
    *   **Why it Matters**: This helps us make good proposals from the start.
*   **3. Proposal & Negotiation**
    *   **Problem**: Talks can stall if we don't track what was agreed.
    *   **Solution**: Log all key negotiation points (like discounts) in the Interactions tab.
    *   **Why it Matters**: This creates a clear record and helps avoid arguments.
*   **4. Project Delivery & Support**
    *   **Problem**: A bad handover to Operations frustrates new customers.
    *   **Solution**: Schedule the first maintenance visit during the handover meeting.
    *   **Why it Matters**: This makes the process smooth and shows our long-term commitment.

### Medical Division (B2B2C)
*   **1. Distributor Identification**
    *   **Problem**: We don't have a good list of potential partners.
    *   **Solution**: Keep a target list of partners in the Excel Hub.
    *   **Why it Matters**: This gives the sales team a clear list to work from.
*   **2. Distributor Onboarding**
    *   **Problem**: New partners may lack the info to sell well.
    *   **Solution**: Create a standard "Onboarding Kit" with all sales information.
    *   **Why it Matters**: A good onboarding process helps partners sell more, faster.
*   **3. Distributor Management**
    *   **Problem**: It's hard to track which partners need help.
    *   **Solution**: Use data from the Hub for quarterly reviews with top partners.
    *   **Why it Matters**: This helps us set goals, solve problems, and build loyalty.
*   **4. Downstream Support**
    *   **Problem**: Feedback from hospitals can be slow to reach us.
    *   **Solution**: Create a clear process for partners to report quality issues in the Hub.
    *   **Why it Matters**: This helps us fix product issues fast and protect our name.

---

## 🔹 Key Performance Indicators (KPIs)

### Motors Division
*   **Inquiry-to-Quote Rate (Target: >60%)**: Percentage of qualified inquiries that get a formal quote.
*   **Quote-to-Purchase Rate (Target: >40%)**: Percentage of quotes that become a sale.
*   **First-Contact Resolution Rate (Target: >80%)**: Percentage of issues solved in one contact.

### Power, Construction & Industrial (B2B)
*   **Lead Response Time (Target: <4 Hours)**: Time from inquiry to first contact from a specialist.
*   **Proposal Win Rate (Target: >35%)**: Percentage of submitted proposals that are won.
*   **Average Sales Cycle Length (Target: <90 Days)**: Average time from qualified lead to a signed contract.

### Medical Division
*   **New Distributor Acquisition Rate (Target: 2/quarter)**: Number of new, qualified partners signed.
*   **Average Order Volume (Target: +10% YoY)**: The average value of a distributor's order.
*   **Time-to-Resolve Quality Flags (Target: <48 Hours)**: Time from a quality flag to a confirmed fix.

### GRAS Restaurant & Cube 65 Clinic
*   **Average Spend Per Customer (Target: +15% YoY)**: Average amount a customer spends per visit.
*   **Repeat Customer Rate (Target: >50%)**: Percentage of customers who return within 6 months.
*   **Online Review Score (Target: 4.5+ Stars)**: Average score across major review platforms.

---

## 🔹 Critical Success Factors & Risk Mitigation

### Risk 1: Poor User Adoption
*   **The Problem**: Staff are busy and may see this as extra work. They may not log interactions.
*   **The "What's In It For Me?" (WIIFM)**:
    *   **For Sales**: Prove your work, secure your commission.
    *   **For Service/Ops**: Look professional, have full customer history.
    *   **For Management**: Get a clear pipeline view without chasing people.
*   **Mitigation**: The primary driver for adoption will be the new weekly team review. The core principle is simple: "If it's not in the Hub, we don't discuss it." This approach reinforces the Hub's role as the single source of truth. To ensure this meeting is efficient and effective, it will follow a standard 30-minute format:
    *   **Owner**: The Head of Division is responsible for running this meeting.
    *   **Standard Agenda**:
        1.  **Pipeline Review (15 mins)**: Review key deals and `Next Action` dates from the Hub.
        2.  **Performance Check (5 mins)**: The Data Steward presents the weekly adoption rate and data quality score.
        3.  **Problem Solving (10 mins)**: Open discussion on any process issues, conflicts, or roadblocks.

### Risk 2: Data Quality ("Garbage In, Garbage Out")
*   **The Problem**: Bad data makes reports useless and frustrates the team.
*   **Mitigation**: We will use three simple data rules:
    1.  **Search First**: Check if a record exists before creating a new one.
    2.  **Standard Naming**: Use official company names.
    3.  **Data Stewards**: Assign one person per division to own data quality.
        *   **Who Appoints Them**: The Head of the Division appoints the Data Steward.
        *   **Who This Is**: A Data Steward is a detail-oriented person from within the business. It is an added responsibility, not a new job title.
        *   **What They Do**: They spend 1-2 hours per week reviewing new entries to check for duplicates, ensure standard naming is used, and flag interactions with missing `Next Action` dates.

### Risk 3: Misaligned Processes & Incentives
*   **The Problem**: Without a reward for teamwork, staff will stay in their silos.
*   **Mitigation**: Management must define and share the new compensation model for cross-selling before we go live.

### Risk 4: Scalability
*   **The Problem**: Over time, the Excel file will become too slow and large.
*   **Mitigation**: We will start a formal CRM review when the system hits clear limits. This lets us move based on facts, not feelings. We start the review when any **two** of these are true:
    *   The file is bigger than 100MB.
    *   The file takes more than 10 seconds to open.
    *   Data Stewards spend over 2 hours a week cleaning data.

---

## 🔹 System Governance & Future State

To ensure the long-term success and scalability of this project, we will follow two final principles.

**1. Template Governance: How We Prevent Chaos**

The structure of the Excel Hub is critical. To protect it, the P&BI team will be the sole owner of the master template.
*   **Data Input**: All new interactions will be added via a simple **Microsoft Form**. This allows staff to add data quickly without having rights to edit the structure of the Excel sheet itself, which prevents accidental corruption.
*   **Change Management**: If a division wants to add a new column or change a field, they must formally request it from the P&BI team. This ensures that all changes benefit the entire system, not just one team.

**2. Future State: How We Prepare for a CRM**

The pilot is not just a test; it is a live requirements-gathering exercise for a future CRM.
*   **Document Everything**: During the pilot, the P&BI team will log every feature request, pain point, and "I wish it could..." comment from users and managers.
*   **Create the Requirements Document**: These notes will be compiled into a formal **"CRM Requirements Document."**
*   **A Smarter Evaluation**: When it is time to evaluate CRM vendors, we will not watch their generic demo. We will give them our requirements document and say: **"Show us how your software does this."** This guarantees we buy the exact right tool for our specific, proven needs.

---

## 🔹 Open Questions (Blockers for Kickoff)
The following questions must be answered before the project can officially kick off.

| Category | Question We Must Answer | Why This Blocks the Project |
| :--- | :--- | :--- |
| **Governance** | What is the main outcome management wants to see in the first 3 months? | We need a clear target to aim for, otherwise we cannot measure success. |
| **Commercials** | What is the specific policy for cross-selling compensation? | The team must know how they will be rewarded for collaboration before they start. |
| **Commercials** | What are the current rules for account ownership, and what has caused conflict? | We must understand past failures to design a system that solves them. |
| **Technology** | How are inbound leads currently handled, and what has failed in the past? | This ensures our new process solves a real, known problem. |
| **Technology** | Besides follow-up, what are the top three reasons we lose deals after a quote? | This helps us fix the real bottlenecks in the sales process. |
| **Technology** | What is the unique customer ID in the ERP, and can we get an automated export? | This is technically essential for linking the Excel Hub to our master data. |
| **Process** | How will we handle existing accounts that are unassigned or whose owner has left? | We must have a clear process for assigning these "orphan" accounts to prevent conflict. |

---

## 🔹 Next Steps

| Step | Action To Take | Why It's Important |
| :--- | :--- | :--- |
| **1. Internal Review** | The Product & BI team will review this plan internally. | To ensure our technical team is aligned before wider discussion. |
| **2. Answer Blockers** | Meet with stakeholders to get answers to the "Blocker Questions." | We cannot start the project without these critical answers. |
| **3. Schedule Kickoff** | Send a calendar invite for the official "Project Kickoff" meeting. | To formally bring all leaders together and start the project. |
| **4. Circulate Plan** | Attach the final plan to the kickoff invite at least 2 days early. | Everyone must read the plan beforehand for a productive meeting. |
| **5. Hold Kickoff** | Present the final plan and pilot goals to all division heads. | To secure final buy-in and officially launch the initiative. |
| **6. Launch Pilot** | Begin building the Excel Hub and training with the Motors team. | To put the plan into action and start gathering real-world data. |
| **7. Inform Divisions** | Formally notify Power and Medical division heads that the pilot is live. | To manage expectations and prepare them for their future involvement. |

---

By following this data-driven, user-focused plan, we can create a more unified and profitable customer experience for Mikano. 