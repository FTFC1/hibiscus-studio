# Mikano IPP Lead Management System

## Overview

This document outlines a streamlined approach for tracking IPP leads between two people (you and your sales partner) using a simple Google Sheet. The goal is to avoid duplication of effort while maintaining an aggressive outreach strategy.

## Google Sheet Structure

### 1. Leads Tab
   - Main database with all prospect information
   - Each lead has a unique **Lead ID** (auto-generated number)
   - Filter/sort by any field for easy management

### 2. Activity Log Tab
   - Links to Leads tab via **Lead ID** and **Company Name** fields
   - Records all interactions chronologically
   - Makes it easy to see full history with any prospect

### 3. Pipeline Summary Tab
   - Automated counts of leads by stage
   - Summary of total kW in pipeline
   - Estimate of potential revenue

## Essential Lead Database Fields

| Field | Description | Example |
|-------|-------------|---------|
| Lead ID | Unique identifier | MIK001 |
| Company Name | Legal entity name | Dangote Cement Plc |
| Address | Primary location | 1 Alfred Rewane Road, Ikoyi |
| Region | Geographic area | Lagos/Abuja |
| Industry | Primary sector | Manufacturing - Cement |
| Size Category | By employee count | Large (1000+) |
| Power Est. (kW) | Estimated requirement | 5000 kW |
| Est. Basis | How the power estimate was determined | Facility size/Industry average |
| Status | Stage in pipeline | Initial Contact |
| Last Activity | Most recent action | Discovery call (2023-06-20) |
| Decision Makers | Key contacts identified | CFO: John Smith, Facilities Mgr: Mary Johnson |
| Notes | Relevant details | Interested but wants technical review |
| Next Steps | Planned follow-up actions | Schedule site assessment |
| Priority | Conversion potential | High/Medium/Low |
| IPP Provider | Current provider if any | None |
| Engines Required | Technical specification | TBD |

## Activity Log Structure

| Field | Description | Example |
|-------|-------------|---------|
| Date | When activity occurred | 2023-06-20 |
| Lead ID | Matches ID in Leads tab | MIK001 |
| Company Name | For easy reference | Dangote Cement Plc |
| Contact Person | Who you interacted with | John Smith |
| Activity Type | Type of interaction | Call/Email/Meeting |
| Summary | Brief description | Discussed power requirements |
| Outcomes | Results of interaction | Interested, requested proposal |
| Next Steps | Follow-up actions | Send proposal by Friday |

## Simple Conflict Prevention

1. **Check Before Contacting**
   - Quick search of the shared Google Sheet before reaching out to a new company
   - Focus especially on larger/high-profile companies most likely to be targeted by both

2. **Accidental Overlap**
   - If a prospect mentions being already contacted by your partner:
     - "I apologize for the confusion. My colleague and I work closely together on these projects."
     - "Let me coordinate with them and ensure you receive a consistent experience."
   - Discuss with partner who has the stronger relationship to determine who continues engagement

3. **Record All Interactions**
   - Document each contact with decision-makers immediately
   - Add new companies to the sheet as soon as they're identified
   - Update status after each meaningful interaction

## Importing Existing Leads

### From "Gas Leads.xlsx"

The existing Excel file contains valuable lead information across these tabs:
- Main sheet with location, industry, required power, and remarks
- Client information with IPP provider details and priority levels
- General leads for additional prospects

Steps to import:
1. Create the Google Sheet with all defined fields
2. Copy data from Excel, mapping to appropriate columns
3. Generate unique Lead IDs for all existing entries
4. Standardize status fields based on current information

## Building Your Lead List

### Sources for New Leads

1. **Industry Directories**
   - Manufacturers Association of Nigeria (MAN) directory
   - Nigerian Association of Chambers of Commerce (NACCIMA) listings
   - Industry-specific associations (pharmaceutical, textile, etc.)

2. **LinkedIn Research**
   - Search for facilities managers, operations directors in target sectors
   - Filter by company size and location (Lagos/Abuja focus)
   - Connect with 5-10 new prospects weekly

