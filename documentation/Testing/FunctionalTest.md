# API Functional testing

The goal for the API Functional testing is to validate:
* Correct HTTP status codes
* Response structure and data integrity
* Error handling and edge cases
* Performance constraints (low latency)
Latency exception for registration
 ---
## Testing Environment

Postman Collection:
https://www.postman.com/tastebud-0038/workspace/tastebud-workspace/collection/37760309-d98d09dc-37b2-4c7f-a9c8-1abb85a14cf9?action=share&creator=42125615

---
# API Test Cases
## Authentication

| Test Case  | Endpoint         | Input                  | Expected Result                                            |
| ---------- | ---------------- | ---------------------- | ---------------------------------------------------------- |
| TC-AUTH-01 | POST /auth/login | Valid email + password | 200 OK, returns accessToken, refreshToken,  user object |
| TC-AUTH-02 | POST /auth/login | Invalid password       | 401 Unauthorized                                           |
| TC-AUTH-03 | POST /auth/login | Nonexistent email      | 401 Unauthorized                                           |
| TC-AUTH-04 | POST /auth/login | Missing email field    | 400 Validation error                                       |
| TC-AUTH-05 | POST /auth/login | Missing password field | 400 Validation error                                       |
| TC-AUTH-06 | POST /auth/login | Empty request body     | 400 Validation error                                       |
| TC-AUTH-07 | POST /auth/register | Valid email + password | 201 Created, returns message and status success    |
| TC-AUTH-08 | POST /auth/register | Existing email         | 400 Error, email already exists |
| TC-AUTH-09 | POST /auth/register | Invalid email format   | 400 Validation error            |
| TC-AUTH-10 | POST /auth/register | Missing password       | 400 Validation error            |
| TC-AUTH-11 | POST /auth/check-verification | Valid email       | 200 OK, returns verified status |
| TC-AUTH-12 | POST /auth/check-verification | Verified account  | 200 OK, verified = true         |
| TC-AUTH-13 | POST /auth/check-verification | Nonexistent email | 404 User not found              |
| TC-AUTH-14 | POST /auth/resend-verification | Unverified email       | 200 OK, status = sent       |
| TC-AUTH-15 | POST /auth/resend-verification | Already verified email | 400 Error, already verified |
| TC-AUTH-16 | POST /auth/resend-verification | Nonexistent email      | 404 User not found          |

## Meal Logs

| Test Case | Endpoint | Input | Expected Result |
|----------|--------|------|----------------|
| TC-MEAL-01 | POST /meals | Valid meal data | 201 Created, meal object returned |
| TC-MEAL-02 | POST /meals | Missing mealName | 400 Bad Request |
| TC-MEAL-03 | POST /meals | Missing hadReaction | 400 Bad Request |
| TC-MEAL-04 | PUT /meals/:id | Valid update | 200 OK |
| TC-MEAL-05 | PUT /meals/:id | Invalid id | 404 Not Found |
| TC-MEAL-06 | PUT /meals/:id | Invalid body | 400 Bad Request |
| TC-MEAL-07 | DELETE /meals/:id | Valid id | 200 OK |
| TC-MEAL-08 | DELETE /meals/:id | Invalid id | 404 Not Found |
| TC-MEAL-09 | GET /meals/day | Valid date | 200 OK |
| TC-MEAL-11 | GET /meals/day | Missing date | 400 Bad Request |
| TC-MEAL-12 | GET /meals/week | Valid request | 200 OK |
| TC-MEAL-13 | GET /meals/month | Valid request | 200 OK |
| TC-MEAL-14 | GET /meals/stats | Valid query | 200 OK |
| TC-MEAL-15 | GET /meals/stats | Invalid query | 400 Bad Request |

## Analysis

| Test Case      | Endpoint                     | Input                      | Expected Result                                         |
| -------------- | ---------------------------- | -------------------------- | ------------------------------------------------------- |
| TC-ANALYSIS-01 | GET /analysis/suspected-test | Control dataset userId     | 200 OK, returns empty array                             |
| TC-ANALYSIS-02 | GET /analysis/suspected-test | IgE dataset userId         | 200 OK, detects IgE allergy                             |
| TC-ANALYSIS-03 | GET /analysis/suspected-test | IgE lobster case           | 200 OK, detects lobster allergy with high reaction rate |
| TC-ANALYSIS-04 | GET /analysis/suspected-test | FODMAP dataset userId      | 200 OK, detects FODMAP sensitivity                      |
| TC-ANALYSIS-05 | GET /analysis/suspected-test | Noisy dataset userId       | 200 OK, no high-confidence detections                   |
| TC-ANALYSIS-06 | GET /analysis/suspected-test | Intolerance dataset userId | 200 OK, detects intolerance                             |
| TC-ANALYSIS-07 | GET /analysis/suspected-test | Missing userId             | 400 Bad Request                                         |
| TC-ANALYSIS-08 | GET /analysis/suspected-test | Invalid userId             | 404 Not Found or empty response                         |
| TC-ANALYSIS-09 | GET /analysis/suspected      | Authenticated user         | 200 OK, returns suspected foods                         |
| TC-ANALYSIS-10 | GET /analysis/suspected      | Missing auth token         | 401 Unauthorized                                        |

---

## Analysis Testing Approach

Analysis endpoints are tested using behavioral validation
* Detection of correct sensitivity types (IgE, FODMAP, intolerance)
* Reaction timing consistency (`avgHoursToReaction`)
* Statistical thresholds (`reactionRate`)
* Confidence filtering (handling noisy datasets)
acceptable fodmap categorization as intolerance fodmap for potentially failed tests
---

## Global Analysis Assertions

```javascript
pm.test("Response structure valid", function () {
    const res = pm.response.json();

    res.forEach(item => {
        pm.expect(item).to.have.property("ingredientName");
        pm.expect(item).to.have.property("track");
        pm.expect(item).to.have.property("reactionRate");
        pm.expect(item).to.have.property("confidence");
        pm.expect(item).to.have.property("avgHoursToReaction");
    });
});
```

---

## Sample Behavioral Tests

### Control Dataset

```javascript
pm.test("Control user has no detections", function () {
    const res = pm.response.json();
    pm.expect(res.length).to.eql(0);
});
```

---

### IgE Allergy Detection

```javascript
pm.test("IgE allergy detected", function () {
    const res = pm.response.json();

    const allergy = res.find(r => r.track === "ige_allergy");
    pm.expect(allergy).to.exist;
    pm.expect(allergy.avgHoursToReaction).to.be.below(1);
});
```

---

### FODMAP Sensitivity

```javascript
pm.test("FODMAP detection works", function () {
    const res = pm.response.json();

    const fodmap = res.find(r => r.track === "fodmap");
    pm.expect(fodmap).to.exist;
    pm.expect(fodmap.reactionRate).to.be.above(50);
});
```

---

### Noisy Dataset Handling

```javascript
pm.test("No high confidence results in noisy data", function () {
    const res = pm.response.json();

    const strong = res.filter(r => r.confidence === "high");
    pm.expect(strong.length).to.eql(0);
});
```

---

### Intolerance Detection

```javascript
pm.test("Intolerance detected", function () {
    const res = pm.response.json();

    const intolerance = res.find(r => r.track === "intolerance");
    pm.expect(intolerance).to.exist;
});
```


