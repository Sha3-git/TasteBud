**_Hi-Fidelity User Feedback, Insights and Analysis_**

Our testing group for our hi-fidelity prototype had a lot of feedback and provided insights to what we should improve upon, and what was missing. The feedback highlighted a need for better clarity and to align with real world user habits.

We grouped the feedback into the following groups:

_1\. Data Visualization and Clarity_

| **Feedback Summary** | **Core User Pain Point** | **Proposed Solution Focus** |
| --- | --- | --- |
| **Graphs and Figures Unclear** (Point 1) | The graphs and figures that we provided were not quite clear enough for users to quickly understand and required too much attention to be placed on them to figure out what they were all about. As well, it was noted that we should have reports accompanying these graphs and figures to be able to make them clearer. | Rework all of the graphs and figures, and simplify the way they are to be shown to the user, along with creating reports to go along with the graphs and figures |
| **Clarity in Functionality** (Point 8) | Inconsistent color schemes and symptom ranking cause confusion. | Standardize all visual indicators (e.g., specific color(s) for good/bad) and create a clear, consistent severity scale across the application. |
| **Analysis:** | The primary area of our user feedback was issues with clarity due to complexity. **Improving data clarity is our highest priority.** |     |

_2\. Core Tracking and Workflow_

| **Feedback Summary** | **Initial Assumption vs. Insight** | **Development Impact** |
| --- | --- | --- |
| **Bulk Add Meals** (Point 2) | We assumed only single-meal entry was needed. | **Insight:** Users often meal prep or plan ahead (batch entry). |
| **Photo Tracking** (Point 3) | We focused photos only on data collection. | **Insight:** Users want photos for personal tracking and want to be able to see what they ate previously |
| **Edit/Add to Previous Logs** (Point 4) | Limited editing was permitted. | **Insight:** Full flexibility (add new meals/symptoms) is needed for accuracy, as tracking often happens hours later. |
| **Allergen/Food Naming** (Point 6) | We assumed standard naming conventions. | **Insight:** System must manage all potential names and aliases for synonyms and foods/allergens |
| **Reporting of Known Allergies/Intolerances**<br><br>(Point 7) | We assumed that users would input all their allergies during onboarding | **Insight:** Users may forget to log allergies during onboarding and as such should be able to log them after onboarding |
| **Analysis:** | The current food logging is too rigid. The application must be enhanced to support flexible, efficient data entry that matches how people actually eat and track. |     |

_3\. Product Scope and Strategy_

| **Feedback Summary** | **Analysis of Scope** | **Strategic Implication** |
| --- | --- | --- |
| **Focus on Known Conditions** (Point 5) | Our initial scope was too broad (general food allergies/intolerances). | **Insight:** Focus first on users with known food intolerance related conditions like IBS, celiac, etc.. to allow for quicker cause and effect verification |
| **Analysis:** | Focusing on a more limited scope of users to begin will allow us to build out more relevant features and limits our scope creep |     |

_4\. Non-Core Features and Security_

| **Feedback Summary** | **Importance** | **Next Step** |
| --- | --- | --- |
| **Verification Email for Security** (Point 9) | High user concern for data security. | Implement a standard email verification flow during user registration. |
| **Community Feedback** (Point 10) | Provides social support and supplementary insight. | This feature will be considered during later development, as at the beginning we want to focus on the logging and tracking of foods, food intolerances/allergies and their symptoms. |

**What we gathered from the feedback and insights:**

From the feedback that we acquired we see that we were limiting our functionality to what we were thinking would be sufficient, instead of gathering information and feedback to what others think would be useful to have in an application like ours.

We found that we need to figure out a clear way to display graphs and figures that have information that is helpful to show users what might be causing their allergies/intolerances.

As well, we found that although our food tracking functionality was good, it is a little too limited in its scope and could use a bit more fine tuning to figure out what would serve the user best.

**Priority of insights**

| **Priority** | **Action Item** | **Affected Feedback Points** |
| --- | --- | --- |
| **P1 - High** (Core Value) | **Reporting Redesign:** Focus on creating clear, plain graphs, figures, and reports, standardized color-coding, and a consistent symptom ranking scale. | 1, 8 |
| **P1 - High** (Core Workflow) | **Flexible Tracking Implementation:** Develop features for bulk food adding (meal prep), full log editing (past logs), and photo tracking capability. | 2, 3, 4, 7 |
| **P2 - Medium** (Data Quality) | **Database Enhancement:** Implement a system to manage synonyms and alternative naming conventions for foods, allergens, and symptoms. | 6   |
| **P2 - Medium** (Strategy) | **Scope Focus Confirmation:** Refine user stories and testing to primarily serve users with known conditions (IBS, Celiac) in the immediate term. | 5   |

By prioritizing these insights, we will be able to focus on the core features and refine our user scope without losing focus on the end goal of the application. By focusing on what we need to do first, it will reduce the data complexity initially and will allow us to develop and launch our first MVP.
