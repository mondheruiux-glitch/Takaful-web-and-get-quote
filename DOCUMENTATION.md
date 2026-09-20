# TAKAFUL UK

## Product, UX & Get Quote Specification

**System Revision:** 3.0  
**Updated:** September 2026  
**Product:** Takaful UK Digital Home Protection Platform  
**Document Type:** Product & UX Blueprint + Get Quote Functional Specification  
**Audience:** Executive Stakeholders · Product Team · UX/UI Designers · Developers · Underwriting · Claims · Finance · Governance  
**Interactive Console:** [`http://localhost:3002/documentation`](http://localhost:3002/documentation)

![Takaful Logo](/brand/logo-light.png)

---

# 01. DOCUMENT PURPOSE

This document is the central product reference for the Takaful UK platform.

It explains:

* What Takaful UK is
* The business and mutual model
* Target customers
* Product objectives
* Customer journeys
* Get Quote experience
* Quote form fields and conditional behaviour
* Plan comparison
* Payment journey
* Participant experience
* Claims operations
* Finance operations
* Management and governance dashboards
* Product phases

For developers, the **Get Quote section** provides the functional behaviour required to reproduce the approved UX, including:

* Fields
* Answer choices
* Required/optional states
* Conditional questions
* What appears when an option is selected
* What disappears
* Quote summary behaviour
* Dynamic pricing behaviour

This document intentionally does not define backend architecture, APIs, database schemas, or programming implementation.

---

# 02. PRODUCT OVERVIEW

## 2.1 What is Takaful UK?

Takaful UK is a digital home protection platform built around the principles of mutual cooperation and Sharia-compliant financial structures.

The experience is designed to provide customers with:

* Simple digital protection
* Transparent contributions
* Clear coverage
* Digital claims
* Accessible policy documents
* Visibility into the mutual pool
* A modern alternative to traditional insurance experiences

The product should feel like a modern financial technology platform rather than a traditional insurance website.

---

# 03. PRODUCT VISION

## Vision

Create a transparent, modern and easy-to-use UK home protection experience based on mutual support.

The platform should allow customers to:

1. Discover their eligibility.
2. Get a quote.
3. Compare protection options.
4. Complete their application.
5. Set up payment.
6. Receive their policy documentation.
7. Manage their protection.
8. Submit and track claims.
9. Understand their contributions.
10. Understand the mutual pool.
11. View eligible surplus information where applicable.

---

# 04. CORE TAKAFUL PRINCIPLES

## 4.1 Ta'awun — Mutual Cooperation

Members participate in a structure designed around mutual assistance.

---

## 4.2 Tabarru — Mutual Contribution

An agreed portion of contributions is allocated to the mutual pool according to the approved product structure.

The pool supports eligible claims and other approved obligations.

---

## 4.3 Wakala — Agency / Management Arrangement

The operator receives an agreed management fee for operating and administering the platform.

The exact percentage must be treated as a configurable business value until formally approved.

---

## 4.4 Sharia-Compliant Financial Management

The financial structure is intended to avoid prohibited elements according to the approved Sharia governance framework.

All final claims regarding compliance must be reviewed and approved by the appropriate Sharia and legal advisers.

---

## 4.5 Mutual Surplus

Where the approved financial model allows it, eligible surplus may be distributed according to predefined rules.

The customer interface must clearly distinguish:

**Estimated surplus**

from

**Final approved distribution.**

A surplus must never be presented as guaranteed.

---

# 05. BUSINESS VALUE

Takaful UK aims to provide value through:

### Transparency

Customers can understand where their contributions go.

### Simplicity

The customer journey removes unnecessary complexity and jargon.

### Digital Self-Service

Customers can manage their protection without relying on phone support.

### Mutuality

The product explains the relationship between members, contributions and the shared pool.

### Trust

Financial, claims and governance information is communicated clearly.

---

# 06. TARGET USERS

# PERSONA 01 — HOMEOWNER

## Tariq & Amina

**Age:** 34 & 31  
**Location:** Birmingham  
**Property:** 3-bedroom semi-detached house  

They are purchasing their home using an Islamic home financing arrangement.

### Needs

* Buildings protection
* Mortgage documentation
* Simple quote
* Clear exclusions
* Digital policy documents
* Easy claims

### UX Opportunity

Provide a fast and transparent journey from property address to policy documentation.

---

# PERSONA 02 — RENTER

## Zayd

**Age:** 27  
**Location:** London  
**Property:** 1-bedroom flat  

Owns valuable electronics, cameras and personal possessions.

### Needs

* Contents protection
* High-value item protection
* Mobile-first experience
* Digital claims
* Simple monthly payment

---

# PERSONA 03 — ETHICAL / COOPERATIVE CUSTOMER

## David & Eleanor

**Age:** 48 & 46  
**Location:** Bristol  

Interested in cooperative and ethical financial models.

### Needs

* Transparent fees
* Mutual pool visibility
* Clear governance
* Responsible claims handling
* Understanding of surplus distribution

---

# 07. PRODUCT ECOSYSTEM

The platform contains four major experiences.

## 01 — Public Website

Customer discovery and education.

## 02 — Get Quote

Customer acquisition and conversion.

## 03 — Participant Portal

Customer self-service.

## 04 — Operational Dashboards

Internal management for:

* Claims
* Finance
* Management/Governance

---

# 08. PUBLIC WEBSITE

Main navigation:

```text
Home
About
How Takaful Works
Protection
Claims
Transparency
FAQs
Contact
Get Quote
```

The website should communicate the product simply without overwhelming the customer with financial or religious terminology.

---

# 09. CUSTOMER JOURNEY

The overall journey is:

```text
DISCOVER
   ↓
UNDERSTAND TAKAFUL
   ↓
GET QUOTE
   ↓
ANSWER QUESTIONS
   ↓
COMPARE PLANS
   ↓
SELECT PLAN
   ↓
PAYMENT
   ↓
POLICY CREATED
   ↓
MEMBER DASHBOARD
   ↓
MANAGE COVER
   ↓
CLAIM IF NEEDED
```

---

# 10. GET QUOTE

## Objective

The Get Quote experience should allow an eligible customer to provide the information required to calculate their available home protection options.

The experience should be:

* Fast
* Clear
* Mobile-friendly
* Progressive
* Easy to understand
* Transparent
* Validated
* Contextual

The user should not see every question at once.

Questions should appear according to previous answers.

---

# 11. GET QUOTE — STEP 01

## Postcode

### Question

**What's your postcode?**

Example:

`B13 9EG`

### Actions

**Find my address**

### Result

Display matching addresses.

Example:

* 12 Example Road, Birmingham
* 14 Example Road, Birmingham
* 16 Example Road, Birmingham

### Alternative

**Enter my address manually**

If selected, display:

* Address line 1
* Address line 2
* Town/City
* County
* Postcode

---

# 12. GET QUOTE — STEP 02

# WHAT DO YOU WANT TO PROTECT?

### Question

**What would you like to cover?**

Choices:

### Buildings & Contents

Protects the building and possessions.

### Buildings Only

Protects the building.

### Contents Only

Protects possessions.

---

## Conditional Behaviour

### Buildings & Contents

Show:

* Buildings questions
* Contents questions

### Buildings Only

Show:

* Buildings questions

Hide:

* Contents questions

### Contents Only

Show:

* Contents questions

Hide:

* Buildings questions

---

# 13. GET QUOTE — STEP 03

# PROPERTY TYPE

### Question

**What type of property is it?**

Choices:

* House
* Flat
* Bungalow
* Town house
* Bedsit
* Maisonette
* Farm house
* Other

---

## If "Flat"

Show:

### Which floor is your property on?

Choices:

* Ground floor
* 1st
* 2nd
* 3rd
* 4th
* 5th+
* Other

Then:

### Is the flat self-contained?

Choices:

* Yes
* No

---

# 14. GET QUOTE — STEP 04

# PROPERTY DETAILS

## Bedrooms

### Question

**How many bedrooms does your home have?**

Choices:

* 1
* 2
* 3
* 4
* 5
* 6
* 7
* 8
* 9
* 10+

---

## Bathrooms

Choices:

* 1
* 2
* 3
* 4
* 5+

---

## Living Rooms

Choices:

* 0
* 1
* 2
* 3+

---

## Kitchens

Choices:

* 1
* 2
* 3+

---

## Other Rooms

Choices:

* 0
* 1
* 2
* 3
* 4
* 5
* 6
* 7
* 8
* 9
* 10+

---

# 15. GET QUOTE — STEP 05

# CONSTRUCTION

## Year Built

### Question

**When was your home built?**

Input:

**Year**

---

## Wall Construction

Choices should use the final approved underwriting options.

Example:

* Brick
* Stone
* Concrete
* Timber
* Other
* Don't know

### If Other

Show:

**Please describe the construction.**

---

# 16. ROOF

### Question

**What type of roof does your property have?**

Choices:

* Tile
* Slate
* Flat roof
* Other
* Don't know

---

## If Flat Roof

Show:

### Approximately how much of the roof is flat?

Choices:

* 0%
* Up to 25%
* 26–50%
* 51–75%
* 76–100%

---

# 17. HEATING

### Question

**What is the main heating system?**

Choices should use approved underwriting options.

Example:

* Gas central heating
* Electric
* Oil
* Heat pump
* Other
* Don't know

### If Other

Show:

**Please describe your heating system.**

---

# 18. SECURITY

# DOOR LOCKS

### Question

**What type of locks do your external doors have?**

Choices may include:

* 5-lever mortice deadlock
* Multi-point locking system
* Other approved lock
* Don't know

---

# 19. WINDOWS

### Question

**Do accessible windows have suitable locks?**

Choices:

* Yes
* No
* Don't know

---

# 20. BURGLAR ALARM

### Question

**Does your home have a burglar alarm?**

Choices:

* No
* Yes — professionally installed
* Yes — other
* Don't know

---

# 21. SMOKE DETECTORS

### Question

**Does your home have smoke detectors?**

Choices:

* Yes
* No
* Don't know

---

# 22. EXTERNAL DOORS

### Question

**Does your home have any of these external doors?**

Multi-select:

* Patio doors
* French doors
* Bi-fold doors
* None

---

# 23. PROPERTY USE

## Main Residence

### Question

**Is this your main residence?**

Choices:

* Yes
* No

---

# 24. OCCUPANCY

### Question

**Who normally lives at the property?**

Choices:

* I live there alone
* I live there with my partner/family
* Other people live there
* Tenant(s)
* Other

---

# 25. UNOCUPIED PERIODS

### Question

**Will your property ever be unoccupied for 30 days or more?**

Choices:

* Yes
* No

### If Yes

Show:

**How often is the property unoccupied?**

And:

**What is the longest period it will be unoccupied?**

---

# 26. BUSINESS USE

### Question

**Is any business activity carried out from the property?**

Choices:

* No
* Clerical/home office work
* Customers or visitors come to the property
* Other business use

---

## If Clerical/Home Office

Show:

**What type of work do you do?**

Text input.

---

## If Customers/Visitors

Show:

* Type of business
* Frequency of visitors
* Approximate number of visitors
* Is the business area self-contained?
* Are visitors escorted?

---

## If Other Business

Show:

**Please describe the business activity.**

---

# 27. BUILDINGS DETAILS

This section is displayed only when:

**Buildings**

or

**Buildings & Contents**

is selected.

---

## Rebuild Cost

### Question

**How much would it cost to rebuild your home?**

Currency:

`£`

Helper text:

> This is the estimated cost of rebuilding your home, not its market value.

---

# 28. EXTENSIONS

### Question

**Has your home been extended or significantly modified?**

Choices:

* Yes
* No

### If Yes

Show:

* Type of extension
* Approximate size
* Completion year

---

# 29. CONTENTS

This section is displayed only when:

**Contents**

or

**Buildings & Contents**

is selected.

---

## Contents Value

### Question

**How much would it cost to replace the contents of your home?**

Input:

`£`

CTA:

**Use contents calculator**

---

# 30. HIGH-VALUE ITEMS

### Question

**Do you have any individual items worth more than £1,000?**

Choices:

* Yes
* No

---

## If Yes

Show:

### What type of items do you own?

Multi-select:

* Jewellery
* Watches
* Electronics
* Cameras
* Computers
* Artwork
* Musical instruments
* Other

CTA:

**Add an item**

---

## Add High-Value Item

Fields:

* Item type
* Description
* Value
* Purchase date
* Photo/document

Allow multiple items.

Example:

```text
Camera
£2,200

Laptop
£1,800

Watch
£3,500
```

---

# 31. BIKES & PORTABLE ELECTRONICS

### Question

**Do you have bikes or portable electronics that require additional protection?**

Choices:

* Yes
* No

### If Yes

Display the relevant additional value/detail questions.

---

# 32. AWAY-FROM-HOME COVER

### Question

**Would you like your belongings to be covered when you're away from home?**

Choices:

* Yes
* No

### If Yes

Show relevant questions about:

* Items
* Value
* Usage
* Locations

---

# 33. CLAIM HISTORY

### Question

**Have you made any home insurance claims or experienced losses during the last 5 years?**

Choices:

* Yes
* No

---

## If No

Continue.

---

## If Yes

Show:

### How many incidents?

Choices:

* 1
* 2
* 3
* 4
* 5+

For each incident:

* Date
* Incident type
* Description
* Estimated loss
* Amount paid
* Current status

---

# 34. NO-CLAIMS HISTORY

Where applicable:

### Question

**How many years have you been claim-free?**

Choices:

* 0
* 1
* 2
* 3
* 4
* 5
* 6
* 7
* 8
* 9+

Where applicable, Buildings and Contents history can be collected separately.

---

# 35. PROPERTY OWNERSHIP

### Question

**What is your relationship to the property?**

Choices:

* Owner
* Owner with mortgage
* Tenant
* Other

---

## If Owner With Mortgage

Show:

**Mortgage provider**

---

## If Tenant

Show:

### What type of tenancy do you have?

Choices:

* Private rental
* Social housing
* Other

---

# 36. OPTIONAL COVER

### Question

**Would you like additional protection?**

Options:

### Accidental Damage

Add/remove.

### Legal Protection

Add/remove.

### Home Emergency

Add/remove.

### Away From Home

Add/remove.

### High-Value Item Cover

Add/remove.

When selected:

* Explain the benefit.
* Display additional cost.
* Update quote.
* Allow the user to remove it.

---

# 37. VOLUNTARY EXCESS

### Question

**Choose your voluntary excess**

Choices:

* £0
* £150
* £250
* £400

The available options should remain configurable.

---

## Behaviour

When the user changes the excess:

```text
User selects excess
        ↓
Quote recalculates
        ↓
Contribution changes
        ↓
Updated price displayed
```

The user should not have to restart the form.

---

# 38. PAYMENT FREQUENCY

### Question

**How would you like to pay?**

Choices:

### Monthly

Example:

**£42.00 / month**

### Annually

Example:

**£480.00 / year**

The selected frequency must be clearly reflected throughout the quote summary.

---

# 39. GET QUOTE CONDITIONAL LOGIC

| Selection            | Additional Questions          |
| -------------------- | ----------------------------- |
| Buildings & Contents | Buildings + Contents          |
| Buildings Only       | Buildings                     |
| Contents Only        | Contents                      |
| Flat                 | Floor + self-contained        |
| Flat roof            | Flat roof percentage          |
| Business use         | Business details              |
| No business          | Hide business details         |
| Previous claims      | Claim history                 |
| No claims            | Hide claim history            |
| High-value items     | Item details                  |
| No high-value items  | Hide item details             |
| Extension            | Extension details             |
| No extension         | Hide extension details        |
| Away-from-home       | Additional item/use questions |
| No away-from-home    | Hide additional questions     |
| Mortgage owner       | Mortgage provider             |
| Tenant               | Tenancy type                  |
| Optional cover       | Add-on information            |

---

# 40. FORM UX RULES

## Progressive Disclosure

Only show questions relevant to the user's situation.

Example:

```text
User chooses:

CONTENTS ONLY

↓

Buildings questions disappear

↓

Contents questions appear
```

---

## Back Navigation

The user can return to previous questions.

If they change an answer, dependent questions must update accordingly.

Example:

```text
Buildings & Contents
        ↓
Buildings questions
+
Contents questions

User goes back

        ↓

Changes to Contents Only

        ↓

Buildings questions removed
```

---

# 41. FORM SUMMARY

Before generating the final quote, show a review screen.

## Example

### Property

3-bedroom semi-detached house  
Birmingham

### Cover

Buildings & Contents

### Buildings

£350,000

### Contents

£50,000

### Excess

£250

### Additional Protection

* Accidental Damage
* Legal Protection

Actions:

**Edit**

**Get my quote**

---

# 42. QUOTE CALCULATION EXPERIENCE

After submitting the form:

### Loading State

> We're calculating your personalised protection options…

Then display the available plans.

The user should not see a fake or hardcoded calculation presented as a final quote.

---

# 43. PLAN COMPARISON

Display three plans:

## Essential

Basic protection.

## Standard

Balanced protection.

## Comprehensive

Broader protection and additional benefits.

---

## Comparison Example

| Protection        | Essential | Standard | Comprehensive |
| ----------------- | --------: | -------: | ------------: |
| Buildings         |         ✓ |        ✓ |             ✓ |
| Contents          |         ✓ |        ✓ |             ✓ |
| Accidental Damage |         — | Optional |             ✓ |
| Legal Protection  |         — |        ✓ |             ✓ |
| Home Emergency    |         — | Optional |             ✓ |

Each plan displays:

* Monthly contribution
* Annual contribution
* Coverage limits
* Excess
* Included benefits
* Optional benefits
* Important exclusions

CTA:

**Select plan**

---

# 44. TRANSPARENCY

Where approved by the final financial model, the quote can show a contribution breakdown.

Example:

**Monthly contribution**

£50.00

**Community Pool**

£40.75

**Wakala**

£9.25

The exact allocation percentage must use the approved business configuration.

---

# 45. PAYMENT JOURNEY

After selecting a plan:

```text
Selected Plan
     ↓
Customer Details
     ↓
Payment Setup
     ↓
Review
     ↓
Confirmation
     ↓
Policy Created
```

---

# 46. POLICY CONFIRMATION

After successful completion, display:

## Your protection is active

Show:

* Policy number
* Property
* Coverage
* Contribution
* Start date
* Excess

Actions:

**View policy**

**Download documents**

**Go to dashboard**

---

# 47. PARTICIPANT DASHBOARD

## Purpose

The participant dashboard is the customer's central self-service area.

---

## Main Navigation

```text
Overview
My Cover
Contributions
Claims
Documents
Takaful Pool
Profile
Support
```

---

# 48. PARTICIPANT OVERVIEW

Display:

### Active Coverage

Buildings & Contents

### Coverage Limits

£350k / £50k

### Monthly Contribution

£42.00 / month

### Voluntary Excess

£250

### Estimated Surplus

£18.40

> Example values only.

---

# 49. MY COVER

Display:

* Property
* Address
* Buildings limit
* Contents limit
* Excess
* Coverage
* Add-ons
* Important exclusions
* Policy dates

---

# 50. CONTRIBUTIONS

Display:

* Current contribution
* Payment frequency
* Payment history
* Upcoming payment
* Direct Debit status
* Contribution allocation
* Annual statements

---

# 51. CLAIMS

The participant can:

1. Start a claim
2. Select incident type
3. Enter incident date
4. Describe what happened
5. Upload photos
6. Upload supporting documents
7. Review
8. Submit

---

# 52. CLAIM STATUS

The customer sees:

```text
Submitted
   ↓
Under Review
   ↓
Assessment
   ↓
Additional Information
   ↓
Decision
   ↓
Settlement
   ↓
Completed
```

---

# 53. DOCUMENTS

Customers can access:

* Policy schedule
* Policy documents
* Certificates
* Claims documents
* Contribution statements
* Other approved documents

---

# 54. TAKAFUL POOL

The pool section should explain the mutual structure visually.

Potential information:

* Contributions
* Claims paid
* Pool balance
* Reserves
* Retakaful
* Potential surplus
* Historical distributions

Personal surplus should be clearly labelled **estimated** until formally approved.

---

# 55. CLAIMS HANDLER DASHBOARD

## Purpose

The Claims Handler dashboard is designed for operational teams managing customer claims.

### Main areas

```text
Overview
Queue
Claims
Participants
Evidence
Reports
```

---

# 56. CLAIMS OVERVIEW

KPIs:

* Open claims
* New claims
* High-priority claims
* Average processing time
* SLA performance
* Settlement ratio

---

# 57. CLAIM QUEUE

Each claim displays:

* Claim ID
* Member
* Incident
* Date
* Priority
* Status
* SLA
* Assigned handler
* Estimated amount

Filters:

* New
* In review
* Awaiting evidence
* Assessment
* Approved
* Declined
* Paid
* Closed

---

# 58. CLAIM DETAIL

The claims handler can see:

### Member

* Name
* Policy
* Coverage
* Address
* Claim history

### Incident

* Type
* Date
* Description
* Estimated damage

### Evidence

* Photos
* Videos
* Documents
* Receipts
* Contractor information

### Assessment

* Coverage
* Excess
* Assessment
* Estimated settlement
* Notes

---

# 59. FINANCE DASHBOARD

## Purpose

Provide visibility into contributions, pool funds and claims payments.

Main areas:

```text
Overview
Pool
Contributions
Claims Payments
Transactions
Reports
```

---

# 60. FINANCE OVERVIEW

Display:

* Community pool
* Contributions received
* Claims paid
* Pending payments
* Wakala allocation
* Reconciliation status
* Approved surplus

Example values shown in the UI should be clearly treated as demonstration data until live financial data is available.

---

# 61. COMMUNITY POOL

Display:

* Total contributions
* Pool allocation
* Claims
* Reserves
* Retakaful
* Potential surplus

The presentation should make the separation between mutual funds and operator fees easy to understand.

---

# 62. CLAIM PAYMENTS

Display:

* Approved claims
* Payment status
* Amount
* Member/contractor
* Date
* Approval status

---

# 63. TRANSACTIONS

Display:

* Transaction
* Amount
* Date
* Category
* Status
* Reference
* Responsible user

Sensitive financial actions should be clearly recorded and traceable.

---

# 64. MANAGEMENT & GOVERNANCE DASHBOARD

## Purpose

Provide executive-level visibility into the overall platform.

Main areas:

```text
Overview
Risk
Participants
Financial Performance
Governance
Certificates
Settings
```

---

# 65. EXECUTIVE OVERVIEW

KPIs:

### Active Policies

14,280

### Growth

+14.2% MoM

### Portfolio Loss Ratio

41.2% YTD

### Annual Retention

98.4%

### Governance Status

Certified / Review Required / Action Required

All figures are examples unless connected to approved live data.

---

# 66. RISK

Potential views:

* Geographic risk
* Flood exposure
* Subsidence exposure
* Claims concentration
* Regional loss ratio
* Property concentration

---

# 67. PARTICIPANT ANALYTICS

Display:

* New customers
* Quote starts
* Quote completion
* Conversion
* Retention
* Coverage mix
* Plan selection
* Add-on adoption

---

# 68. GOVERNANCE

Display:

* Sharia review status
* Certificates
* Audit information
* Policy wording versions
* Approval status
* Review dates
* Outstanding actions

---

# 69. WAKALA & POOL MODEL

The product can visually explain the contribution structure.

Example:

```text
Customer Contribution
        │
        ├───────────────┐
        ↓               ↓
Tabarru Pool         Wakala
Community           Operator
Protection          Management
```

Example only:

**£50 contribution**

* £40.75 Community Pool
* £9.25 Wakala

The final allocation must reflect the approved financial model.

---

# 70. SURPLUS MODEL

Conceptual explanation:

```text
Eligible Pool Contributions
        -
Claims
        -
Approved Reserves
        -
Retakaful / Other Approved Costs
        =
Potential Surplus
```

If the approved rules permit distribution, eligible members may receive a proportionate distribution.

The UI should never imply:

**"You are guaranteed £18.40."**

Instead:

**"Estimated surplus: £18.40"**

---

# 71. PROJECT PHASES

# PHASE 01 — FOUNDATION

### Public Experience

* Home
* About
* Takaful explanation
* Coverage
* FAQs
* Contact

### Design

* Brand system
* Typography
* Components
* Responsive rules
* Interaction patterns

---

# PHASE 02 — GET QUOTE

Build the complete:

* Postcode journey
* Property questions
* Coverage selection
* Risk questions
* Contents
* Claims
* Occupancy
* Optional covers
* Excess
* Review
* Quote

---

# PHASE 03 — PLAN & CONVERSION

* Compare plans
* Select plan
* Payment
* Confirmation
* Policy documents

---

# PHASE 04 — PARTICIPANT EXPERIENCE

* Dashboard
* My Cover
* Contributions
* Claims
* Documents
* Pool

---

# PHASE 05 — CLAIMS OPERATIONS

* Claims dashboard
* Queue
* Claim detail
* Evidence
* Assessment
* Settlement
* Status tracking

---

# PHASE 06 — FINANCE

* Finance dashboard
* Pool
* Contributions
* Payments
* Transactions
* Reporting

---

# PHASE 07 — MANAGEMENT & GOVERNANCE

* Executive dashboard
* Risk
* Analytics
* Governance
* Certificates
* Reporting

---

# PHASE 08 — OPTIMISATION

Potential future features:

* Advanced analytics
* Claims assistance
* Automated document processing
* Risk insights
* Personalised protection
* Mobile application
* Additional integrations

---

# 72. PRODUCT SUCCESS METRICS

## Acquisition

* Website visitors
* Quote starts
* Quote completion
* Plan selection
* Payment completion
* Policy activation

## Customer

* Customer satisfaction
* Self-service rate
* Dashboard engagement
* Document downloads

## Claims

* Digital claim rate
* First response time
* Average resolution time
* SLA performance
* Claim satisfaction

## Business

* Active policies
* Growth
* Retention
* Contribution volume
* Claims ratio

---

# 73. UX PRINCIPLES

## 01 — Simple

Never make the user understand insurance terminology before completing an action.

## 02 — Transparent

Explain pricing, coverage and contribution allocation clearly.

## 03 — Progressive

Ask only what is necessary at each stage.

## 04 — Responsive

The quote experience must work naturally on:

* Desktop
* Tablet
* Mobile

## 05 — Reassuring

The user should always know:

**Where am I?**

**What am I answering?**

**Why are you asking?**

**What happens next?**

## 06 — Human

Use clear language instead of complicated financial or insurance terminology.

---

# 74. GET QUOTE DEVELOPER CHECKLIST

The developer should verify that:

### Form

* [ ] All required questions are available
* [ ] All answer choices are implemented
* [ ] Required fields are validated
* [ ] Optional fields are clearly identified
* [ ] Back navigation works
* [ ] User answers are preserved

### Conditional Logic

* [ ] Buildings questions appear only when Buildings is selected
* [ ] Contents questions appear only when Contents is selected
* [ ] Flat-specific questions appear only for Flats
* [ ] Business questions appear only when business use is selected
* [ ] Claim history appears only when previous claims are selected
* [ ] High-value item fields appear only when applicable
* [ ] Extension questions appear only when applicable
* [ ] Mortgage questions appear only when applicable
* [ ] Tenant questions appear only when applicable
* [ ] Optional cover questions appear only when selected

### Quote

* [ ] Summary displays all selected answers
* [ ] User can edit answers
* [ ] Quote updates after relevant changes
* [ ] Excess changes update the displayed contribution
* [ ] Optional covers update the displayed contribution
* [ ] Monthly/annual payment choice is reflected correctly

### UX States

* [ ] Loading state
* [ ] Validation state
* [ ] Error state
* [ ] Success state
* [ ] Ineligible state
* [ ] Empty states where relevant

---

# 75. FINAL PRODUCT STRUCTURE

The complete Takaful UK experience can be understood as:

```text
                    TAKAFUL UK
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
     PUBLIC          GET QUOTE       DASHBOARDS
     WEBSITE             │                │
                         ↓          ┌─────┼─────┐
                    COMPARE PLANS    ↓     ↓     ↓
                         │        MEMBER CLAIMS FINANCE
                         ↓                    │
                      PAYMENT                 ↓
                         │              MANAGEMENT
                         ↓
                    ACTIVE POLICY
                         │
                    MEMBER PORTAL
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
            COVER      CLAIMS    CONTRIBUTIONS
                         │
                         ↓
                     POOL / SURPLUS
```

---

# 76. DOCUMENT STATUS

**Document:** Takaful UK Product & UX Specification  
**Revision:** 3.0  
**Status:** Working Product Blueprint  
**Updated:** September 2026  

### Before production

The following areas require final business approval:

* Pricing
* Underwriting rules
* Exact contribution allocation
* Wakala percentage
* Surplus distribution rules
* Claim rules
* Coverage limits
* Exclusions
* Payment process
* Regulatory wording
* Sharia governance wording
* Customer-facing legal content

Numerical examples in this document should be treated as **UI/product examples rather than confirmed commercial values** until formally approved.
