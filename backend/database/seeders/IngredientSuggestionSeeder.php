<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Seeder;

class IngredientSuggestionSeeder extends Seeder
{
    public function run(): void
    {
        $suggestions = [
            // Proteins
            'chicken', 'chicken breast', 'beef', 'ground beef', 'pork belly',
            'ground pork', 'bacon', 'shrimp', 'salmon', 'salmon fillet',
            'octopus', 'tofu', 'silken tofu', 'paneer', 'egg', 'eggs',
            // Dairy
            'butter', 'ghee', 'cream', 'heavy cream', 'sour cream',
            'milk', 'condensed milk', 'evaporated milk', 'yogurt',
            'cheese', 'parmesan cheese', 'mozzarella', 'ricotta cheese',
            'mascarpone', 'queso fresco', 'crema',
            // Vegetables
            'tomato', 'tomato soup', 'tomatillo', 'cherry tomato',
            'onion', 'garlic', 'ginger', 'scallions', 'green onion',
            'bell pepper', 'broccoli', 'carrot', 'mushroom', 'spinach',
            'potato', 'sweet potato', 'cauliflower', 'cabbage', 'zucchini',
            'cucumber', 'lettuce', 'romaine lettuce', 'corn', 'peas',
            'bean sprouts', 'avocado', 'asparagus', 'jalapeño', 'green chili',
            'red chili', 'chili', 'dried chili',
            // Grains, flours, starches
            'rice', 'basmati rice', 'cooked rice', 'arborio rice', 'puffed rice',
            'glutinous rice flour', 'wheat flour', 'flour', 'rice flour',
            'cornstarch', 'corn starch', 'breadcrumbs',
            // Pasta and noodles
            'pasta', 'spaghetti', 'penne pasta', 'lasagna noodles',
            'noodles', 'ramen noodles', 'glass noodles', 'sweet potato noodles',
            // Breads, wrappers, shells
            'bread', 'baguette', 'corn tortilla', 'tortilla chips',
            'taco shells', 'cannoli shells', 'gyoza wrappers', 'spring roll wrappers',
            'ladyfingers', 'croutons',
            // Legumes and pulses
            'chickpeas', 'yellow lentils', 'urad dal', 'edamame', 'peanuts',
            // Fats and oils
            'olive oil', 'sesame oil', 'vegetable oil',
            // Acids and condiments
            'lemon', 'lemon juice', 'lime', 'lime juice', 'vinegar',
            'balsamic vinegar', 'rice vinegar', 'soy sauce', 'fish sauce',
            'tahini', 'tomato sauce', 'sweet chili sauce', 'caesar dressing',
            'takoyaki sauce', 'mayonnaise', 'tamarind chutney',
            // Korean
            'gochujang', 'gochugaru', 'kimchi', 'rice cakes', 'fish cake',
            'asian pear',
            // Chinese / Japanese pantry
            'miso paste', 'dashi', 'mirin', 'sake', 'doubanjiang',
            'sichuan peppercorn', 'nori', 'bonito flakes', 'pickled ginger',
            'sesame seeds', 'matcha powder',
            // Indian spices and pantry
            'cumin', 'turmeric', 'coriander', 'garam masala', 'cardamom',
            'cinnamon', 'saffron', 'mustard seeds', 'curry leaves', 'ajwain',
            'bay leaf', 'red pepper flakes', 'white pepper', 'black pepper',
            'rose water', 'khoya', 'sev',
            // Herbs
            'cilantro', 'basil', 'thyme', 'dill', 'mint', 'oregano',
            'lemongrass', 'galangal',
            // Sweeteners and baking
            'sugar', 'brown sugar', 'powdered sugar', 'honey', 'maple syrup',
            'baking powder', 'baking soda', 'yeast', 'vanilla extract',
            'vanilla bean', 'gelatin',
            // Dessert ingredients
            'chocolate', 'chocolate chips', 'cocoa powder', 'espresso',
            'almonds', 'pistachios', 'berries', 'red bean paste',
            'ice cream', 'tikka masala spice', 'chili powder',
            'caramel sauce', 'dulce de leche',
            // Stock
            'chicken stock', 'vegetable broth',
            // Wines
            'white wine', 'rice wine', 'coconut milk',
            // Miscellaneous
            'salt',
        ];

        foreach ($suggestions as $name) {
            Ingredient::firstOrCreate(['name' => $name]);
        }
    }
}