3. **Google Maps Industrial Areas**
   - Identify large facilities in industrial zones
   - Look for visual indicators of manufacturing (cooling towers, etc.)
   - Use satellite view to estimate facility size

4. **News Monitoring**
   - Set Google Alerts for "new factory Nigeria" and similar terms
   - Monitor business publications for expansion announcements
   - Track tender notices for new facilities

## Focus Areas

### Geographic Focus

Primary focus on Lagos and Abuja regions, where you and your sales partner have strongest networks and easiest access.

### Industry Priorities

1. **Manufacturing**
   - Food & Beverage 
   - Pharmaceuticals
   - Textiles
   - Plastics

2. **Commercial/Hospitality**
   - Hotels
   - Shopping malls
   - Office complexes

3. **Public/Government**
   - Based on your partner's existing relationships

## Managing Multi-Stakeholder Accounts

Large companies typically require engaging with multiple decision-makers:

1. **Contact Documentation**
   - Create separate rows in the spreadsheet for each decision-maker contacted
   - Link them with a common company ID or clear naming
   - Track individual relationship progress separately

2. **Decision-Maker Map**
   - For promising prospects, create a simple decision-maker map showing:
     - Names and titles of key stakeholders
     - Their role in the decision process
     - Current stance (supportive, neutral, skeptical)
     - Your relationship status with each

3. **Multi-Site Opportunities**
   - Track each significant site as a separate opportunity
   - Cross-reference related sites in the notes field
   - Prioritize sites with highest power requirements or most accessible gas supply

## Practical Usage Tips

1. **Daily Check-in Routine**
   - Quick 5-minute review of sheet each morning
   - Filter for recent activities and updates
   - Plan day's outreach based on priority leads

2. **Weekly Pipeline Update**
   - Brief call with your partner to discuss:
     - New high-potential leads identified
     - Stuck opportunities needing help
     - Successful approaches to share
   - Update statuses and next steps

3. **Effective Note-Taking**
   - Keep notes focused on actionable insights
   - Include specific technical details relevant to qualification
   - Record objections and areas of interest for targeted follow-up

## Streamlined Lead Documentation

### Quick Add Form

Create a Google Form linked to your spreadsheet for rapid addition of new leads with essential fields:

```
QUICK LEAD ADDITION

Basic Information:
- Company Name: ____________________
- Location (City): ____________________
- Industry: ____________________
- Estimated Size: ____________________
- Estimated Power Requirement: ____________________
- Basis for Estimate: ____________________

Contact Information:
- Primary Contact Name: ____________________
- Title: ____________________
- Phone/Email: ____________________

Discovery Information:
- How Identified: ____________________
- Key Pain Points: ____________________
- Priority Level: ____________________
- Next Action: ____________________
```

### Decision-Maker Meeting Notes Template

For consistency in documenting important meetings:

```
MEETING NOTES

Company: ____________________
Date: ____________________
Location: ____________________

Attendees:
- From [Company]: ____________________
- From Mikano: ____________________

Current Power Situation:
- Existing Setup: ____________________
- Main Challenges: ____________________
- Cost Implications: ____________________

Technical Insights:
- Estimated Load: ____________________
- Facility Constraints: ____________________
- Gas Access Situation: ____________________

Decision Process:
- Key Decision-Makers: ____________________
- Timeline: ____________________
- Budget Authority: ____________________

Next Steps:
- Mikano Actions: ____________________
- Client Actions: ____________________
- Follow-up Date: ____________________
```

## Implementation in One Day

### Morning (1-2 Hours)
1. Create Google Sheet with all tabs and columns
2. Set up basic filtering and conditional formatting
3. Create linked Google Form for quick lead addition

### Afternoon (2-3 Hours)
1. Import all existing prospects from "Gas Leads.xlsx"
2. Schedule 30-minute coordination call with sales partner
3. Begin using system for all new outreach

## Practical Benefits

1. **Zero Redundancy**: Avoid embarrassing duplicate contacts
2. **Better Insights**: Learn from each other's successful approaches
3. **Improved Follow-up**: Never lose track of promising leads
4. **Focused Effort**: Prioritize highest-potential opportunities
5. **Easy Reporting**: Quickly generate pipeline summaries 