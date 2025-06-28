# Lead Management Google Sheet Template

## Sheet 1: Leads Database

| Column | Description | Data Type | Notes |
|--------|-------------|-----------|-------|
| Company ID | Unique identifier | Text (e.g., MIK001) | Auto-generated |
| Company Name | Legal name | Text | Primary identifier |
| Industry | Primary sector | Dropdown | Manufacturing, Hospitality, etc. |
| Region | Location | Dropdown | Lagos, Abuja, etc. |
| Address | Physical location | Text | Full address |
| Gas Availability | Gas access status | Dropdown | Pipeline, CNG Possible, No Gas |
| Size Category | Company size | Dropdown | Small, Medium, Large |
| Power Est. (kW) | Power requirement | Number | Current estimate |
| Est. Basis | How power estimate derived | Dropdown | News, Industry Average, Site Visit |
| Current IPP Provider | Existing provider | Text | Current provider if any |
| Lead Source | How lead was identified | Dropdown | News, Partner, Registry, etc. |
| News Trigger | Specific news item | Text | Brief description of news |
| News Date | When news occurred | Date | Date of news publication |
| News URL | Link to news source | Hyperlink | URL to news article |
| Priority Score | Conversion likelihood | Number (1-5) | Auto-calculated based on rules |
| Status | Current stage | Dropdown | New, Contacted, Meeting, Proposal, Closed |
| Last Activity Date | Most recent contact | Date | Auto-updated from Activity tab |
| Last Activity Type | Type of last activity | Text | Auto-updated from Activity tab |
| Decision Makers | Key contacts | Text | Comma separated names/roles |
| Notes | Additional information | Text | Brief notes |
| Next Steps | Planned actions | Text | Next planned action |
| Next Steps Due | Due date for next steps | Date | When next action is due |
| Created By | Who added the lead | Text | Your name or partner |
| Created Date | When added | Date | Auto-timestamp |
| Modified Date | Last modification | Date | Auto-timestamp |

## Sheet 2: Activity Log

| Column | Description | Data Type | Notes |
|--------|-------------|-----------|-------|
| Activity ID | Unique identifier | Text (e.g., ACT001) | Auto-generated |
| Date | When activity occurred | Date | When interaction happened |
| Company ID | Link to Leads tab | Text | Must match ID in Leads tab |
| Company Name | For easy reference | Text | Auto-filled based on Company ID |
| Contact Person | Who you interacted with | Text | Name of contact |
| Role/Title | Position at company | Text | Position of contact |
| Activity Type | Nature of interaction | Dropdown | Call, Email, Meeting, etc. |
| Activity Trigger | What prompted activity | Dropdown | Follow-up, News Response, etc. |
| Summary | Brief description | Text | What was discussed |
| Outcomes | Results of interaction | Text | Decision, interest level, etc. |
| Next Steps | Planned follow-up | Text | What happens next |
| Follow-up Date | When to follow up | Date | When next contact is planned |
| Created By | Who recorded activity | Text | Your name or partner |
| Created Date | When recorded | Date | Auto-timestamp |

## Sheet 3: News Triggers

| Column | Description | Data Type | Notes |
|--------|-------------|-----------|-------|
| News ID | Unique identifier | Text (e.g., NEWS001) | Auto-generated |
| Date | Publication date | Date | When news was published |
| Source | Publication name | Text | BusinessDay, etc. |
| URL | Link to article | Hyperlink | Full URL |
| Headline | Article title | Text | Exact headline |
| Category | Type of news | Dropdown | Expansion, Energy, Investment, Regulatory |
| Companies Mentioned | Relevant companies | Text | All mentioned companies |
| Lead IDs | Connected leads | Text | Comma-separated IDs |
| Relevance Score | Importance | Number (1-5) | How relevant to IPP opportunity |
| Summary | Brief description | Text | Key points from article |
| Action Taken | Follow-up actions | Dropdown | Researched, Contacted, No Action |
| Action Date | When action taken | Date | When follow-up occurred |
| Created By | Who added news | Text | Your name or partner |
| Created Date | When added | Date | Auto-timestamp |

## Sheet 4: Pipeline Summary

### Section 1: Current Pipeline Status

| Status | Count | Est. Power (kW) | Est. Revenue | Avg. Days in Stage |
|--------|-------|-----------------|--------------|-------------------|
| New | =COUNTIF(Leads!$P$2:$P$1000,"New") | =SUMIF(Leads!$P$2:$P$1000,"New",Leads!$H$2:$H$1000) | Formula | Formula |
| Contacted | =COUNTIF(Leads!$P$2:$P$1000,"Contacted") | =SUMIF(Leads!$P$2:$P$1000,"Contacted",Leads!$H$2:$H$1000) | Formula | Formula |
| Meeting | =COUNTIF(Leads!$P$2:$P$1000,"Meeting") | =SUMIF(Leads!$P$2:$P$1000,"Meeting",Leads!$H$2:$H$1000) | Formula | Formula |
| Proposal | =COUNTIF(Leads!$P$2:$P$1000,"Proposal") | =SUMIF(Leads!$P$2:$P$1000,"Proposal",Leads!$H$2:$H$1000) | Formula | Formula |
| Closed Won | =COUNTIF(Leads!$P$2:$P$1000,"Closed Won") | =SUMIF(Leads!$P$2:$P$1000,"Closed Won",Leads!$H$2:$H$1000) | Formula | Formula |
| Closed Lost | =COUNTIF(Leads!$P$2:$P$1000,"Closed Lost") | =SUMIF(Leads!$P$2:$P$1000,"Closed Lost",Leads!$H$2:$H$1000) | Formula | Formula |
| TOTAL | =SUM(Above) | =SUM(Above) | =SUM(Above) | Average |

