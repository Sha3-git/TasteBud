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

TasteBud is an application developed to identify and track users' allergenic or intolerant foods via long term pattern recognition. It is a solution created to meet the needs of a substantially increasing population of people who experience allergies and food intolerances on a daily basis. By combining dietary logging of ingredients with symptom tracking and analytical insights, TasteBud helps users detect correlations between consumed foods and related reactions, therefore, enabling more informed dietary decisions and improved health management. Additionally, drawing upon the support of established research, the application provides users with precautionary guidance to help avoid potentially problematic foods based on factors such as cross reactivity.

  The current shortcomings in existing solutions are that the applications often times have inaccurate data, lack of cross reactivity information, lump allergies and food intolerances together, have rigid profiles that require the user to input all allergies and food intolerances that they have, and a lack of integration with the medical community. 
  
  Our group intended to address these shortcomings by figuring out ways to ensure all data is correct and precise, to have extensive cross reactivity information, to isolate allergies and food intolerances into seperate and distinct classifications, to have dynamic and evolving user profiles that change depending on reported symptoms or a lack thereof within food logs, and to finally have detailed reports that the user can export and show to their doctors, allergists, etc... 

## Initial Vision & Plan

### Customers
Who was your target audience or "north star" customer? Discuss any debates your team had between different target demographics and why you landed on your final choice.

Our target customer is those who suffer from food allergies and/or food intolerances whether they know it or not. 
  However, this is a broad user group, so our final customers were split into one of three groups. 
  Our first group are those who suffer from food allergies and are aware of said allergies, as they would be able to use our application to track their reactions, and to find out cross reactive foods. 
  The next group was those who suffer from food intolerances, we envisioned that these users would be aware of some of the things that were causing them issues, but would be able to use our application to root out their intolerances and be able to eventually clear them up, or at least limit their symptoms.
  The third and final group is a mixture of both of the other groups, but was those who are either unaware of symptoms, allergies or food intolerances or simply do not have symptoms, allergies or food intolerances and just would want to track their food and maybe be able to find foods that were causing them issues. 
  
  We landed on our final choice(s) by realzing that people who suffer from food allergies would have different experiences than those who suffered from food intolerances and vice versa, and that there would be an important group of people who either landed somewhere in the middle or laid outside of those groups. As such, we wanted to be able to curate experiences with our application based on the experience that the user was having with either their allergies or their food intolerances.

### Envisioned Requirements
What were the concrete technical and functional requirements you initially set out to accomplish? Discuss data sources, user authentication, core features, and calculations/processes the system needed to perform.

The functional requirements that we set out to achieve were having a Daily Food and Reaction Logger which included: detailed ingredients logging, a reaction tracker, entry timestamping, and log updating and deletion.As well, we wanted someway to have Unique profile creation for parents or guardians.
From the daily food and reaction logger's logs, we aimed to be able to have reaction pattern detection with System-found correlations between certain foods and user reactions and Cross reactive food finder.
For the user's health and wellbeing, we wanted to include an Unsafe Foods Tracker that allowed for declaration of user-confirmed allergies/intolerances, archival of irrelevant or outgrown allergies/intolerances, a view of system flagged ingredients, and a confirmation of system flagged ingredients.Finally, some kind of Reports and Insights system was necessary for both the user to be able to understand, and for it to be useful for potentially sending off detailed food and symptom logs to doctors, allergists, etc..


The technical requirements for these features to work properly were a proper food protein sequence database (to properly associate cross reactive foods), an allergenic foods database (to be able to show which foods could be causing issues), anecdotal symptom sourcing (to be able to have a proper list of potential symptoms), and a food products database to be able to link all of the other data together with real foods.
These databases would need some kind of script to be able to update them periodically. These databases needed to be hosted as to allow for remote development, and for that MongoDB was selected as it allowed for flexible scalability and easy indexing and querying. As well, there was a need to follow an architecture style to both code more efficiently and effectively, and the MVCS architecture was chosen to be able to seperate the front and backend effectively. For frontend development, React Native was picked due to its cross-compatibility on both Android and iOS devices for easier development on both sets of devices. On the backend side of things, Node.js was chosen for its high performance, its similarity to React (as they both use Javascript), and its asynchronous and non blocking architecture, which fits the real-time nature of the application. The application was envisioned to be hosted using micro service architecture and needed CI/CD pipelining, in which github actions was adopted for development as it has little to no downtime.

### Form
What medium did you choose for your solution (e.g., Standalone Web App, Mobile App, Desktop Software, API)? Why did you choose this form over the alternatives?

We chose to use a Mobile App for our solution as we felt that it was the medium that had the biggest potential userbase, as most people nowadays have their phone on them at all times. We envisioned building out a standalone web app as well, but did not quite get to the point in which it was as effective as our mobile application. Additionally, we chose a mobile application as it would allow for notifications, easier reporting, on the go functionality, future app store visibility, and smoother performance. 

### Technologies
What programming languages, frameworks, and libraries did you initially select? Include any decision matrices or comparisons you made (e.g., React vs. Vue, different charting libraries) and justify your final stack.

We used MVCS architecture, React Native and React for the front end, Node.js for the Backend,  Python & Sentence Transformers Model from Hugging Face for our machine learning model, MongoDB for the database, hosted using microservice architecture, and used Github Actions for our CI/CD pipelining

## Outcome and Deviations

### Purpose and Problem

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
