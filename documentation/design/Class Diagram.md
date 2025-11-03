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

### UnsafeIngredients
Tracks ingredients linked to adverse reactions, with severity and confirmation category.

### Reactions
possible allergic or food intolerance reactions, along with severity and category.

```mermaid
classDiagram
    class Users {
        ObjectId _id
        String firstName
        String lastName
        String email
        String password
        bool verified
        String token
    }

    class MealLogs {
        ObjectId _id
        String name
        [ObjectId] ingredients_ref
        Bool hadReaction
        [ObjectId] reactions
        [String] ingredients
        String photoURL
        Date date
    }

    class Ingredients {
        String name
        String foodGroup
        String proteins
        String nutrients
        [ObjectId] crossReac
    }

    class UnsafeIngredients {
        ObjectId _id
        [ObjectId] ingredient
        [ObjectId] reaction
        Number avgSeverity
        [Enum] category  // suspected, confirmed
    }

    class Reactions {
        ObjectId _id
        String name
        Number severity
        [Enum] severityCategory  // none, mild, severe
    }

  
