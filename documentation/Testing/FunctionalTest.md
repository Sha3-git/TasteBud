# API Functional testing

The goal for the API Functional testing is to ensure that each of the individual endpoints are working well within all possible REST api outputs for successes and failures. Additionally, as we are developing the application with high traffic in mind, we are ensuring that response time is another testing parameter to ensure that Users experience a low latency application. This will be done by utilizing postman scripting. View the postman testing environment [here](https://www.postman.com/tastebud-0038/workspace/tastebud-workspace/collection/37760309-d98d09dc-37b2-4c7f-a9c8-1abb85a14cf9?action=share&creator=42125615)

# API Test Cases

## Authentication

| Test Case  | Endpoint         | Input                  | Expected Result                                            |
| ---------- | ---------------- | ---------------------- | ---------------------------------------------------------- |
| TC-AUTH-01 | POST /auth/login | Valid email + password | 200 OK, returns accessToken, refreshToken, and user object |
| TC-AUTH-02 | POST /auth/login | Invalid password       | 401 Unauthorized                                           |
| TC-AUTH-03 | POST /auth/login | Nonexistent email      | 401 Unauthorized                                           |
| TC-AUTH-04 | POST /auth/login | Missing email field    | 400 Validation error                                       |
| TC-AUTH-05 | POST /auth/login | Missing password field | 400 Validation error                                       |
| TC-AUTH-06 | POST /auth/login | Empty request body     | 400 Validation error                                       |
| TC-AUTH-07 | POST /auth/register | Valid email + password | 201 Created, returns message and status success    |
| TC-AUTH-08 | POST /auth/register | Existing email         | 400 Error, email already exists |
| TC-AUTH-09 | POST /auth/register | Invalid email format   | 400 Validation error            |
| TC-AUTH-10 | POST /auth/register | Missing password       | 400 Validation error            |


## Analysis
### Suspected Foods
| Test Case | Endpoint                | Input                              | Expected Result                          |
| --------- | ----------------------- | ---------------------------------- | ---------------------------------------- |
| TC-09     | GET /analysis/suspected | Valid JWT token                    | 200 OK, returns array of suspected foods |
| TC-10     | GET /analysis/suspected | No token                           | 401 Unauthorized                         |
| TC-11     | GET /analysis/suspected | Expired token                      | 401 Unauthorized                         |
| TC-12     | GET /analysis/suspected | Valid token but no suspected foods | 200 OK, returns empty array              |

### Suspected Foods (Test Endpoint)
| Test Case | Endpoint                     | Input                    | Expected Result                 |
| --------- | ---------------------------- | ------------------------ | ------------------------------- |
| TC-13     | GET /analysis/suspected-test | Valid userId query param | 200 OK, returns suspected foods |
| TC-14     | GET /analysis/suspected-test | Missing userId           | 400 Bad request                 |
| TC-15     | GET /analysis/suspected-test | Invalid userId           | 404 User not found              |
