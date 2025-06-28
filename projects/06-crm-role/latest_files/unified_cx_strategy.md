# Unified Customer Experience Strategy v13
## Mikano International Limited

---

## 🔹 Executive Summary

**The Goal**: To implement a single, unified customer experience strategy that boosts satisfaction, improves internal processes, and drives revenue growth across all divisions.

**The Strategy**: This is a ground-up, manual-first plan focused on perfecting our process discipline before investing in expensive technology. We will build a simple, robust foundation using Microsoft Excel, a tool we already own and control. The core principles are:
1.  **ERP is the King**: The ERP is the single source of truth for all financial and master customer data. Our system works with it, not against it.
2.  **Data-Driven Rules**: We will use data to solve operational problems like sales territory disputes, removing ambiguity and emotion from decisions.
3.  **Pragmatic & Manual-First Technology**: We start with Excel because it is powerful, flexible, and has zero incremental cost. We will define clear, data-driven triggers for when to consider investing in a formal CRM system.

---

## 🔹 Phased Action Plan

| Phase | Task # | Task Description | Key Deliverable(s) | Est. Timeline |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0: Discovery** | 1 | Hold Kickoff Meeting | Presentation of this doc, verbal buy-in from stakeholders | Week 1 |
| **Phase 0: Discovery**| 2 | Gather Initial Answers | Documented answers to the "Open Questions" section | Week 2 |
| **Phase 1: Foundation** | 3 | Finalise & Build Excel Hub | The final, blank Excel file, saved on OneDrive | Week 3 |
| **Phase 1: Foundation** | 4 | Define Data & Governance Roles | Names assigned to "Data Steward" and ERP export roles | Week 4 |
| **Phase 1: Foundation** | 5 | Create Guides & Train Staff | 1-page user guide created; Training session completed | Weeks 5-6 |
| **Phase 2: Go-Live** | 6 | Communicate Go-Live | Company-wide email announcing the Go-Live date | Week 7 |
| **Phase 2: Go-Live** | 7 | Initial Data Synchronisation | First ERP export is loaded into the Excel Hub | Week 7 |
| **Phase 2: Go-Live** | 8 | Conduct First Weekly CX Review | First meeting held using the Excel Hub as the data source | Week 8 |
| **Phase 3: Refine** | 9 | Establish Regular Cadence | Weekly CX reviews and data exports are standard procedure | Weeks 9-12 |
| **Phase 3: Refine** | 10 | Gather User Feedback | Formal feedback session with users held | End of Week 12 |
| **Phase 3: Refine** | 11 | Iterate & Improve | V1.1 of the Excel Hub is released based on feedback | End of Week 12 |

---
## 🔹 A Note on Technology: ERP & The Excel Hub
The ERP remains the ultimate source of truth for all financial and customer master data. It is our system of record.

However, feedback suggests that the ERP can be cumbersome and slow for the kind of rapid, real-time interaction logging that sales and service teams require. This can lead to poor data quality, as staff may avoid logging interactions altogether.

The **Excel Interaction Hub** is a pragmatic first step to solve this. It provides a fast, user-friendly tool that lowers the barrier to data entry. The goal is to **increase compliance and capture the vital customer conversations we are currently losing**. By proving the value of consistent logging in a tool people will actually use, we create a rich dataset that could, in the future, be integrated back into the ERP.

---

## 🔹 The Core System: Structure & Rules

The system is a single Excel workbook with three tabs, stored on a shared OneDrive.

| Tab Name | Purpose | Key Columns |
| :--- | :--- | :--- |
| **Accounts** | Lists business entities. One company per row. | `Account ID`, `Company Name`, `Industry`, `ERP Customer ID`, `Account Owner` |
| **Contacts** | Lists people we talk to. One person per row. | `Contact ID`, `Full Name`, `Job Title`, `Associated Account ID` |
| **Interactions**| Logs every meaningful interaction. One row per interaction. | `Interaction ID`, `Date`, `Contact ID`, `Channel`, `Notes`, `Next Action`, `Logged By` |

### Rules of Engagement: Solving Sales Conflicts

