# Sequence Diagram

## User Meal log interaction

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React Native UI
    participant C as Controller
    participant S as Service Layer
    participant DB as MongoDB Atlas
    participant FDB as Foods DB (VPS)

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Authentication
        
        U->>UI: enters registration details
        UI->>C: POST /api/auth/register
        C->>S: registerUser(email, password, name)
        S->>DB: save(user)
        DB-->>S: savedUser
        S->>S: generateVerificationToken()
        S->>S: sendVerificationEmail()
        S-->>C: user + token
        C-->>UI: 201 Created
        UI-->>U: check email for verification
        
        U->>UI: clicks verification link
        UI->>C: GET /api/auth/verify?token=xxx
        C->>S: verifyEmail(token)
        S->>DB: updateUser(verified: true)
        DB-->>S: updated
        S-->>C: success
        C-->>UI: 200 OK
        UI-->>U: email verified
        
        U->>UI: enters login credentials
        UI->>C: POST /api/auth/login
        C->>S: loginUser(email, password)
        S->>DB: findUser(email)
        DB-->>S: user
        S->>S: validatePassword()
        S->>S: generateTokens()
        S-->>C: accessToken + refreshToken
        C-->>UI: 200 OK
        UI-->>U: logged in
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Onboarding
        
        U->>UI: searches for known allergies
        UI->>C: GET /api/ingredients/search?q=peanut
        C->>S: search(query)
        S->>DB: textSearch(ingredients, query)
        DB-->>S: matchingIngredients[]
        S-->>C: ingredients
        C-->>UI: 200 OK
        UI-->>U: displays matching ingredients
        
        U->>UI: selects pre-existing allergies
        UI->>C: POST /api/unsafefood/onboarding
        C->>S: saveOnboardingAllergies(userId, allergyNames[])
        S->>DB: findMatchingIngredients(allergyNames)
        DB-->>S: matchedIngredients[]
        S->>DB: upsert UnsafeFoods(status: confirmed, preExisting: true)
        DB-->>S: savedUnsafeFoods
        S-->>C: unsafeFoods
        C-->>UI: 201 Created
        UI-->>U: allergies saved
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Meal Logging
        
        U->>UI: starts logging a meal
        
        alt User searches for ingredient
            U->>UI: types ingredient name
            UI->>C: GET /api/ingredients/search?q=milk
            C->>S: search(query)
            S->>DB: textSearch(ingredients, query)
            DB-->>S: matchingIngredients[]
            S-->>C: ingredients
            C-->>UI: 200 OK
            UI-->>U: displays ingredient options
            
        else User searches for branded food
            U->>UI: types branded food name
            UI->>C: GET /api/brandedfood/search?q=oreo
            C->>S: searchFoods(query)
            S->>FDB: textSearch(brandedFoods, query)
            FDB-->>S: matchingBrandedFoods[]
            S-->>C: brandedFoods
            C-->>UI: 200 OK
            UI-->>U: displays branded food options
            
            U->>UI: selects branded food
            UI->>C: GET /api/brandedfood/ingredients/:id
            C->>S: getBrandedFoodIngredients(id)
            S->>FDB: findById(brandedFood)
            FDB-->>S: brandedFood with ingredients[]
            S->>DB: mapIngredients(ingredientStrings[])
            Note right of S: ML pre-computed mappings convert<br/>branded ingredient strings to Ingredient refs
            DB-->>S: mappedIngredients[]
            S-->>C: ingredients[]
            C-->>UI: 200 OK
            UI-->>U: auto-expands all ingredients
        end
        
        U->>UI: submits meal with ingredients
        UI->>C: POST /api/meallogs/create
        C->>S: createMealLog(userId, mealName, ingredients[])
        S->>DB: save(mealLog)
        DB-->>S: savedMealLog
        S-->>C: mealLog
        C-->>UI: 201 Created
        UI-->>U: meal logged
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Reaction Logging
        
        U->>UI: reports reaction to a meal
        UI->>C: GET /api/symptoms/search?q=bloating
        C->>S: searchSymptoms(query)
        S->>DB: textSearch(symptoms, query)
        DB-->>S: matchingSymptoms[]
        S-->>C: symptoms
        C-->>UI: 200 OK
        UI-->>U: displays symptom options
        
        U->>UI: selects symptoms and severity
        UI->>C: POST /api/reactions/create
        C->>S: createReaction(userId, mealLogId, symptoms[])
        S->>DB: save(reaction)
        DB-->>S: savedReaction
        S-->>C: reaction
        C-->>UI: 201 Created
        UI-->>U: reaction logged
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Pattern Detection and Suspected Triggers
        
        U->>UI: views suspected triggers
        UI->>C: GET /api/reactions/sus?userId=xxx
        C->>S: getSuspectedFoods(userId)
        
        S->>DB: getAllMealLogs(userId)
        DB-->>S: meals[]
        S->>DB: getAllReactions(userId) with populated mealLog.ingredients
        DB-->>S: reactions[]
        
        S->>S: calculateStats(meals, reactions)
        Note right of S: For each ingredient:<br/>- Count total meals<br/>- Count reaction meals<br/>- Count non-reaction meals<br/>- Calculate avg severity
        
        S->>S: filterSuspected()
        Note right of S: Suspected = appears in reaction meals<br/>AND never in non-reaction meals
        
        S->>DB: syncSuspectedToUnsafeFoods(userId, suspected[])
        Note right of S: Auto-adds new suspected foods<br/>Does not overwrite confirmed or preExisting
        DB-->>S: synced
        
        S-->>C: suspectedFoods[]
        C-->>UI: 200 OK
        UI-->>U: displays suspected triggers with scores
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Food Library Management
        
        U->>UI: views food library
        UI->>C: GET /api/unsafefood/get?userId=xxx
        C->>S: getUnsafeFoods(userId)
        S->>DB: findOne(userId).populate(ingredients)
        DB-->>S: unsafeFoods with ingredient details
        S-->>C: unsafeFoods
        C-->>UI: 200 OK
        UI-->>U: displays all unsafe foods by status
        
        U->>UI: confirms a suspected trigger
        UI->>C: PUT /api/unsafefood/update/:id
        C->>S: updateUnsafeFood(id, {ingredient, status: confirmed})
        S->>DB: findOneAndUpdate(status = confirmed)
        DB-->>S: updated
        S-->>C: updatedUnsafeFood
        C-->>UI: 200 OK
        UI-->>U: trigger confirmed
        
        U->>UI: removes a food from list
        UI->>C: DELETE /api/unsafefood/delete/:id
        C->>S: deleteUnsafeFood(id, {ingredient})
        S->>DB: $pull ingredient from array
        DB-->>S: updated
        S-->>C: updatedUnsafeFood
        C-->>UI: 200 OK
        UI-->>U: food removed
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Cross-Reactivity Lookup
        
        U->>UI: views cross-reactivity for an allergen
        UI->>C: GET /api/crossReaction/get/:ingredientId
        C->>S: getCrossReactions(ingredientId)
        S->>DB: find({ingredient: ingredientId})
        DB-->>S: crossReactions with similarities[]
        S-->>C: crossReactions
        C-->>UI: 200 OK
        UI-->>U: displays related allergens with similarity scores
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Monthly Analysis
        
        U->>UI: views monthly analysis
        UI->>C: GET /api/reactions/analysis?userId=xxx&year=2026&month=2
        C->>S: getMonthlyAnalysis(userId, year, month)
        
        S->>DB: getReactions(userId, monthRange)
        DB-->>S: currentMonthReactions[]
        S->>DB: getReactions(userId, prevMonthRange)
        DB-->>S: prevMonthReactions[]
        
        S->>S: calculateMonthlyImprovement()
        S->>S: calculateSymptomFreeDays()
        S->>S: calculateWeeklyTrend()
        S->>S: calculateTimeOfDayPatterns()
        
        S-->>C: analysis results
        C-->>UI: 200 OK
        UI-->>U: displays monthly insights
    end

    rect rgba(0, 0, 0, 0.02)
        Note over U,FDB: Edit Past Meals
        
        U->>UI: edits a past meal
        UI->>C: PUT /api/meallogs/update/:id
        C->>S: updateMealLog(id, changes)
        S->>DB: findByIdAndUpdate(id, changes)
        DB-->>S: updatedMealLog
        S-->>C: updatedMealLog
        C-->>UI: 200 OK
        UI-->>U: meal updated
        
        Note over U,FDB: Scoring recalculates on next GET /api/reactions/sus
    end
```
