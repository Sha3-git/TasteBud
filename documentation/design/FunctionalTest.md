# API Functional testing

The goal for the API Functional testing is to ensure that each of the individual endpoints are working well within all possible REST api outputs for successes and failures. Additionally, as we are developing the application with high traffic in mind, we are ensuring that response time is another testing parameter to ensure that Users experience a low latency application. This will be done by utilizing postman scripting.

### Test Cases
Test scenarios that are for , Failure, and Forbidden<br/>

Success
* Response status (200, 201) 
* Response JSON content
* Response Time (e.g < 100 ms)

Failure
* No Authentication
* Non existent database record
* Incorrect payload

Forbidden
* Accessing higher permission end points
* Black listed IPs
* Rate limits 

