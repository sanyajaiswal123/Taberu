<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\CookLog;
use App\Models\Favorite;
use App\Models\MealPlan;
use App\Models\MealPlanItem;
use App\Models\Recipe;
use App\Models\RecipeNote;
use App\Models\SearchLog;
use App\Models\ShoppingListCheck;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ─────────────────────────────────────────────
        // 1. SANYA — regular user  (sanya@gmail.com / sanya123)
        // ─────────────────────────────────────────────
        $sanya = User::updateOrCreate(
            ['email' => 'sanya@gmail.com'],
            [
                'name'     => 'Sanya Jaiswal',
                'password' => Hash::make('sanya123'),
                'role'     => 'user',
            ]
        );

        // --- Favorites (10 recipes she loves) ---
        $sanyaFavoriteIds = [1, 2, 7, 9, 12, 16, 19, 23, 24, 27];
        foreach ($sanyaFavoriteIds as $recipeId) {
            Favorite::firstOrCreate([
                'user_id'   => $sanya->id,
                'recipe_id' => $recipeId,
            ]);
        }

        // --- Collections ---
        $weeknightDinners = Collection::updateOrCreate(
            ['user_id' => $sanya->id, 'name' => 'Weeknight Dinners'],
            ['emoji' => '🍽️', 'sort_order' => 1]
        );
        $weeknightDinners->recipes()->syncWithoutDetaching(
            collect([1, 2, 8, 12, 14])->toArray()
        );

        $brunchFaves = Collection::updateOrCreate(
            ['user_id' => $sanya->id, 'name' => 'Brunch Favourites'],
            ['emoji' => '☕', 'sort_order' => 2]
        );
        $brunchFaves->recipes()->syncWithoutDetaching(
            collect([16, 24, 25, 26, 27])->toArray()
        );

        $asianSpecials = Collection::updateOrCreate(
            ['user_id' => $sanya->id, 'name' => 'Asian Specials'],
            ['emoji' => '🥢', 'sort_order' => 3]
        );
        $asianSpecials->recipes()->syncWithoutDetaching(
            collect([7, 19, 20, 22, 23])->toArray()
        );

        // --- Cook Logs (14 cooked entries) ---
        $sanyaCookLogs = [
            ['recipe_id' => 1,  'cooked_at' => now()->subDays(2),  'rating' => 5],
            ['recipe_id' => 12, 'cooked_at' => now()->subDays(5),  'rating' => 5],
            ['recipe_id' => 9,  'cooked_at' => now()->subDays(7),  'rating' => 4],
            ['recipe_id' => 2,  'cooked_at' => now()->subDays(10), 'rating' => 5],
            ['recipe_id' => 16, 'cooked_at' => now()->subDays(12), 'rating' => 4],
            ['recipe_id' => 24, 'cooked_at' => now()->subDays(14), 'rating' => 5],
            ['recipe_id' => 7,  'cooked_at' => now()->subDays(18), 'rating' => 5],
            ['recipe_id' => 19, 'cooked_at' => now()->subDays(21), 'rating' => 4],
            ['recipe_id' => 23, 'cooked_at' => now()->subDays(25), 'rating' => 5],
            ['recipe_id' => 27, 'cooked_at' => now()->subDays(28), 'rating' => 5],
            ['recipe_id' => 8,  'cooked_at' => now()->subDays(32), 'rating' => 4],
            ['recipe_id' => 14, 'cooked_at' => now()->subDays(36), 'rating' => 4],
            ['recipe_id' => 20, 'cooked_at' => now()->subDays(40), 'rating' => 5],
            ['recipe_id' => 26, 'cooked_at' => now()->subDays(45), 'rating' => 5],
        ];
        foreach ($sanyaCookLogs as $log) {
            CookLog::firstOrCreate(
                ['user_id' => $sanya->id, 'recipe_id' => $log['recipe_id'], 'cooked_at' => $log['cooked_at']],
                ['rating' => $log['rating']]
            );
        }

        // --- Recipe Notes ---
        $sanyaNotes = [
            ['recipe_id' => 1,  'note_text' => 'Add a bit more kasuri methi at the end — makes it restaurant-quality! Also tried with bone-in chicken, so much better.'],
            ['recipe_id' => 9,  'note_text' => 'Used Mama\'s recipe for the birista fried onions. Double the saffron for that gorgeous colour. Dum it for the full 25 min — don\'t rush!'],
            ['recipe_id' => 7,  'note_text' => 'Cedar plank on the BBQ is a game changer. Brush with honey-dijon glaze in the last 2 minutes.'],
            ['recipe_id' => 16, 'note_text' => 'Sift the matcha twice to avoid lumps. Let the batter rest 5 min before cooking for fluffier results.'],
            ['recipe_id' => 27, 'note_text' => 'The key is NOT over-mixing the meringue into the yolk batter. Folding in 3 batches gives the airiest texture. Cover with a lid the whole time!'],
            ['recipe_id' => 12, 'note_text' => 'Blanch spinach for only 30 seconds and shock in ice water. Retains that vibrant green colour perfectly.'],
            ['recipe_id' => 24, 'note_text' => 'Knead the dough well and let it rest for 20 min. The potato filling is perfect with a squeeze of lemon and some chaat masala.'],
        ];
        foreach ($sanyaNotes as $note) {
            RecipeNote::firstOrCreate(
                ['user_id' => $sanya->id, 'recipe_id' => $note['recipe_id']],
                ['note_text' => $note['note_text']]
            );
        }

        // --- Meal Plan (this week) ---
        $thisMonday = now()->startOfWeek()->toDateString();
        $sanyaMealPlan = MealPlan::firstOrCreate(
            ['user_id' => $sanya->id, 'week_start_date' => $thisMonday]
        );

        // day_of_week: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
        $sanyaMealItems = [
            ['day_of_week' => 0, 'meal_slot' => 'breakfast', 'recipe_id' => 16],
            ['day_of_week' => 0, 'meal_slot' => 'dinner',    'recipe_id' => 1],
            ['day_of_week' => 1, 'meal_slot' => 'breakfast', 'recipe_id' => 24],
            ['day_of_week' => 1, 'meal_slot' => 'dinner',    'recipe_id' => 12],
            ['day_of_week' => 2, 'meal_slot' => 'breakfast', 'recipe_id' => 25],
            ['day_of_week' => 2, 'meal_slot' => 'dinner',    'recipe_id' => 19],
            ['day_of_week' => 3, 'meal_slot' => 'breakfast', 'recipe_id' => 26],
            ['day_of_week' => 3, 'meal_slot' => 'dinner',    'recipe_id' => 9],
            ['day_of_week' => 4, 'meal_slot' => 'breakfast', 'recipe_id' => 27],
            ['day_of_week' => 4, 'meal_slot' => 'dinner',    'recipe_id' => 7],
            ['day_of_week' => 5, 'meal_slot' => 'breakfast', 'recipe_id' => 23],
            ['day_of_week' => 5, 'meal_slot' => 'lunch',     'recipe_id' => 21],
            ['day_of_week' => 5, 'meal_slot' => 'dinner',    'recipe_id' => 20],
            ['day_of_week' => 6, 'meal_slot' => 'breakfast', 'recipe_id' => 28],
            ['day_of_week' => 6, 'meal_slot' => 'snack',     'recipe_id' => 10],
            ['day_of_week' => 6, 'meal_slot' => 'dinner',    'recipe_id' => 2],
        ];
        foreach ($sanyaMealItems as $item) {
            MealPlanItem::firstOrCreate([
                'meal_plan_id' => $sanyaMealPlan->id,
                'day_of_week'  => $item['day_of_week'],
                'meal_slot'    => $item['meal_slot'],
            ], ['recipe_id' => $item['recipe_id']]);
        }

        // --- Shopping List Checks (partially ticked) ---
        $sanyaShoppingItems = [
            ['ingredient_name' => 'Chicken (1 kg)',       'is_checked' => true],
            ['ingredient_name' => 'Basmati Rice (2 cups)', 'is_checked' => true],
            ['ingredient_name' => 'Paneer (400 g)',        'is_checked' => true],
            ['ingredient_name' => 'Spinach (500 g)',       'is_checked' => false],
            ['ingredient_name' => 'Heavy Cream (200 ml)', 'is_checked' => false],
            ['ingredient_name' => 'Saffron',              'is_checked' => true],
            ['ingredient_name' => 'Salmon Fillet (2)',     'is_checked' => false],
            ['ingredient_name' => 'Matcha Powder (50 g)', 'is_checked' => true],
            ['ingredient_name' => 'Kimchi (1 jar)',        'is_checked' => false],
            ['ingredient_name' => 'Sesame Oil',            'is_checked' => true],
            ['ingredient_name' => 'Coconut Milk',          'is_checked' => false],
            ['ingredient_name' => 'Glutinous Rice Flour',  'is_checked' => false],
        ];
        foreach ($sanyaShoppingItems as $item) {
            ShoppingListCheck::firstOrCreate(
                ['meal_plan_id' => $sanyaMealPlan->id, 'ingredient_name' => $item['ingredient_name']],
                ['is_checked' => $item['is_checked']]
            );
        }

        // --- Search Logs ---
        $sanyaSearches = [
            ['query_type' => 'text', 'query_value' => 'chicken',      'results_count' => 8],
            ['query_type' => 'text', 'query_value' => 'paneer',       'results_count' => 5],
            ['query_type' => 'ingredient', 'query_value' => 'salmon', 'results_count' => 3],
            ['query_type' => 'text', 'query_value' => 'matcha',       'results_count' => 2],
            ['query_type' => 'text', 'query_value' => 'biryani',      'results_count' => 4],
            ['query_type' => 'ingredient', 'query_value' => 'pasta',  'results_count' => 6],
            ['query_type' => 'text', 'query_value' => 'breakfast',    'results_count' => 10],
            ['query_type' => 'text', 'query_value' => 'quick dinner', 'results_count' => 7],
        ];
        foreach ($sanyaSearches as $search) {
            SearchLog::create(array_merge($search, ['user_id' => $sanya->id]));
        }

        // ─────────────────────────────────────────────
        // 2. ADMIN — admin@taberu.com / admin123
        // ─────────────────────────────────────────────
        $admin = User::updateOrCreate(
            ['email' => 'admin@taberu.com'],
            [
                'name'     => 'Taberu Admin',
                'password' => Hash::make('admin123'),
                'role'     => 'admin',
            ]
        );

        // --- Admin Favorites (curated showcase set) ---
        $adminFavoriteIds = [1, 3, 6, 7, 9, 11, 18, 20, 23, 27];
        foreach ($adminFavoriteIds as $recipeId) {
            Favorite::firstOrCreate([
                'user_id'   => $admin->id,
                'recipe_id' => $recipeId,
            ]);
        }

        // --- Admin Collections (editorial/curation style) ---
        $staffPicks = Collection::updateOrCreate(
            ['user_id' => $admin->id, 'name' => 'Staff Picks'],
            ['emoji' => '⭐', 'sort_order' => 1]
        );
        $staffPicks->recipes()->syncWithoutDetaching(
            collect([1, 7, 9, 18, 27])->toArray()
        );

        $trending = Collection::updateOrCreate(
            ['user_id' => $admin->id, 'name' => 'Trending This Week'],
            ['emoji' => '🔥', 'sort_order' => 2]
        );
        $trending->recipes()->syncWithoutDetaching(
            collect([2, 11, 19, 20, 23, 24])->toArray()
        );

        $quickEasy = Collection::updateOrCreate(
            ['user_id' => $admin->id, 'name' => 'Under 20 Minutes'],
            ['emoji' => '⏱️', 'sort_order' => 3]
        );
        $quickEasy->recipes()->syncWithoutDetaching(
            collect([4, 10, 17, 19, 21, 25])->toArray()
        );

        // --- Admin Cook Logs ---
        $adminCookLogs = [
            ['recipe_id' => 9,  'cooked_at' => now()->subDays(1),  'rating' => 5],
            ['recipe_id' => 7,  'cooked_at' => now()->subDays(3),  'rating' => 5],
            ['recipe_id' => 18, 'cooked_at' => now()->subDays(6),  'rating' => 5],
            ['recipe_id' => 27, 'cooked_at' => now()->subDays(9),  'rating' => 5],
            ['recipe_id' => 1,  'cooked_at' => now()->subDays(12), 'rating' => 5],
            ['recipe_id' => 3,  'cooked_at' => now()->subDays(15), 'rating' => 4],
            ['recipe_id' => 6,  'cooked_at' => now()->subDays(19), 'rating' => 5],
            ['recipe_id' => 20, 'cooked_at' => now()->subDays(22), 'rating' => 4],
        ];
        foreach ($adminCookLogs as $log) {
            CookLog::firstOrCreate(
                ['user_id' => $admin->id, 'recipe_id' => $log['recipe_id'], 'cooked_at' => $log['cooked_at']],
                ['rating' => $log['rating']]
            );
        }

        // --- Admin Recipe Notes ---
        $adminNotes = [
            ['recipe_id' => 9,  'note_text' => 'Verified recipe — dum time is critical. We tested 20 min vs 25 min; 25 produces the best steam layering.'],
            ['recipe_id' => 7,  'note_text' => 'Featured in our Spring 2026 showcase. Honey-miso glaze variant performs exceptionally well in user tests.'],
            ['recipe_id' => 18, 'note_text' => 'Most-shared recipe of the month! Tip: use silicone molds for perfectly uniform mochi balls.'],
            ['recipe_id' => 27, 'note_text' => 'Our most viewed Japanese recipe. Pancake height depends on lid seal — use a tight-fitting lid.'],
            ['recipe_id' => 1,  'note_text' => 'All-time user favourite. The kasuri methi finish is the secret that 80% of commenters miss.'],
        ];
        foreach ($adminNotes as $note) {
            RecipeNote::firstOrCreate(
                ['user_id' => $admin->id, 'recipe_id' => $note['recipe_id']],
                ['note_text' => $note['note_text']]
            );
        }

        // --- Admin Meal Plan ---
        $adminMealPlan = MealPlan::firstOrCreate(
            ['user_id' => $admin->id, 'week_start_date' => $thisMonday]
        );

        $adminMealItems = [
            ['day_of_week' => 0, 'meal_slot' => 'breakfast', 'recipe_id' => 27],
            ['day_of_week' => 0, 'meal_slot' => 'dinner',    'recipe_id' => 9],
            ['day_of_week' => 1, 'meal_slot' => 'breakfast', 'recipe_id' => 25],
            ['day_of_week' => 1, 'meal_slot' => 'dinner',    'recipe_id' => 7],
            ['day_of_week' => 2, 'meal_slot' => 'breakfast', 'recipe_id' => 23],
            ['day_of_week' => 2, 'meal_slot' => 'dinner',    'recipe_id' => 20],
            ['day_of_week' => 3, 'meal_slot' => 'breakfast', 'recipe_id' => 16],
            ['day_of_week' => 3, 'meal_slot' => 'dinner',    'recipe_id' => 1],
            ['day_of_week' => 4, 'meal_slot' => 'snack',     'recipe_id' => 21],
            ['day_of_week' => 4, 'meal_slot' => 'dinner',    'recipe_id' => 3],
            ['day_of_week' => 5, 'meal_slot' => 'breakfast', 'recipe_id' => 26],
            ['day_of_week' => 5, 'meal_slot' => 'dinner',    'recipe_id' => 18],
            ['day_of_week' => 6, 'meal_slot' => 'dinner',    'recipe_id' => 6],
        ];
        foreach ($adminMealItems as $item) {
            MealPlanItem::firstOrCreate([
                'meal_plan_id' => $adminMealPlan->id,
                'day_of_week'  => $item['day_of_week'],
                'meal_slot'    => $item['meal_slot'],
            ], ['recipe_id' => $item['recipe_id']]);
        }

        // --- Admin Shopping List ---
        $adminShoppingItems = [
            ['ingredient_name' => 'Basmati Rice (3 cups)',    'is_checked' => true],
            ['ingredient_name' => 'Chicken (2 kg)',            'is_checked' => true],
            ['ingredient_name' => 'Saffron Threads',           'is_checked' => true],
            ['ingredient_name' => 'Salmon Fillet (4)',         'is_checked' => false],
            ['ingredient_name' => 'Glutinous Rice Flour (2 bags)', 'is_checked' => false],
            ['ingredient_name' => 'Ice Cream (vanilla & matcha)',  'is_checked' => false],
            ['ingredient_name' => 'Arborio Rice',              'is_checked' => true],
            ['ingredient_name' => 'Mushrooms (500 g)',         'is_checked' => true],
            ['ingredient_name' => 'Parmesan Block',            'is_checked' => false],
            ['ingredient_name' => 'Lemongrass Stalks',         'is_checked' => false],
        ];
        foreach ($adminShoppingItems as $item) {
            ShoppingListCheck::firstOrCreate(
                ['meal_plan_id' => $adminMealPlan->id, 'ingredient_name' => $item['ingredient_name']],
                ['is_checked' => $item['is_checked']]
            );
        }

        $this->command->info('✅  Seeded Sanya (sanya@gmail.com / sanya123) and Admin (admin@taberu.com / admin123)');
    }
}
