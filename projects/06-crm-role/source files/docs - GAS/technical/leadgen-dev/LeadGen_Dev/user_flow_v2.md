# User Flow: Automated Lead Generation (v2)

**User:** FT (System Architect & Process Owner) & Sales Partner (Networking & Closing)

**Primary Goal:** Systematically generate and qualify leads to enable the Sales Partner to book 20 qualified sales calls per week for power solutions (generators, IPPs), supplementing the Sales Partner's existing networking-based lead generation.

**Core Principles:**
*   **Hybrid Approach:** Combine the Sales Partner's proven networking/event-based lead generation with a scalable, FT-designed and managed semi-automated outreach system. The system's role is to feed the Sales Partner high-quality, pre-qualified opportunities.
*   **Robust TAM:** The Nigerian market presents a substantial Total Addressable Market. With millions of registered businesses and tens of thousands of entities in power-hungry sectors like manufacturing (thousands), healthcare (~40,000 hospitals/clinics), hospitality (~14,000+ hotels), and large-scale agriculture, achieving 20 additional qualified calls weekly via systematic outreach is feasible.
*   **Systematisation for Scale (FT's Domain):** Rely on defined processes, data management, and tools (selected and implemented by FT) for the scalable part of lead generation.
*   **Message-Market Fit (Nigerian Context):** Continuously test and refine messaging for specific industry segments. Messaging must resonate with Nigerian business needs, emphasizing reliability, cost-savings, and understanding of local operational challenges (e.g., impact of power unreliability). Learn from both the Sales Partner's direct interactions and automated campaign results.
*   **AI Leverage (Strategic & Supervised by FT):** Utilise AI for tasks like data enrichment, initial personalisation assistance, and pattern identification where it adds efficiency without sacrificing the quality and trust essential in the Nigerian market.
*   **Focus on Outcomes:** All system activities, managed by FT, should directly contribute to providing the Sales Partner with leads ready for a meaningful sales conversation.
*   **Manual Insight Gathering (Synergy):**
    *   **Sales Partner's Role:** The Sales Partner continues to gather deep insights from events and direct interactions (Phase 0). These insights (pain points, successful angles, objections, decision-maker personas) are crucial and must be systematically fed back to FT.
    *   **FT's Role:** Deliberately include FT-reviewed checkpoints in the "automated" flow to capture nuanced insights, refine targeting, understand customer pain points from system-generated leads, and improve AI/automation effectiveness.

**Assumptions:**
*   The Sales Partner's personal interactions at events build strong initial rapport and are a primary source of high-value deals.
*   An FT-managed systematic outreach process can effectively supplement and scale lead generation.
*   Publicly available data (news, company databases, industry reports), when enriched and filtered, can indicate a company's likelihood to need power solutions.
*   Targeted, semi-automated outreach, with messaging adapted for Nigerian cultural and business norms, is more effective than generic blasts. Personalisation, even light but contextually relevant, increases response rates.
*   Credibility and trust are paramount; the system must support this.

---

## Phase 0: Relationship-Driven Lead Generation (Sales Partner's Primary Method)

**Trigger:** Sales Partner attends social/industry events, leverages personal network.

1.  **Action (Sales Partner):** Networking & Initial Conversations
    *   **Details:** Discuss power solutions, identify potential needs through conversation, build rapport.
    *   **Output:** Potential leads expressing initial interest.
    *   **Feedback to FT:** Sales Partner shares general themes, common questions, and types of companies showing interest with FT to inform system targeting.

2.  **Action (Sales Partner):** Transition to Direct Communication
    *   **Details:** Exchange contact details, typically leading to WhatsApp conversations or calls.
    *   **Output:** Ongoing dialogue, relationship building.

3.  **Action (Sales Partner):** Deeper Qualification & Site Visits
    *   **Details:** Understand specific needs, power challenges, budget considerations. May involve site visits.
    *   **Output:** Highly qualified leads, proposals, closed deals.
    *   **Systematic Insight Capture:** Sales Partner logs key information from these interactions (e.g., in a shared document/CRM light) detailing customer pain points, decision drivers, successful arguments, and reasons for lost deals. FT uses this to refine system messaging and targeting.

---

## Phase 1: Market Identification & Lead Sourcing (FT-Managed Scalable Outreach System)

**Trigger:** Ongoing process, designed and managed by FT, to supplement Phase 0. Reviewed weekly by FT, with input from Sales Partner.

1.  **Action (FT, with Sales Partner Input):** Define & Refine Target Market Segments for Outreach
    *   **Details:**
        *   Based on Sales Partner's successes and market research, FT identifies primary industries in Nigeria with high power needs (e.g., manufacturing, healthcare, large-scale agriculture, hospitality, real estate development, education).
        *   FT explores vertical (upmarket/downmarket) and horizontal (adjacent industries) expansion opportunities.
        *   FT defines ideal company profiles (size, specific locations/states, specific triggers like "new factory," "expansion plans," "reported power issues," "reliance on expensive diesel generators").
    *   **System (Managed by FT):** Stores these definitions as searchable profiles/criteria.

2.  **Action (System - Automated by FT / Manual - by FT or Assistant):** High-Volume Lead Sourcing for Outreach
    *   **Tools (Selected/Managed by FT):** Company databases (e.g., local directories, Apollo.io if data quality for Nigeria is sufficient, or alternatives), LinkedIn (for company identification, not direct Sales Nav use by FT), industry-specific databases, potentially custom web scraping (e.g., using `spider.cloud` for niche sources or news aggregation, managed by FT).
    *   **Process (FT):** Define search criteria in tools based on market segments.
    *   **Process (System/Assistant):** Extract lead lists (company name, website, industry, location, potentially initial contact *titles* if available – specific names may be harder to get reliably at scale initially). Aim for a large raw list. Store in a central database/CSV managed by FT.
    *   **FT Oversight:** FT periodically reviews raw lists to spot-check relevance, identify potential new/unexpected sources or company types, and assess data quality.

3.  **Action (System - Automated by FT):** Initial Data Cleaning & Deduplication
    *   **Details:** Remove obvious duplicates, incomplete entries from the sourced list.
    *   **System (Managed by FT):** Presents a cleaner, though still raw, list of potential companies for enrichment.

## Phase 2: Automated Enrichment & AI-Assisted Qualification (FT Oversight & Sales Partner Validation)

4.  **Action (System - Automated by FT):** Automated Company & Contact Enrichment
    *   **Tools (Selected/Managed by FT):** APIs from data providers (if cost-effective and Nigeria-relevant data exists), custom web scraping (e.g., `spider.cloud` for company websites, news sites - managed by FT).
    *   **Details:** For each company, FT's system attempts to automatically gather:
        *   More detailed industry classification.
        *   Specific news mentions related to expansion, power challenges, new projects (Nigerian sources prioritized).
        *   Identify *likely* key contact persons/departments (Operations, Procurement, Engineering, C-level) even if direct emails are not immediately found.
    *   **System (Managed by FT):** Populates a richer company profile. Flags companies where critical data (like website, or strong indication of size/need) is missing.
    *   **FT Review:** FT reviews a sample of enriched profiles weekly to validate data quality, assess relevance of news, and ensure automation is capturing useful information for the Nigerian context.

5.  **Action (System - Rule-Based by FT / AI-Assisted, then FT Review & Sales Partner Validation):** Lead Scoring & Prioritisation
    *   **Details (System - FT Designed):** FT implements a scoring model. Factors include:
        *   Industry match (weighted by known power needs).
        *   Recent relevant news (e.g., expansion, power complaints).
        *   Indication of company size or energy consumption (if available).
        *   Completeness of company data.
    *   **Details (FT Review):** FT reviews top-scored companies. Manually adjusts scores or adds qualification notes based on quick research (e.g., website check, recent local news). This step is key to refining the scoring model and catching nuances AI/automation might miss specific to the Nigerian context.
    *   **Sales Partner Validation:** FT shares a list of "High Potential Companies" with the Sales Partner for a quick sanity check based on their market intuition and experience before detailed contact research.
    *   **System (Managed by FT):** Sorts companies by score, flags for Sales Partner validation.

## Phase 3: Contact Identification & Semi-Automated Outreach (FT System, Sales Partner Endorsement)

6.  **Action (FT/Assistant - Manual/Tool-Assisted):** Identify Key Contact Persons & Verify Details
    *   **Details:** For "High Potential Companies" validated by Sales Partner, FT or an assistant manually (or using targeted tools like LinkedIn search for *roles*, then attempting to find email patterns/validation) identifies specific names and email addresses for relevant roles (Operations Director, MD, Chief Engineer, Procurement Head). This is a critical step requiring human oversight for accuracy in the Nigerian context.
    *   **Output:** A list of target contacts with verified (as much as possible) details for the outreach campaign.

7.  **Action (System - AI-Assisted by FT / Manual by FT):** AI-Assisted Personalisation Snippet Generation
    *   **Tools (Managed by FT):** Make.com/Zapier + LLM (GPT-4, Claude) if deemed effective and cost-efficient by FT.
    *   **Process (System):** For the target contacts, FT's system (or FT manually) uses key data (company name, industry, relevant news snippet) to generate potential icebreakers or opening lines for emails/messages.
    *   **Prompt Engineering (FT):** FT crafts and refines prompts to generate culturally appropriate, professional, and relevant snippets. Focus on value proposition for Nigerian businesses.
    *   **FT Review & Approval:** FT *must* review, edit, and approve ALL AI-generated snippets. This ensures relevance, appropriate tone for Nigerian business communication, brand voice, and provides direct feedback for improving prompts. The aim is "good enough" personalisation that feels genuine.

8.  **Action (System - Managed by FT, on behalf of Sales Partner):** Email Campaign Execution
    *   **Tools (Managed by FT):** Cold email platform (e.g., Instantly.ai, Mailshake) with pre-warmed inboxes and domains.
    *   **Process (FT):**
        *   FT sets up email sequences (1-3 emails). Copywriting leverages insights from Sales Partner's Phase 0 interactions and Nigerian business communication norms.
        *   FT loads approved leads (companies + contacts + personalised snippets) into the campaign. Emails are sent appearing to be from the Sales Partner (or a generic company address leading to Sales Partner).
    *   **Value Proposition:** Clearly articulate how your power solutions address specific Nigerian business pain points (e.g., "reduce diesel costs," "ensure continuous production," "power your expansion").
    *   **CTA:** Soft, culturally appropriate CTA (e.g., "Would you be open to a brief introductory call to see if we can help?" or "May I share some information on how we've assisted similar businesses in [City/Industry]?").
    *   **System (Managed by FT):** Sends emails, tracks opens, clicks, replies. FT monitors these metrics.

## Phase 4: Engagement & Call Booking (Sales Partner Lead, FT System Support)

9.  **Action (Sales Partner, with FT Support):** Manage Positive Replies & Book Calls
    *   **Details (Sales Partner):** Sales Partner takes over managing positive replies from outreach campaigns. Responds promptly, often via email initially, potentially moving to WhatsApp/call as per Nigerian norms.
    *   **Details (FT):** FT ensures the system efficiently flags positive replies and funnels them to the Sales Partner.
    *   **Qualification (Sales Partner):** Sales Partner further qualifies the lead during this initial interaction, referencing information gathered by FT's system.
    *   **Booking (Sales Partner):** Uses a scheduling tool (Calendly, SavvyCal) for efficiency.
    *   **Goal:** Convert positive replies from the system-driven outreach into 20 *additional* booked calls per week for the Sales Partner.

10. **Action (FT & Sales Partner):** Track Metrics & Iterate (Across All Phases)
    *   **Metrics (Tracked by FT, Reviewed with Sales Partner):**
        *   Phase 0: Number of event leads, WhatsApp conversations initiated, site visits, proposals from networking (Sales Partner provides data).
        *   Phases 1-4 (System): Leads sourced, enrichment success rate, companies qualified by FT, contacts identified, emails sent, open rate, reply rate, positive reply rate, calls booked from outreach.
    *   **Process (FT & Sales Partner):** Weekly review of all metrics.
        *   Compare effectiveness of Sales Partner's networking vs. FT's system-driven outreach.
        *   Which email angles/segments/personalisation approaches yielded most positive replies/calls?
        *   Adjust TAM targeting, lead scoring criteria, AI prompts, and email copy based on performance from *both* networking and outreach.
    *   **Feedback Loop:**
        *   Sales Partner's insights from Phase 0 and Phase 4 directly inform FT's system refinement (targeting, messaging, qualification criteria).
        *   Successes/failures in automated outreach can highlight new conversation starters or market segments for the Sales Partner's networking.

---

**Key Tools & Infrastructure Considerations (Managed/Selected by FT):**
*   **Lead Sourcing (Outreach):** Company databases (local/international if relevant for Nigeria), LinkedIn (for role/company search, not necessarily paid Sales Nav for FT), specific industry association lists.
*   **Web Scraping (Optional/Targeted, by FT):** `spider.cloud` or similar for news, company websites.
*   **Data Enrichment:** Potentially APIs (if good Nigerian data), or custom scraping.
*   **AI Personalisation/Assistance (FT Supervised):** Make.com/Zapier + LLM (GPT-4, Claude).
*   **Email Sending:** Instantly.ai / Mailshake (with multiple, warmed-up domains/inboxes).
*   **CRM/Lead Management (Simple & Effective):** A robust Google Sheet/Airtable, or a simple CRM, to track leads from all sources, managed by FT. Accessible by Sales Partner.
*   **Scheduling:** Calendly / SavvyCal (for Sales Partner).
*   **Communication (Sales Partner):** WhatsApp, Email, Phone.

**Open Questions/Refinement Areas for FT & Sales Partner Discussion:**
*   **Sales Partner Feedback Mechanism:** Formalise how the Sales Partner regularly inputs their qualitative insights into FT's system refinement loop.
*   **Cost-Benefit of Tools:** FT to continually evaluate subscription costs vs. value for the Nigerian market.
*   **Depth of Personalisation (Outreach):** Balance speed/volume (system) with personalisation depth (FT/Assistant oversight). What's the 80/20 for the Nigerian context?
*   **A/B Testing:** FT to systematically test email copy, CTAs, and subject lines.
*   **Defining "Qualified Call" (for Outreach):** Clear, mutually agreed criteria between FT and Sales Partner before a lead is passed for a call.
*   **Interviewing Sales Partner:** FT to conduct structured interviews with Sales Partner to deeply codify existing successful strategies, objections, and customer profiles to build into the system's logic.
*   **Data Privacy & Compliance:** Ensure any data handling meets local regulations. 