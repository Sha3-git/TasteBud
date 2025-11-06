# Population Scripts

The population scripts use data information from official databases to seed our own in order not to exceed api query limits enforced by these services and to also easily parse only the necessary information that we need.
Below are the sources with the download link for independent parsing and use. Each population script should be run individually

**Root directory:** ```server```

Populate ```brandedFoods``` schema
```
node .\utils\population\brandedFoodsPopulate.js
```