<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\CookLogController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\MealPlanController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\RecipeNoteController;
use App\Http\Controllers\Api\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\AdminRecipeController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['status' => 'ok']));

// Auth — public (throttled: 6 attempts per minute)
Route::middleware('throttle:6,1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);
});

// Auth — protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Favorites
    Route::get('/favorites',              [FavoriteController::class, 'index']);
    Route::post('/favorites/{recipe}',    [FavoriteController::class, 'store']);
    Route::delete('/favorites/{recipe}',  [FavoriteController::class, 'destroy']);

    // Collections
    Route::get('/collections',                                       [CollectionController::class, 'index']);
    Route::post('/collections',                                      [CollectionController::class, 'store']);
    Route::put('/collections/{collection}',                          [CollectionController::class, 'update']);
    Route::delete('/collections/{collection}',                       [CollectionController::class, 'destroy']);
    Route::post('/collections/{collection}/recipes',                 [CollectionController::class, 'addRecipe']);
    Route::delete('/collections/{collection}/recipes/{recipeId}',   [CollectionController::class, 'removeRecipe']);
    Route::get('/collections/{collection}/recipes',                  [CollectionController::class, 'recipes']);

    // Recipe notes
    Route::get('/recipes/{recipe}/note',    [RecipeNoteController::class, 'show']);
    Route::put('/recipes/{recipe}/note',    [RecipeNoteController::class, 'upsert']);
    Route::delete('/recipes/{recipe}/note', [RecipeNoteController::class, 'destroy']);

    // Cook log
    Route::get('/cook-log',                    [CookLogController::class, 'index']);
    Route::post('/cook-log',                   [CookLogController::class, 'store']);
    Route::delete('/cook-log/{cookLog}',       [CookLogController::class, 'destroy']);
    Route::get('/cook-log/stats',              [CookLogController::class, 'stats']);
    Route::get('/cook-log/recipe/{recipeId}',  [CookLogController::class, 'countForRecipe']);

    // Meal planner
    Route::get('/meal-plan',                              [MealPlanController::class, 'show']);
    Route::post('/meal-plan/items',                       [MealPlanController::class, 'addItem']);
    Route::delete('/meal-plan/items/{item}',              [MealPlanController::class, 'removeItem']);
    Route::put('/meal-plan/items/{item}/move',            [MealPlanController::class, 'moveItem']);
    Route::get('/meal-plan/shopping-list',                [MealPlanController::class, 'shoppingList']);
    Route::patch('/meal-plan/shopping-list/check',        [MealPlanController::class, 'toggleCheck']);

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/recipes',                           [AdminRecipeController::class, 'index']);
        Route::post('/recipes',                          [AdminRecipeController::class, 'store']);
        Route::put('/recipes/{recipe}',                  [AdminRecipeController::class, 'update']);
        Route::delete('/recipes/{recipe}',               [AdminRecipeController::class, 'destroy']);
        Route::post('/recipes/bulk-import',              [AdminRecipeController::class, 'bulkImport']);

        Route::get('/analytics/overview',                [AdminAnalyticsController::class, 'overview']);
        Route::get('/analytics/search-gaps',             [AdminAnalyticsController::class, 'searchGaps']);
        Route::get('/analytics/popular-recipes',         [AdminAnalyticsController::class, 'popularRecipes']);
        Route::get('/analytics/trending-searches',       [AdminAnalyticsController::class, 'trendingSearches']);
        Route::get('/analytics/engagement',              [AdminAnalyticsController::class, 'engagement']);

        Route::get('/users',                             [AdminUserController::class, 'index']);
        Route::patch('/users/{user}/role',               [AdminUserController::class, 'updateRole']);
        Route::delete('/users/{user}',                   [AdminUserController::class, 'destroy']);
    });
});

// Recipes — public (popular must precede {recipe} to avoid route collision)
Route::get('/recipes/popular',        [RecipeController::class, 'popular']);
Route::get('/recipes',                [RecipeController::class, 'index']);
Route::get('/recipes/{recipe}',       [RecipeController::class, 'show']);
Route::post('/recipes/{recipe}/view', [RecipeController::class, 'view']);

// Ingredients — public (throttled: 30 requests per minute)
Route::middleware('throttle:30,1')->group(function () {
    Route::get('/ingredients/suggestions', [IngredientController::class, 'suggestions']);
});
