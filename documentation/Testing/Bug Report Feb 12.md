# QA Bug Report & Usability Observations #1

**Application:** Tastebud  
**Date:** February 12, 2026  
**Status:** Complete

---

## 1. User Interface & Experience (UI/UX)

### 1.1. Unresponsive Day Navigation (Calendar/Log)
**Severity:** Medium  
**Observation:** Clicking on past days in the meal log provides no visual feedback or state change.  
**Situation:** It is Monday. When clicking on Sunday's icon to check the log, nothing happens. It does not show an empty state or indicate that no meals were logged.  
**Expected Behavior:** The interface should clearly switch views to the selected day and display a "No meals logged" message if empty or should be more evident that the calendar view is just for the current day

### 1.2. Food Library Button Obstruction
**Severity:** High (for Food Library, low for actual functionality of application)  
**Observation:** The "Add Unsafe/Safe Foods" button is physically stuck underneath the navigation bar.  
**Situation:** The primary action button for the library is layered below the bottom navbar, making it unclickable.  
**Expected Behavior:** The button should be located clearly above the navbar.

### 1.3. Truncated Text in Cross-Reactive Foods
**Severity:** Low  
**Observation:** Full names of cross-reactive foods are cut off without a way to view them.  
**Situation:** Checking cross-reactive foods for "Yeast" displays "Black Tiger S..." instead of the full name (e.g., Shrimp).  
**Expected Behavior:** Text should wrap, or allow expansion to read the full ingredient name.

---

## 2. Search Functionality & Logic

### 2.1. Search Result Indexing/Logic Error
**Severity:** High  
**Observation:** Specific items do not appear when typing the full name of a product with a similar but shorter name, but appear when typing partial substrings.  
**Situation:** - Searching "Pine" -> Pine related products, but no Pineapple.
- Searching "Pinea" -> "Pineapple" appears.
- Searching "Pin" -> "Pineapple" appears.
**Expected Behavior:** Exact matches should always return the item.

### 2.2. Branded Foods Disappearing (Flicker Bug)
**Severity:** Medium  
**Observation:** Branded food results appear momentarily and then vanish from the list.  
**Situation:** Searching for "Pineapple juice" briefly renders branded options, but they disappear before they can be selected.  
**Expected Behavior:** Search results should persist once loaded.

### 2.3. Inconsistent Search Result Ordering
**Severity:** Low  
**Observation:** Secondary search results cycle order randomly.  
**Situation:** Searching for "Apples" always puts "Apple" at the top, but subsequent results (Green Apple, Cider, Sugar Apple) change order on every search.  
**Expected Behavior:** Sort order should be deterministic (e.g., by relevance, then alphabetical).

### 2.4. Missing Branded Products
**Severity:** Medium  
**Observation:** Known branded products in the database are not retrieving in search.  
**Situation:** Searching for specific items like "Granny Smith Apple" (branded) fails to show the branded item, only showing generic ingredients.  
**Expected Behavior:** Search should query both the Generic Ingredient and Branded Product databases.

---

## 3. Data Integrity & State Management

### 3.1. Ingredient State Refresh Lag
**Severity:** Medium  
**Observation:** Unsafe ingredient flags do not populate immediately after adding a meal.  
**Situation:** Adding a meal requires the user to swap pages/navigate away and back to trigger the "Unsafe" warning flag.  
**Expected Behavior:** The application state should refresh immediately upon meal submission to flag unsafe ingredients without navigation.

### 3.2. Database Spelling Errors
**Severity:** Low  
**Observation:** Misspellings in the database prevent items from being found.  
**Situation:** "Pineapple Sage" is stored as "Pineappple Sage" (3 'p's).  
**Expected Behavior:** Database cleanup is required, but may be too tedious to fully accomplish.

### 3.3. Disconnected Data Entities (Manual Entry)
**Severity:** Medium  
**Observation:** Manual food tracking in the Food Library is not linked to the Pattern Analysis database.  
**Situation:** Users manually type "Beef" as a safe food. If misspelled or typed differently, it does not link to the "Beef" entry used for pattern analysis.  
**Expected Behavior:** Manual entries in the Food Library should prompt an autocomplete lookup from the master Ingredients Database to ensure data linkage.


## Outcomes:
 *  The applications functionailty appears to be working nearly as intended.
 *   However, it seems that the searching functionality has some issues that are causing inconsistencies and bugs that would hurt a users experience.
 *   Nevertheless, once these issues are sorted, the user experience will be much more consistent
