## Project Requirements

### Project Name
**TasteBud** – Allergy and Food Intolerance Management Application

---

## Functional Requirements

- **Daily Food and Reaction Logger**
  - Detailed ingredients logging
  - Reaction tracker
  - Entry timestamping
  - Log updating and deletion

- **Multiple User Profile Creation**
  - Unique profile creation for parents or guardians

- **Reaction Pattern Detection**
  - System-found correlations between certain foods and user reactions
  - Cross reactive food finder

- **Unsafe Foods Tracker**
  - Declaration of user-confirmed allergies/intolerances
  - Archival of irrelevant or outgrown allergies/intolerances
  - View of system flagged ingredients
  - Confirmation of system flagged ingredients

- **Reports and Insights**

---

## Technical/Performance Requirements

- **External data sources**
  - Food protein sequence database
  - Allergenic foods database
  - Anecdotal symptom sourcing
  - Food products database

- **Yearly data updating script** for external database sources

- **Architecture:** MVCS  
- **Frontend:** React Native and React  
- **Backend:** Node.js  
- **Database:** MongoDB  
- **Hosting:** micro service architecture
- **CI/CD pipelining** with GitHub Actions for deployment (little to no downtime)

## User Roles
* **Primary**
    * **Independent:** handles their own food allergies or intolerance profiles
    * **Guardian:** handles multiple others' food allergies or intolerance profiles
* **Secondary**
    * **Medical personel:** can see primary users' exported de-identified allergy/intolerance data
    
