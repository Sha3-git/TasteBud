# QA Bug Report & Usability Observations #1

**Application:** Tastebud  
**Date:** February 27, 2026  
**Status:** In Progress

---

## 1. User Interface & Experience (UI/UX)

### 1.1. Log Meal UI too high
**Severity:** Medium  
**Observation:** On the log meal menu, the top portion is too high and inteferes with the top portion of phone UI     
**Expected Behavior:** The top interface should be not be overlap with phone UI and should be below it.
    
### 1.2. Symptom Severity difficult to read
**Severity:** Medium  
**Observation:** When increasing the severity of a symptom, it eventually will overlap with text saying how severe a symtom is and removes the ability to see a textual representation of symptom severity
**Situation:** Symptom is sweating, I wish to change it from a 5 on the severity, to a 9 on the severity, I can do that, but it blocks the visual representation of the severity     
**Expected Behavior:** The interface should clearly show both the slider for severity and the texutal representation without overlap.
    
### 1.3. Unneccesary Wrapping on Cross Reactive Foods section
**Severity:** Medium  
**Observation:** On the cross reactive foods page there is 4 options for cross reactive foods. These options are all, high, medium, and low. The medium option is wrapped so that the text shows up as mediu m instead of medium as one word.         
**Expected Behavior:** The medium option should just appear as one word and not be wrapped.
    
## 2. Search Functionality & Logic    
    
### 2.1. Branded Products are Unclear
**Severity:** High     
**Observation:** Known branded foods in the database are not clear in what product they actually are.    
**Situation:** Searching for branded products like McClure's Pickles show a bunch of products that show that they are Pickles, Olives, Peppers & Relishes. Picking any of the options is like a roulette wheel where products
are either pickles, olives, peppers or relishes.    
**Expected Behavior:** When a user searches for pickles, the top option for branded foods should be pickles instead of products that could be related to pickles.    
   
### 2.2. Branded Food Ingredients are Displaying Incorrectly
**Severity:** High      
**Observation:** Branded food ingredients show up differently in the application than they are in the database    
**Situation:** Searching for doritos, and once I click on them it gives me a list of ingredients. Some of the ingredients are weird and not what they actually are. An example is lake trout and blue whiting, which are fish and are not listed in the database. 
Byproducts of these fish could exist as ingredients of Doritos, but are not common place.    
**Expected Behavior:** The ingredients from the database should be what shows up in the application (or at least give ingredients that are not concerning).
    
### 2.3. Branded Foods with no Ingredients Appear
**Severity:** Medium          
**Observation:** Some branded foods have no ingredients within them in the database.    
**Situation:** Searching for coffee and an option for Lost Coast Roast shows up, however, once it is picked, it pops up an alert that no ingredients could be mapped, and to try to add ingredients manually.    
**Expected Behavior:** Branded foods with no ingredients that can be mapped should just not show up.    



