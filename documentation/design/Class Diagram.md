# Class Diagram

### Users
* user account data
* authentication info
* verification status.

### MealLogs
* meals logged by users
* ingredients used
* linked reactions
* meal photos

### Ingredients
* individual food ingredients
* their food groups
* possible cross-reactions.

### BrandedFoods
* Brand owners
* ingredients
* descriptions
* food category 

### UnsafeIngredients
Tracks ingredients linked to adverse reactions, with severity and confirmation category.

### Reactions
possible allergic or food intolerance reactions, along with severity and category.

### CrossReactions 
Protein sequence similarity scores for food ingredients to determine cross reactivity

### Symptoms 
selectable symptom options with associated descriptions and an is_a to determine specific body part


```mermaid
classDiagram
    class User {
        ObjectId _id
        String firstName
        String lastName
        String email
        String password
        Bool verified
        String verificationToken
    }

    class BrandedFood {
        ObjectId _id
        [String] ingredients
        String description
        String brandedFoodCategory
        String brandOwner
    }

    class CrossReaction {
        ObjectId _id
        String name
        String scientificName
        String proteinSequence
        [Similarity] similarities
        ObjectId ingredient_ref
    }

    class Similarity {
        ObjectId ingredient_ref
        String name
        Number score
    }

    class Ingredient {
        ObjectId _id
        String name
        [String] aliases
        String scientificName
        String foodGroup
        String foodSubgroup
        [String] allergens
        [Enum] intoleranceType
    }

    class MealLog {
        ObjectId _id
        ObjectId userId_ref
        String mealName
        [ObjectId] ingredients_ref
        ObjectId reaction_ref
        Bool hadReaction
        Bool deleted
    }

    class Reaction {
        ObjectId _id
        ObjectId userId_ref
        ObjectId mealLogId_ref
        [SymptomSeverity] symptoms
    }

    class SymptomSeverity {
        ObjectId symptom_ref
        Number severity
    }

    class Symptom {
        ObjectId _id
        String name
        String description
        String is_a
    }

    class UnsafeFood {
        ObjectId _id
        ObjectId userId_ref
        [IngredientStatus] ingredients
    }

    class IngredientStatus {
        ObjectId ingredient_ref
        Enum status  // suspected, confirmed
        Bool preExisting
    }

