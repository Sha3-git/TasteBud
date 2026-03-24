#  <p align="center">TasteBud: Project Experience Report </p>


--- 
<p align="center"><b>Mazen Abid</b> <br>
<b>Shema Dabiri</b><br>
<b>Ethan Goski</b> </p>

| Version | Date |
| :--- | :--- |
| 1.0 | 03, DD, 2026 |
--- 

## Table of Contents

* [Purpose and Problem](#purpose-and-problem)
* [Initial Vision & Plan](#initial-vision--plan)
* [Customers](#customers)
* [Envisioned Requirements](#envisioned-requirements)
* [Form](#form)
* [Technologies](#technologies)
* [Outcome and Deviations](#outcome-and-deviations)
* [Stakeholders](#stakeholders)
* [Timeline](#timeline)
* [End Product](#end-product)
* [Lessons Learned and What Went Well](#lessons-learned-and-what-went-well)
* [Research and Complexity](#research-and-complexity)
* [Utilizing New Technology](#utilizing-new-technology)
* [Scrums](#scrums)
* [Feedback and Adaptability](#feedback-and-adaptability)
* [Frameworks](#frameworks)
* [What Will We Take With Us Going Forward](#what-will-we-take-with-us-going-forward)
* [Advice for Future Groups](#advice-for-future-groups)
* [Closing Remarks](#closing-remarks)
* [Acknowledgements](#acknowledgements)
  
## Purpose and Problem
Describe the core problem your project set out to solve. Why is this problem important? Who does it affect? What are the current shortcomings in existing solutions, and how did your group intend to address them?

The purpose for our project was to contribute towards a solution for a common health problem.
Discovering allergies or intolerances can be difficult, frustrating and confusing and has been linked to the causation of food anxiety.
We believe that we can empower our end users to understand their own health better through accessible data and intelligent tools.
By interpreting user provided data in useful ways we wanna facilitate a better health experience

## Initial Vision & Plan

### Customers
Who was your target audience or "north star" customer? Discuss any debates your team had between different target demographics (e.g., B2B vs. B2C) and why you landed on your final choice.

Our target customer is those who suffer from food allergies and/or food intolerances whether they know it or not.

### Envisioned Requirements
What were the concrete technical and functional requirements you initially set out to accomplish? Discuss data sources, user authentication, core features, and calculations/processes the system needed to perform.

The functional requirements that we set out to achieve were: 

Daily Food and Reaction Logger

    Detailed ingredients logging
    Reaction tracker
    Entry timestamping
    Log updating and deletion

Multiple User Profile Creation

    Unique profile creation for parents or guardians

Reaction Pattern Detection

    System-found correlations between certain foods and user reactions
    Cross reactive food finder

Unsafe Foods Tracker

    Declaration of user-confirmed allergies/intolerances
    Archival of irrelevant or outgrown allergies/intolerances
    View of system flagged ingredients
    Confirmation of system flagged ingredients

Reports and Insights

The technical requirements we initial used were: 
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

### Form
What medium did you choose for your solution (e.g., Standalone Web App, Mobile App, Desktop Software, API)? Why did you choose this form over the alternatives?

We chose to use a Mobile App for our solution...

### Technologies
What programming languages, frameworks, and libraries did you initially select? Include any decision matrices or comparisons you made (e.g., React vs. Vue, different charting libraries) and justify your final stack.

We used MVCS architecture, React Native and React for the front end, Node.js for the Backend,  Python & Sentence Transformers Model from Hugging Face for our machine learning model, MongoDB for the database, hosted using microservice architecture, and used Github Actions for our CI/CD pipelining

## Outcome and Deviations

### Purpose and Problem
*Note: This link will be `#purpose-and-problem-1` because the name is a duplicate.*

Did the core purpose of your application change during development? Did you pivot to focus on a more specific feature or abandon an overly ambitious goal based on feedback?

[Insert description here]

### Stakeholders
Did your target customers or stakeholders change from your initial plan?
Our target customers were those suffer from food allergies and/or food intolerances whether they know it or not.

### Timeline
How did your actual timeline compare to your original Gantt chart or Kanban board? Discuss what phases went smoothly and which ones required more time than anticipated. Mention any features that had to be dropped due to time constraints.

[Insert description here]

### End Product
Provide a detailed walkthrough of the final product. Use screenshots and describe the user flow, inputs required, and the outputs/results generated by the application.

**Feature/Input 1:** [Describe feature]  
![Alt text for Image](image_url_here)

**Feature/Input 2:** [Describe feature]  
![Alt text for Image](image_url_here)

---

## Lessons Learned and What Went Well

### Research and Complexity
How did your team handle the domain-specific research required for the project? Discuss how you broke down complex, overwhelming topics into manageable steps.

[Insert description here]

### Utilizing New Technology
Reflecting on the experience of learning a new tech stack. Did it take longer than expected? What went well, and what were the major hurdles?

[Insert description here]

### Scrums
Discuss your team's approach to project management and accountability. How frequent were your meetings? How did regular check-ins with advisors or clients help keep the project on track?

[Insert description here]

### Feedback and Adaptability
How did your team handle miscommunications, requirement changes, or critical feedback from stakeholders? Discuss specific instances where you had to pivot and how the team recovered.

[Insert description here]

### Frameworks
Looking back at the specific frameworks and tools you chose, what were the pros and cons? Would you choose them again? Did the learning curve take away from product design time?

[Insert description here]

## What Will We Take With Us Going Forward
Summarize the core professional and technical takeaways your team gained. Discuss what you would do differently in future projects.

[Insert description here]

## Advice for Future Groups
Based on your experience, what advice would you give to a team starting a similar project? Focus on team alignment, meeting frequency, pair-programming, and documentation.

[Insert description here]

## Closing Remarks

### Project Definition and Communication
Final thoughts on the importance of clearly defining the project early on and communicating those goals effectively.

[Insert description here]

### Do Not Be Afraid to Change
Final thoughts on the importance of remaining flexible and being willing to pivot when an idea isn't working.

[Insert description here]

### Clearly Define Expectations When Working With a Company
Final thoughts on managing client relationships, specifically regarding the transfer of industry knowledge and required guidance.

[Insert description here]

## Acknowledgements
We would like to acknowledge and thank **[Name/Organization]** for their guidance, feedback, and support throughout the completion of our project.

[Add specific thanks for specific contributions here].
