# Proof of Work – CRM Role (Nicholas Feyintola Folarin-Coker)

_Last updated: 25 Jun 2025_

The timeline below lists my key initiatives from June 2024 → June 2025 in chronological order. As a 'team of one', a core part of my process involves leveraging AI as a research and strategy partner to test theories, synthesise information, and accelerate the path to a viable solution.

Under each project, I have listed all key actions taken, the artefacts produced, and the final status or outcome.

---

## 1. Orientation & Division Walkthrough  
Role: CRM Supervisor (solo)  
When: Jun 2024

**All Key Actions**
- Shadowed teams across multiple divisions to map existing processes, including:
  - **Motors**: Sales, After-Sales, and Operations.
  - **Power**: Steel Fabrication, Stores, Engineering/Design, and Maintenance.
  - **Afro-Medical**: General operations.
  - **Group Transport**: Logistics for deliveries, staff travel, and airport pickups.
- Compiled a **30-page orientation report** that documented observed workflows and identified cross-departmental process gaps. The full orientation tour was paused before completion.
- The report was not formally presented, but instead became a critical internal reference document that provided foundational insights for the first CRM plan.

- **Key Artefact**: 30-page orientation report (PDF).
- **Result**: Established an evidence-based baseline of operational realities that directly informed the subsequent CRM roadmap.

---

## 2. Natejsoft CRM Vendor Engagement  
Role: Liaison to Vendor & Internal IT  
When: Jun 2024 – Feb 2025 (Project formally cancelled)

**All Key Actions**
- Attended the single vendor onboarding/training session.
- Mapped the user interface and process flow of the Natejsoft platform to understand its complexities and plan for internal training.
- Bench-marked Natejsoft against two alternative enterprise platforms (incl. a HubSpot trial), evaluating them for cost, complexity, and suitability for the company's maturity level.
- After a prolonged period with no project movement and discovering underlying challenges with manual data entry, learned informally that the project had been cancelled.

- **Key Artefacts**: Vendor proposal pack, comparison matrix.
- **Result**: The external CRM project was shelved, which pivoted all focus towards developing a more realistic, internal MVP using Google Sheets.

---

## 3. CRM Plan v1 – Implementation Blueprint  
Role: Author & Facilitator  
When: Jul – Aug 2024

**All Key Actions**
- Researched various strategies for how a CRM could be successfully implemented within the company's specific culture and technical constraints, using iterative AI conversations to refine the approach.
- Ran **"Deep-Dive" research sessions** (using AI prompts and stakeholder interviews) to capture core pain points and build a feature wish-list.
- Designed and built a **Sales-Tracking MVP** in Google Sheets, which included private PFI tabs for each salesperson to protect lead visibility.
- Conducted a feedback workshop with divisional heads, resulting in an agreement to pilot the tracker MVP instead of purchasing a full CRM.

- **Key Artefacts**: 25-page plan PDF, Deep-Dive session transcripts, MVP tracker (Google Sheets).
- **Result**: The MVP was adopted as a critical stop-gap measure, which successfully surfaced the core adoption bottlenecks (less than 30% logging compliance).

---

## 4. PFI Tracking System (incl. Dependent-Dropdown Automation)  
Role: Designer & Trainer  
When: Sep – Oct 2024

**All Key Actions**
- Iterated through multiple designs (testing complex vs. simple sheets, and the feasibility of using Google Forms) before finalising the script-driven model.
- Extended the Sales-Tracking MVP to automatically flag overdue PFI updates (e.g., "3+ days since last touch").
- Wrote Google Apps Script to auto-split a master PFI list into the **private sheets for each sales representative**, ensuring data privacy and ease of use.
- The script also generated a WhatsApp-ready summary message for daily reminders to the sales team.
- Added dependent dropdowns **(Brand → Model → Trim)** and a phone-number formatter to reduce manual entry errors.
- Recorded a 3-minute walkthrough video, conducted two group training sessions, and provided ongoing one-on-one support via WhatsApp to drive adoption.

- **Key Artefacts**: PFI tracker Sheets, Google Apps Scripts, onboarding video.
- **Result**: The system successfully highlighted the critical adoption gap (only 3 of 10 reps logging consistently). This was found to be caused by a mix of cultural resistance and practical blockers (e.g., reps not having a working laptop or reliable internet at home), providing data that informed the next strategic steps. The system is no longer in active use.

---

## 5. Mikano Website UX Feedback  
Role: QA Tester  
When: Oct 2024

**All Key Actions**
- Audited the new company website and identified 6 critical UX issues (a virtual-tour bug, stretched elements, 3 carousel flaws, and a misaligned CTA).
- Created a 6-slide Google Slides deck that included GIF demonstrations of each issue and clear suggestions for fixes.
- Presented the findings to the development agency.

- **Key Artefact**: Website audit slides.
- **Result**: The agency is currently implementing the fixes, with an expected completion date in the first week of July 2025.

---

## 6. PFI-to-Sales-Invoice Conversion Process
Role: Process Designer & Collaborator with Product & BI Team
When: Nov - Dec 2024

**All Key Actions**
- Following the challenges of the PFI tracker, collaborated with the Product & BI team on a new process to improve data integrity.
- Designed a workflow requiring a PFI to be formally "requested for conversion" into a sales invoice, rather than creating two separate, disconnected documents.
- This aimed to create a hard link between the initial quote and the final sale, providing a single source of truth for each transaction.