### Section 2: Lead Source Analysis

| Source | Count | Conversion Rate | Avg. Deal Size | Time to Close |
|--------|-------|-----------------|----------------|---------------|
| News | =COUNTIF(Leads!$K$2:$K$1000,"News") | Formula | Formula | Formula |
| Partner | =COUNTIF(Leads!$K$2:$K$1000,"Partner") | Formula | Formula | Formula |
| Registry | =COUNTIF(Leads!$K$2:$K$1000,"Registry") | Formula | Formula | Formula |
| Referral | =COUNTIF(Leads!$K$2:$K$1000,"Referral") | Formula | Formula | Formula |
| Other | =COUNTIF(Leads!$K$2:$K$1000,"Other") | Formula | Formula | Formula |

### Section 3: News Category Performance

| Category | Leads Generated | Meeting Rate | Proposal Rate | Close Rate |
|----------|-----------------|--------------|---------------|------------|
| Expansion | Formula | Formula | Formula | Formula |
| Energy | Formula | Formula | Formula | Formula |
| Investment | Formula | Formula | Formula | Formula |
| Regulatory | Formula | Formula | Formula | Formula |

### Section 4: Follow-up Actions Due

| Action | Company | Due Date | Assigned To | Priority |
|--------|---------|----------|-------------|----------|
| Dynamic data from Leads tab based on Next Steps Due | | | | |

## Sheet 5: Weekly News Summary

| Week | Total Articles | Relevant Articles | Leads Generated | Companies Researched | Contacts Made |
|------|----------------|-------------------|-----------------|----------------------|---------------|
| Current | Formula | Formula | Formula | Formula | Formula |
| Previous | Formula | Formula | Formula | Formula | Formula |
| Change % | Formula | Formula | Formula | Formula | Formula |

## Sheet 6: Data Validation Lists

This sheet contains all the dropdown lists used throughout the sheet:
- Industry list
- Region list
- Lead Status options
- Activity Types
- News Categories
- etc.

## Formulas and Automation

### Priority Score Calculation (Auto-calculated in Leads tab)
```
=IF(AND(ISBLANK(H2),ISBLANK(M2)),1,
  IF(AND(NOT(ISBLANK(H2)),N2>TODAY()-30),5,
    IF(AND(NOT(ISBLANK(H2)),N2>TODAY()-90),4,
      IF(AND(NOT(ISBLANK(H2)),NOT(ISBLANK(M2))),3,
        IF(NOT(ISBLANK(M2)),2,1)))))
```
Where:
- H2 = Power Est. (kW)
- M2 = News Trigger
- N2 = News Date

### Last Activity Update (Auto-updated in Leads tab)
```
=IFERROR(VLOOKUP(A2,Activity!C:E,2,FALSE),"None")
=IFERROR(VLOOKUP(A2,Activity!C:G,5,FALSE),"None")
```

### News Trigger Email Template Helper
```
=IF(NOT(ISBLANK(M2)),"Dear "& S2 &",

I noticed in "& L2 &" that "& B2 &" was mentioned regarding "& M2 &". 

Given Mikano's experience with similar companies in the "& C2 &" sector, I thought it would be valuable to discuss how our IPP solutions might address your power needs during this development.

Would you be available for a brief call next week?

Regards,
[Your Name]","")
```

## Google Sheet Setup Instructions

1. Create a new Google Sheet
2. Create 6 tabs with names as specified above
3. Set up columns for each tab
4. Create data validation dropdowns in Sheet 6
5. Apply dropdowns to appropriate columns
6. Set up formulas for auto-calculations
7. Apply conditional formatting:
   - Priority Score: Red (5) to Green (1)
   - Status: Different color for each stage
   - Due Dates: Red if overdue
8. Set up filters on all tabs
9. Create simple dashboard charts on Pipeline tab

## Usage Guidelines

1. **Daily Process**
   - Check "Follow-up Actions Due" section first thing each morning
   - Record all new interactions in Activity Log immediately
   - Update lead status after meaningful interaction

2. **Weekly Process**
   - Monday: Add new News Triggers from weekend review
   - Friday: Review Pipeline Summary metrics and discuss with partner

3. **Lead Enrichment**
   - Update power estimates as better information becomes available
   - Add new contacts to Decision Makers field as discovered
   - Update Gas Availability status based on latest information 