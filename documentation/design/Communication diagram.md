# Communication diagram
```mermaid
graph LR
    U[User] -- 1.1: log_meal --> TB[App]
    TB -- 1.2: save_meal --> ML[Meal Logger]
    ML -- 1.3: meal_saved --> TB
    
    U -- 2.1: reportReaction --> TB
    TB -- 2.2: analyzeReactionPatterns --> RD[Reaction Pattern Detector]
    PatternDetector -- 2.3: checkCrossReactiveness --> AD[Allergen Detector]
    AD -- 2.4: potentialAllerintol --> PD
    ReactionPatternDetection -- 2.5: patternInsights --> TB
    
    TB -- 3.1: showSuspectedAllergies --> U
    U -- 3.2: confirmAllerintol --> TB
    TB -- 3.3: addToUnsafeFoods --> UF[Unsafe Foods Tracker]
    UF -- 3.4: confirmationSaved --> TB
    
    U -- 4.1: logMeal --> TB
    TB -- 4.2: checkIngredients --> AD
    AD -- 4.3: getUnsafeFoods --> UF
    UF -- 4.4: userAllerintol --> AD
    AD -- 4.5: alleintolWarnings --> TB
    TB -- 4.6: displayWarnings --> U

```
  