- **Key Artefacts**: Process flow diagrams, email correspondence with BI team.
- **Result**: The concept was approved and now informs the BI team's development pipeline. It represents a key step in data tracking, while also highlighting the remaining need to track pre-PFI leads and post-sale account management.

---

## 7. VIN Decoder (ad-hoc utility)  
Role: Developer  
When: Dec 2024 (one-week sprint)

**All Key Actions**
- Built a formula-based Google Sheet to instantly decode a vehicle VIN into its corresponding brand and model.
- Shared the tool with the National Ops Manager for use during vehicle pre-inspection checks.

- **Key Artefact**: VIN Decoder Sheet.
- **Result**: The tool was successfully used by the Ops Manager during vehicle intake processes. It was later superseded by the more advanced Operations Command Centre prototype.

---

## 8. Appointment + Sales Register Merge  
Role: Analyst  
When: May – Jun 2025

**All Key Actions**
- Used Python (Pandas) and Excel to merge a 700-page appointment PDF with the master sales register.
- Identified and highlighted duplicate entries and missing customer IDs in the consolidated data.
- Delivered the consolidated Excel dashboard to management and the BI team via email, requesting formal validation.

- **Key Artefacts**: Consolidated register (Excel), Python merge script.
- **Result**: The data audit is currently in progress, with the BI team's sign-off pending before any Power BI development can proceed.

---

## 9. CRM Plan v2 – Unified Customer-Experience Strategy  
Role: Author  
When: May – Jun 2025

**All Key Actions**
- Conducted extensive research into modern CX strategy frameworks, using AI as a sounding board to pressure-test concepts.
- Synthesized insights from multiple preceding projects—including the Natejsoft failure, the PFI tracker's adoption challenges, and the AI agency discussions—to form a new, holistic **"Process-First" CX blueprint**.
- Authored an executive one-pager and a 28-page operational playbook focused on a pilot in the Motors division.
- Scheduled a formal kickoff with the Product & BI team; when the meeting was not attended, the playbook was circulated via email to serve as the project's official guiding document.

- **Key Artefacts**: CX research results, CX blueprint PDF, one-pager PDF.
- **Result**: The document is now the official reference point for the Motors CX pilot, awaiting a rescheduled kickoff meeting.

---

## 10. Operations Command Centre (Flask)  
Role: Product Lead  
When: Late May 2025 → present

**All Key Actions**
- Evaluated multiple technical frameworks (including Next.js and Streamlit) before selecting Flask for its robustness and control over authentication.
- Initially prototyped a simple data tool in Streamlit; after sharing with the National Sales Manager, pivoted based on feedback to a more robust Flask application.
- Built the Flask app (`operations-flask-app`) to ingest the Dispatch Register and generate interactive, per-brand/vehicle dashboards, which was much better received.
- Added an authentication scaffold and planned an invoice-generator module for future development.
- Currently researching robust deployment strategies and user authentication methods suitable for Flask applications.

- **Key Artefacts**: Flask application repository, deployment research notes, Streamlit prototype files.
- **Result**: Actively solving for deployment and authentication before beginning user acceptance testing with the Motors Ops Team.

---

## 11. AI Agency Proposal & Pricing Benchmark  
Role: Internal Advisor to External AI Consultancy
When: Jun 2025 → present

**All Key Actions**
- Participated in two scoping calls to define high-value use-cases for a RAG-based tool-stack and a WhatsApp bot.
- Provided detailed feedback on the external agency's initial pitch, presentation deck, and pricing, which enabled them to deliver a more tailored final proposal.
- Reviewed and gave insights on the functional WhatsApp bot demo (delivered as a screen recording).
- Ensured a key clause was added to the proposal: the solution must be fully internalised within 12 months, or the retainer is terminated.

- **Key Artefacts**: AI Agency Proposal PDF, pricing comparison XLSX, WhatsApp bot screen recording.
- **Result**: Awaiting the final competitor quotes before presenting the complete business case to senior leadership for a decision.

---

## 12. Gas Division Sales Enablement **(PRIVATE)**  
Role: Product & Data Advisor  
When: May 2025 → present

**All Key Actions**
- Designed a standardized site-visit template and a networking playbook for gas turbine sales opportunities.
- Outlined a digital workflow for lead capture and follow-up.
- Drafted a concept for an operations command-centre, inspired by the Flask project for Motors.

- **Key Artefacts**: Internal playbook and templates.
- **Result**: The draft is currently under internal review and remains confidential.

---

## 13. Ad-Hoc Operational Support & Data Integrity (Ongoing)
Role: Data Steward / Analyst
When: Sep 2024 → present

**All Key Actions**
- Act as the primary point of contact for all issues related to the PFI tracking system.
- Provide real-time data correction for the sales team upon request via WhatsApp (e.g., fixing incorrect PFI entries).
- Manage PFI data reconciliation between the master database and individual salesperson sheets, coordinating with Sales Admin to investigate and resolve discrepancies.

- **Key Artefacts**: (Internal) Ongoing record of support requests and resolutions.
- **Result**: Maintained the day-to-day usability of the PFI tracking system and ensured a higher level of data accuracy than would have existed otherwise.