| Trigger | Action | Outcome |
| :--- | :--- | :--- |
| A deal is successfully closed for an Account. | The closing salesperson's name is entered into the `Account Owner` field in the **Accounts Tab** of the Excel Hub. | This salesperson is now the designated point of contact and is responsible for leading future opportunities with this Account. |

---

## 🔹 Customer Journey Maps

### Motors Division (B2C & Small Business)
*   **1. Awareness & Consideration**
    *   **Problem**: Customers often only think about price.
    *   **Solution**: Showcase our full value proposition (6-year warranty, service quality, awards) in all marketing.
    *   **Why it Matters**: This shifts the conversation from cost to long-term value and builds trust early.
*   **2. Purchase**
    *   **Problem**: A slow or inconsistent sales process can lose a customer's interest.
    *   **Solution**: Enforce a <12 hour response time for all inquiries and use a standardised test drive checklist.
    *   **Why it Matters**: Speed and professionalism demonstrate respect for the customer's time and build confidence in our brand.
*   **3. Onboarding**
    *   **Problem**: A poor handover can ruin an otherwise great buying experience.
    *   **Solution**: Use a delivery checklist and book the first service at the point of delivery.
    *   **Why it Matters**: This creates a seamless transition to ownership and shows we are invested in the customer's long-term satisfaction.
*   **4. Usage & Loyalty**
    *   **Problem**: Customers fear hidden costs in servicing.
    *   **Solution**: Provide a detailed service quote for approval **before** any work begins.
    *   **Why it Matters**: This transparency eliminates surprises, builds immense trust, and encourages repeat business.

### Power & Industrial Division (B2B)
*   **1. Lead Generation**
    *   **Problem**: High-value leads can get lost or delayed if not routed correctly.
    *   **Solution**: Capture all leads in the Excel Hub and route them to the correct specialist within 4 business hours.
    *   **Why it Matters**: Speed is a competitive advantage. Fast follow-up shows the client they are a priority.
*   **2. Technical Qualification**
    *   **Problem**: Misunderstanding a client's technical needs leads to incorrect proposals and wasted time.
    *   **Solution**: Use a standardised discovery checklist for all initial client conversations, logged in the Hub.
    *   **Why it Matters**: This ensures we have all the data needed to create an accurate and compelling proposal the first time.
*   **3. Proposal & Negotiation**
    *   **Problem**: Negotiations can stall without clear records of what was discussed and agreed.
    *   **Solution**: Log all key negotiation points (discounts, scope changes) in the Interactions tab.
    *   **Why it Matters**: This creates a clear audit trail, reduces "he said, she said" arguments, and supports a professional negotiation process.
*   **4. Project Delivery & Support**
    *   **Problem**: A clumsy handover from Sales to Operations can lead to day-one customer frustration.
    *   **Solution**: Schedule the first preventative maintenance visit during the official project handover meeting.
    *   **Why it Matters**: This provides a smooth transition and demonstrates our long-term commitment to the client's operational success.

### Medical Division (B2B2C)
*   **1. Distributor Identification**
    *   **Problem**: We have no central, organised list of potential distribution partners.
    *   **Solution**: Maintain a target list of potential partners in the Accounts tab of the Hub.
    *   **Why it Matters**: This provides a clear, actionable target list for the sales team to focus their efforts on.
*   **2. Distributor Onboarding**
    *   **Problem**: New distributors may not have the information they need to start selling effectively.
    *   **Solution**: Create a standard "Distributor Onboarding Kit" with all necessary product and sales information.
    *   **Why it Matters**: A structured onboarding process helps distributors become productive and profitable faster.
*   **3. Distributor Management**
    *   **Problem**: It's hard to know which distributors are performing well and which need support.
    *   **Solution**: Use data from the Hub to conduct quarterly business reviews (QBRs) with top partners.
    *   **Why it Matters**: This provides a regular forum to set shared goals, solve problems early, and show our commitment, which builds loyalty and volume.
*   **4. Downstream Support**
    *   **Problem**: Quality feedback from end-users (hospitals) may not reach us quickly.
    *   **Solution**: Establish a clear process for distributors to escalate quality flags, tracked in the Hub.
    *   **Why it Matters**: This allows us to identify and resolve potential product issues quickly, protecting our brand reputation.

