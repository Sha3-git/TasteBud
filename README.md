# TasteBud
Welcome to tastebud

Where We aim to help individuals with food intolerances identify triggers and avoid problem foods through data-driven insights.
### Team
Shema Dabiri
Ethan Goski
Mazen Abid
### Project background and business need/ opportunity

* Food allergies and intolerances have become increasingly common world wide. It’s prevalence likened to an [allergy pandemic](https://pmc.ncbi.nlm.nih.gov/articles/PMC11208673)   
* In developed countries, one in three children suffer from at least one allergic disorder  
* With how common food allergies are becoming, many individuals experience recurring symptoms of food intolerance or allergic reactions without being able to pinpoint the food origin.   
* Food allergies don’t just happen alone. What is cross reactivity?  
  * Cross-reactivity in allergic reactions occurs when the proteins in one substance (typically pollen) are similar to the proteins found in another substance (typically a food) ([source](https://www.aaaai.org/tools-for-the-public/allergy,-asthma-immunology-glossary/cross-reactivity-defined))  
* Additionally, food allergies are not completely static and can appear or disappear over the course of a person’s life so the monitoring of food allergens can end up an ongoing experience ([source](https://pmc.ncbi.nlm.nih.gov/articles/PMC4578642))  
* Why the non-distinction between allergy and food intolerance?  
  * Physical reactions to certain foods are common but most are caused by [food intolerance rather than an allergy](https://www.mayoclinic.org/diseases-conditions/food-allergy/expert-answers/food-allergy/faq-20058538)   
    * The food allergy affects the immune system whilst the intolerance only affects the digestive system  
    * However the food intolerance sign can appear to be similar to that of an allergic reaction making it difficult to tell apart. This distinction should be made by a licensed practitioner and falls outside the scope of our application. So we will deal with both at the same time

* [Tests for food allergies include but not limited to the following](https://www.nhs.uk/conditions/food-allergy)  
  * Skin prick test where food or a drop of liquid containing food is put in the skin   
  * Blood tests  
  * Special diet to find problematic foods through the process of elimination  
    * Involves the creation of a food and symptom diary  
* To meet the needs of a substantial population that experiences allergies and food intolerances from food sources. We aim to provide a n allergy tracking application that eases the difficulty in narrowing down allergens by utilizing the meal logs and symptoms to recognize patterns over time. Hence, becoming an elevated symptom diary that aims to be more useful 

### Reason

Our reason for pursuing this project stems from the desire to contribute towards a solution for a common health problem.   
Discovering allergies or intolerances can be difficult, frustrating and confusing and has been linked to the causation of [food anxiety](https://www.health.harvard.edu/diseases-and-conditions/new-allergies-in-adulthood).  
We believe that we can empower our end users to understand their own health better through accessible data and intelligent tools.   
By interpreting user provided data in useful ways we wanna facilitate a better health experience

### Impact and Value

We hope that when we are done our current situation [ where people with allergies or intolerance are unable to determine what makes them ill or form patterns to correlate cross reactivity with other foods] , we will shift towards individuals who are able to identify triggers and future foods to avoid based on correlations of… (food types, protein makeup, and so on) through data driven insights.   
We will achieve this by gathering relevant data on allergens  
Using secure applications and a stack that allows for flexible development  
And receiving continuous feedback from our users

### Who

* Our focus is Adults or Guardians who either experience food intolerance or allergic reactions to foods and other consumable non-drug, material, or environmental substances.  
  * So individuals who might have lactose intolerance, tree nut allergies, shell fish allergies and so forth  
  * Specifically for people who experience multiple allergic symptoms as well   
  * And not individuals prone or experience anaphylaxis

* Beyond the end users  → allergists, dietitians, and general practitioners play an important role. We hope that our system will act as a complementary tool for symptom tracking in cases when the special diet methodology is used to narrow down problematic foods. These would be the added users we would want to reach with our work  
    
* Our user base will be informed through digital means so our audience will be online and not limited to any particular physical location. So we would be creating for a global, digitally connected community

### What

* Mobile application  
* Food and symptom logger (diary)  
  * Users can log their meals with detailed ingredients  
  * Users can log their symptoms  
  * Users can declare their allergies  
  * System timestamps entries for the users upon entry so that time occurrence is saved  
* Pattern detection  
  * Our system analyzes the user logs to find correlations between certain foods and symptoms  
    * Either based on previously declared food allergies  
    * Or on known cross reactivities

* Personalized food library  
  * Users can view their current safe foods, add to it, or remove unsafe ones if they developed a new allergy or intolerance  
  * Users can make a food pool when trying to narrow down allergens  
    * By eating out of the food pool they can declare which caused them symptoms and which weren't  
    * Foods marked safe are added to the safe category and vice versa

* Reports and insights  
  * Users can generate exportable reports to share with their health care provider  
  * Users can see the results of the pattern detection run over the course of a week or month   
    * It will show top suspected triggers and symptoms


Constraints:

* Data accuracy user enters into the app might be incomplete, inconsistent, or subjective  
  * So our best best would be to generate key words based on user inputs or have the users select the best symptoms that fit. But to avoid a one size fits all scenario we might try to extract the symptoms into keywords ourselves from the user’s subjective narration of their symptoms

* Pattern detection limitations  
  * We are constrained by the data available to us from health authorities which, while verbose, might not cover every unique symptoms experienced by our users. 

* Privacy  
  * We need to figure out how to protect users in accordance to HIPAA as we do collect symptoms of allergy/food intolerance which might fall under health information.  
    * However, based on what has been read we will not face problems disclosing the user information to the users but must de-identify their information in cases where it might need to be shared or ask for authorization to share from the users. ([source](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html#business))  
    * We also need to find a secure means of storing the user information not limited to encryption or the selection of secure technologies.

### How

Tech stack:

* Figma for prototyping  
* Nodejs backend  
* Mongodb database  
* ReactNative

### Data: 

* The [allergen encyclopedia](https://www.thermofisher.com/phadia/wo/en/resources/allergen-encyclopedia/f25.html) collects information about discovered allergies and their allergenic molecules as well as cross reactivity. The data is not consistently structured but using this information we can standardize it for our own use with an easy to envision cross reactivity web.   
* NIH has papers available that list high risk foods with high rates of cross reactivity ([source](https://pmc.ncbi.nlm.nih.gov/articles/PMC11250430))  
* We also have a data for the names of allergies ([source](https://www.kaggle.com/datasets/boltcutters/food-allergens-and-allergies)) from kaggle  
* Food allergy and intolerance dataset ([source](https://github.com/RuthvikUppala30/food-allergy-dataset/blob/main/food_allergy_dataset.csv))

#### FODMAP & Additive Ingredients
TasteBud tracks FODMAP (Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols) ingredients for users with IBS and digestive sensitivities. Our FODMAP ingredient database includes:
- **Polyols**: Sorbitol, mannitol, xylitol, maltitol, isomalt, lactitol, erythritol
- **Oligosaccharides**: Inulin, chicory root fiber, FOS, GOS
- **Excess Fructose**: High fructose corn syrup, agave
- **Common Additives**: Gums, artificial sweeteners, preservatives

**Scientific References:**

1. Monash University FODMAP Diet App & Research Program - https://www.monashfodmap.com/
2. Gibson, P.R. & Shepherd, S.J. (2010). "Evidence-based dietary management of functional gastrointestinal symptoms: The FODMAP approach." *Journal of Gastroenterology and Hepatology*, 25(2), 252-258. https://www.monash.edu/__data/assets/pdf_file/0008/994706/dietarymanagementofgisymptomsfodmaps.pdf
3. Monash University. "What are the Polyols?" https://www.monashfodmap.com/blog/what-are-polyols/
4. Monash University. "What are the Oligos (Fructans & GOS)?" https://www.monashfodmap.com/blog/what-are-oligos/
5. Monash University. "Label Reading and FODMAPs" https://www.monashfodmap.com/blog/update-label-reading/

#### ML Ingredient Matching

TasteBud uses a pre-computed semantic matching system to map branded food ingredients to our core ingredient database:

- **Model**: all-MiniLM-L6-v2 ([Hugging Face](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2))
- **Processing**: Batch (not live) - mappings are pre-computed once and stored in MongoDB
- **Similarity Threshold**: 0.50 (50% minimum confidence)
- **Coverage**: 344,595 ingredient mappings including 23,546 FODMAP/additive mappings


MVP 1

* User enters their pre existing allergies  
* User self reports symptom(s) by selecting best fit out of options our system provides such as a drop down  
* User self reports food eaten if it is a snack or product the ingredient is found in the database  
* User self report individual ingredients of foods eaten if food is uncommon or unknown like those of a restaurant  
* This input is grouped by daily consumption  
* System monitors symptoms over timeframe and flags high risk foods   
  * Cross reactive food groups are labeled high risk  
  * Commonly experienced symptoms are recorded  
  * List of symptoms and association with what food are recorded  
* System provides a food library of safe and unsafe foods which can be edited  
* System finds common ingredients eaten when the user eats foods and experiences symptoms

MVP 2 

* User enters a narration of their symptoms after which our system will extract key words of specific flaggable symptoms  
  * This will be implemented with a chat bot system  
* User can take a picture of the food (if they are at a restaurant) and specific ingredients can be recognized by the system to expedite ingredient inputting  
  * Using food database to train a model

MVP 3

* Community blog for crowd sourcing unique allergen symptoms and sharing stories  
* Smart watch monitoring of biometric to receive exact timing of when symptoms 

## Project Schedule


October:

* Compiled all data in the database   
* Readjusted project requirements based on technical limitations  
* Consulted with medical experts about feasibility and new perspectives  
* Class Diagram completed  
* Lo-fi completed

November: 

* Test environment set up for development  
* Consulted with medical experts on testing our mvp1  
* Hi-fi completed  
* MVP 1 completed

December:

* Production environment set up  
* MVP 2 completed

## Vlogs
[Vlog 1](https://youtu.be/XUzZLrhF774)
[Vlog 2](https://youtu.be/vXvnteLl2Qs)
[Vlog 3](https://youtu.be/3btCjA3S2BQ)



