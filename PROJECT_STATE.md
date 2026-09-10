# Takaful UK — Project Architecture & Progress Summary

## Overview
This document tracks all project progress, decisions, custom components, and logic implementation for the **UK-based Takaful Home Protection** web application.

---

## 1. Get Quote Journey (`app/get-quote/page.tsx`)
Rebuilt into a modular, responsive 7-step wizard with complete validation and dynamic step flow.

### Step Breakdown:
1. **Step 1: Cover Selection & Ownership**
   - Cover Type (Buildings Only, Contents Only, Combined Buildings & Contents)
   - Property Address & Postcode lookup
   - Property Type (House, Bungalow, Flat/Apartment, Maisonette)
   - Flat Type conditional dropdown (Basement, Ground, First, Second floor+)
   - Ownership Status (Owned Outright, Mortgaged, Rented Private/Council)
   - Listed Building Status (Grade I, Grade II*, Grade II, Unlisted)
   - Main Residence toggle
2. **Step 2: Property Construction & Features**
   - Wall Construction (Brick, Stone, Timber, Concrete, Other)
   - Roof Type (Pitched Tiles, Slate, Flat Roof, Mixed, Other)
   - Flat Roof Percentage (Up to 10%, 20%, 30%, 50%, >50%, All)
   - Year Built & Approx. Square Footage
   - Number of Bedrooms & Bathrooms
   - Heating Type (Gas Central, Gas with Tank, Electric, Oil, Heat Pump, Solid Fuel, None)
   - Extension details (Rear, Side, Loft, Garage, Conservatory, None)
   - Environmental factors (Tree hazards within 7m, Flood/Subsidence history)
3. **Step 3: Occupancy & Usage**
   - Unoccupied period per year (<30 days, 30-60 days, 60-90 days, >90 days)
   - Number of Adult & Child Occupants
   - Business Use (No, Working from Home Clerical, WFH with Visitors, Other)
   - Business Visitor Frequency (Never, Occasionally, Monthly, Weekly, Daily)
4. **Step 4: Security & Safety**
   - External Door Lock Type (5-lever BS 3621, 5-lever, Multi-point, Yale, Smart lock)
   - Window Locks on ground/accessible windows
   - Burglar Alarm (None, Standard Siren, Smart/NSI Approved)
   - Smoke Alarms & CCTV Presence
5. **Step 5: High-Value Belongings & Add-ons**
   - Individual High-Value Items (Jewellery, Art, Electronics >£1,500)
   - Personal Belongings Cover away from home
   - Optional Add-ons: Accidental Damage, Home Emergency, Legal Protection
6. **Step 6: Claims History**
   - Enforces a strict **5-Year Lookback Period** for claims history.
   - Claims Count (None, 1, 2, 3+)
   - Claim details capture (Type of Claim, Year of Claim, Settlement Amount)
7. **Step 7: Personal Details & Confirmation**
   - Title, First Name, Last Name, Date of Birth
   - Contact Info (Phone Number, Email)
   - Policy Start Date selection
   - Marketing Preferences & Declaration acceptance

---

## 2. Form Validation & Field Error System
- **State**: `fieldErrors` (`Record<string, string>`) tracks invalid/missing fields for each step.
- **Visual Feedback**: Missing or invalid fields get a red border (`border-red-500`) and display inline red text (`text-red-400`).
- **Control Flow**: Step navigation (`handleNext`) validates the current step and prevents progression until all required fields are filled.

---

## 3. Custom Dropdowns & Components System
- Built with React Context, `ReactDOM.createPortal`, and `framer-motion` for dropdown animations and positioning.
- **Showcase Pages**:
  - `app/dropdowns/page.tsx` (`/dropdowns`): Dedicated standalone page showcasing all 14 dropdowns in both interactive state and expanded options view.
  - `app/design-system/page.tsx` (`/design-system#dropdowns`): Integrated design system page with all 14 portal dropdowns and pre-expanded option previews.

### List of 14 Dropdowns:
1. Flat Type
2. Wall Construction
3. Roof Type
4. Flat Roof Percentage
5. Type of Heating
6. Extension Type
7. Rental Type
8. Unoccupied Period
9. Business Use
10. Business Visitor Frequency
11. External Door Locks
12. Buildings Voluntary Excess (£0 - £1,000)
13. Contents Voluntary Excess (£0 - £1,000)
14. Title (Mr, Mrs, Ms, Miss, Dr, Prof, Other)

---

## 4. Compare Plans Integration
- Upon completing Step 7, all collected parameters are formatted into URL query params and forwarded directly to `/compare-plans`.