---

## 🔹 Key Performance Indicators (KPIs)

### Motors Division
*   **Inquiry-to-Quote Rate (Target: >60%)**: Percentage of qualified inquiries that receive a formal quote.
*   **Quote-to-Purchase Rate (Target: >40%)**: Percentage of quotes that convert to a sale.
*   **First-Contact Resolution Rate (Target: >80%)**: Percentage of after-sales issues resolved in a single interaction.

### Power, Construction & Industrial (B2B)
*   **Lead Response Time (Target: <4 Hours)**: Time from inquiry received to first meaningful contact by a specialist.
*   **Proposal Win Rate (Target: >35%)**: Percentage of submitted proposals that are won.
*   **Average Sales Cycle Length (Target: <90 Days)**: Average time from lead qualification to a signed contract.

### Medical Division
*   **New Distributor Acquisition Rate (Target: 2/quarter)**: Number of new, qualified distribution partners signed.
*   **Average Order Volume (Target: +10% YoY)**: The average monetary value of a single order from a distributor.
*   **Time-to-Resolve Quality Flags (Target: <48 Hours)**: Time from when a quality issue is flagged to when a resolution plan is confirmed.

### GRAS Restaurant & Cube 65 Clinic
*   **Average Spend Per Customer (Target: +15% YoY)**: The average amount a customer spends in a single visit.
*   **Repeat Customer Rate (Target: >50%)**: Percentage of customers who return for another visit within 6 months.
*   **Online Review Score (Target: 4.5+ Stars)**: Average score across major review platforms.

---

## 🔹 Critical Success Factors & Risk Mitigation

### Risk 1: Poor User Adoption
*   **The Problem**: Busy staff see this as "extra work."
*   **The "What's In It For Me?" (WIIFM)**:
    *   **For Sales**: Prove your work, secure your commission.
    *   **For Service/Ops**: Look professional, have full customer history.
    *   **For Management**: Get a clear pipeline view without chasing people.
*   **Mitigation**: The new weekly cross-functional CX review will run exclusively from the Excel Hub. If it's not in the Hub, it's not discussed.

### Risk 2: Data Quality ("Garbage In, Garbage Out")
*   **Mitigation**: **1. Search First**: Always check if a record exists before creating a new one. **2. Standard Naming**: Use official company names. **3. Data Stewards**: Assign one person per division to be responsible for data hygiene.

### Risk 3: Politics & Complexity
*   **Mitigation**: Management must define the **cross-divisional sales compensation model** before this project goes live. Clarity is essential for collaboration.

### Risk 4: Scalability
*   **Mitigation**: We will start a formal CRM evaluation project when any two of these are true: Excel file > 100MB, file takes >10s to open, Data Stewards spend >2hrs/wk cleaning data.

---

## 🔹 Open Questions for Discovery Phase

### Overall Strategy & Governance
1.  Which divisions are officially in-scope for Phase 1 of this project?
2.  What is the single most important outcome management wants to see from this in the first 3 months?
3.  What is the policy for cross-divisional sales compensation?

### Data & ERP Team
1.  What are the unique identifiers for customers in the ERP? Can we use this as the `ERP Customer ID`?
2.  Can we export records based on "last modified date" to avoid full exports?
3.  How frequently can we run exports without impacting system performance?

### Sales & Marketing Teams
1.  What is the current process for handing off a lead from an inbound call?
2.  How is "Account Ownership" decided and disputed today?
3.  What are the most common reasons we lose a deal after sending a quote?

### Division-Specific Questions
*   **Motors**:
    1.  Besides price, what is the biggest reason a customer chooses a competitor over us?
    2.  What one piece of information would make the vehicle handover process smoother?
*   **Power & Industrial**:
    1.  What are the exact steps to determine if an inbound lead is "qualified"?
    2.  What does a "technical consultation" actually involve? A site visit, a call, or a document review?
*   **Medical**:
    1.  How do we currently find potential distributors?
    2.  What is the most important thing a distributor needs from us to be successful (besides the product)?
    3.  What does the onboarding process for a new distributor look like today? 