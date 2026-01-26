# Entity Relational Diagram 
```mermaid
classDiagram

    class User {
        +ObjectId _id
        +String firstName*
        +String lastName*
        +String email* (unique, indexed)
        +Boolean verified
        +String password*
        +Date dateJoined
        +String verificationToken
        +Date verificationExpires
        +RefreshToken[] refreshTokens
    }

    class MealLog {
        +ObjectId _id
        +ObjectId userId* (ref: User)
        +String mealName*
        +ObjectId[] ingredients (ref: Ingredient)
        +ObjectId reaction (ref: Reaction)
        +Boolean hadReaction*
        +Boolean deleted
        +Date edited
        +Date createdAt
        +Date updatedAt
    }

    class Reaction {
        +ObjectId _id
        +ObjectId userId (ref: User)
        +ObjectId mealLogId (ref: MealLog)
        +SymptomSeverity[] symptoms
        +Date createdAt
        +Date updatedAt
    }

    class SymptomSeverity {
        +ObjectId symptom* (ref: Symptom)
        +Number severity
    }

    class Symptom {
        +ObjectId _id
        +String name*
        +String description
        +String is_a*
    }

    class Ingredient {
        +ObjectId _id
        +String name* (indexed, text)
        +String[] aliases (indexed)
        +String scientificName* (indexed, text)
        +String foodGroup*
        +String foodSubgroup
        +String[] allergens (indexed)
        +String[] intoleranceType
    }

    class BrandedFood {
        +ObjectId _id
        +String[] ingredients
        +String description (text-indexed, weight: 2)
        +String brandedFoodCategory* (text-indexed, weight: 4)
        +String brandOwner* (text-indexed, weight: 1)
    }

    class CrossReaction {
        +ObjectId _id
        +String name*
        +String scientificName
        +String proteinSequence
        +Similarity[] similarities
        +ObjectId ingredient (ref: Ingredient)
    }

    class Similarity {
        +ObjectId ingredient* (ref: Ingredient)
        +String name
        +Number score
    }

    class UnsafeFood {
        +ObjectId _id
        +ObjectId userId* (ref: User)
        +IngredientStatus[] ingredients
    }

    class IngredientStatus {
        +ObjectId ingredient* (ref: Ingredient)
        +String status* ("suspected", "confirmed")
        +Boolean preExisting*
    }

    class RefreshToken {
        +String token
        +Date createdAt
    }

    %% Relationships
    User --> MealLog : has many
    User --> Reaction : has many
    User --> UnsafeFood : has one
    
    MealLog --> Ingredient : contains many
    MealLog --> Reaction : has one
    
    Reaction --> Symptom : has many through
    Reaction --> MealLog : references
    Reaction --> User : belongs to
    
    UnsafeFood --> Ingredient : tracks many
    
    CrossReaction --> Ingredient : references
    CrossReaction --> Similarity : contains many
    Similarity --> Ingredient : references
    
    BrandedFood --> Ingredient : contains (String[])

    %% Special connection for BrandedFood
    note for BrandedFood "separate database connection MONGO_FOODS_URI"
