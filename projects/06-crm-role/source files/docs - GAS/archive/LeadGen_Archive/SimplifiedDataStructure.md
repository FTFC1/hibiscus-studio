# Simplified Lead Management Data Structure

## Overview

This document outlines a streamlined approach to storing and managing IPP lead data. We've simplified the system to three essential tabs that capture all necessary information while eliminating redundancy.

## Core Principles

1. **Simplicity** - Only collect data that drives actionable outcomes
2. **Automation** - Structure optimized for programmatic updates
3. **Relationships** - Clear connections between entities via ID fields
4. **Prioritization** - Built-in scoring to focus on highest-value leads

## Google Sheet Structure

### Tab 1: Leads

The central repository of company information, with one row per company.

| Field | Data Type | Purpose | Example |
|-------|-----------|---------|---------|
| Company ID | Text | Unique identifier linking all tables | MIK001 |
| Company Name | Text | Primary identifier | Dangote Cement |
| Industry | Text | Sector categorization | Manufacturing |
| Region | Text | Geographic location | Lagos |
| Address | Text | Physical location | 1 Alfred Rewane Road, Ikoyi |
| Power Est. (kW) | Number | Estimated power requirement | 5000 |
| Est. Basis | Text | Source of power estimate | Industry Average |
| Current IPP Provider | Text | Existing provider if any | Self-generation |
| Lead Source | Text | How lead was identified | News |
| News Trigger | Text | Related news ID if applicable | NEWS001 |
| Priority Score | Number | Conversion likelihood (1-5) | 4 |
| Status | Text | Pipeline stage | Contacted |
| Decision Makers | Text | Key contacts | CFO: John Smith |
| Next Steps | Text | Planned actions | Schedule site visit |
| Next Steps Due | Date | Deadline for next action | 2023-10-15 |
| Created Date | Date | When record was created | 2023-10-01 |

### Tab 2: Activity

All interactions with prospects, with multiple rows possible per company.

| Field | Data Type | Purpose | Example |
|-------|-----------|---------|---------|
| Activity ID | Text | Unique identifier | ACT001 |
| Date | Date | When activity occurred | 2023-10-02 |
| Company ID | Text | Link to Leads tab | MIK001 |
| Contact Person | Text | Who you spoke with | John Smith |
| Activity Type | Text | Nature of interaction | Email/Call/Meeting |
| Summary | Text | Brief description | Discussed power requirements |
| Outcomes | Text | Results of interaction | Interested in site assessment |
| Next Steps | Text | Planned follow-up | Send technical specs |
| Follow-up Date | Date | When to follow up | 2023-10-09 |
| Created By | Text | Who recorded activity | Nicholas |

### Tab 3: News Triggers

News items that might lead to opportunities, with multiple companies possibly mentioned in each.

| Field | Data Type | Purpose | Example |
|-------|-----------|---------|---------|
| News ID | Text | Unique identifier | NEWS001 |
| Date | Date | Publication date | 2023-10-01 |
| Source | Text | Publication name | BusinessDay |
| Headline | Text | Article title | Dangote Announces Expansion |
| URL | Text | Link to article | https://businessday.ng/... |
| Category | Text | Type of news | Expansion |
| Companies Mentioned | Text | Related companies | Dangote Cement, BUA Cement |
| Action Taken | Text | Follow-up status | Contacted |
| Created Date | Date | When record was created | 2023-10-01 |

## Data Relationships

```
┌─────────────────┐     contains     ┌─────────────────┐
│    NEWS_001     │◄────companies────┤    MIK_001      │
│  News Trigger   │     mentioned    │   Lead Record   │
└─────────────────┘                  └─────────────────┘
                                            ▲
                                            │
                                            │
                                     references company
                                            │
                                            │
                                     ┌─────────────────┐
                                     │     ACT_001     │
                                     │  Activity Log   │
                                     └─────────────────┘
```

## Automation-Friendly Design

This structure is designed for easy programmatic updates:

1. **News scraping** adds records to News Triggers
2. **Company research** adds records to Leads
3. **Outreach automation** adds records to Activity
4. **Relationship building** links News IDs to Leads and Activity records

## Enhanced Gas Leads Dataset

The existing Gas Leads.xlsx file will be imported into this structure with the following enhancements:

1. **Power Estimation**
   - Industry-specific benchmarks applied to each company
   - Formula-based calculations for different facility types
   - Confidence scoring for estimates

2. **Cost Savings Projection**
   - Estimated current electricity costs based on power usage
   - Projected 35% savings with IPP solution
   - Annual cost savings in Naira

3. **Prioritization Scoring**
   - Automated scoring based on power requirements
   - Higher scores for industries with stable power needs
   - Location factor based on gas availability

4. **Decision-Maker Identification**
   - Automated lookup from LinkedIn/web research
   - Title-based targeting (Operations Director, CFO, etc.)
   - Contact method identification (email, LinkedIn, phone)

## Visual Dashboard

The simplified structure supports a visual dashboard with:

1. **Lead Pipeline**
   - Count and percentage at each stage
   - Estimated MW and revenue by stage
   - Conversion metrics between stages

2. **Geographic Distribution**
   - Map view of leads by region
   - Heat map based on power requirements
   - Gas availability overlay

3. **Industry Breakdown**
   - Lead count by industry
   - Power requirement by industry
   - Conversion rates by industry

4. **Activity Timeline**
   - Past activities by date
   - Upcoming follow-ups
   - Activity type distribution

## Migration Path

To move from the existing data to this simplified structure:

1. Create new Google Sheet with the three tabs
2. Import Gas Leads.xlsx data into Leads tab
3. Generate unique Company IDs for each record
4. Create initial Activity entries for any previous contacts
5. Backfill News Triggers if any exist

## Practical Benefits

1. **50% less data entry** with streamlined fields
2. **75% faster lookups** with relational structure
3. **Near-zero redundancy** between tables
4. **Full automation compatibility** with consistent IDs
5. **Clear prioritization** with automated scoring 