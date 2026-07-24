<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MealPlan;
use App\Models\MealPlanItem;
use App\Models\ShoppingListCheck;
use App\Http\Resources\RecipeResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class MealPlanController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $week = $request->input('week');
        abort_unless($week && preg_match('/^\d{4}-\d{2}-\d{2}$/', $week), 422, 'week param required (YYYY-MM-DD)');

        $plan = MealPlan::firstOrCreate(
            ['user_id' => $request->user()->id, 'week_start_date' => $week]
        );

        $plan->load(['items.recipe.ingredients', 'shoppingChecks']);

        $items = $plan->items->map(fn ($item) => [
            'id'           => $item->id,
            'day_of_week'  => $item->day_of_week,
            'meal_slot'    => $item->meal_slot,
            'recipe'       => new RecipeResource($item->recipe),
        ]);

        return response()->json([
            'id'              => $plan->id,
            'week_start_date' => $plan->week_start_date->toDateString(),
            'items'           => $items,
            'shopping_checks' => $plan->shoppingChecks,
        ]);
    }

    public function addItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'recipe_id'       => 'required|integer|exists:recipes,id',
            'week_start_date' => 'required|date_format:Y-m-d',
            'day_of_week'     => 'required|integer|min:0|max:6',
            'meal_slot'       => 'required|in:breakfast,lunch,dinner,snack',
        ]);

        $plan = MealPlan::firstOrCreate([
            'user_id'         => $request->user()->id,
            'week_start_date' => $data['week_start_date'],
        ]);

        $item = MealPlanItem::updateOrCreate(
            [
                'meal_plan_id' => $plan->id,
                'day_of_week'  => $data['day_of_week'],
                'meal_slot'    => $data['meal_slot'],
            ],
            ['recipe_id' => $data['recipe_id']]
        );

        $item->load('recipe.ingredients');

        return response()->json([
            'id'          => $item->id,
            'day_of_week' => $item->day_of_week,
            'meal_slot'   => $item->meal_slot,
            'recipe'      => new RecipeResource($item->recipe),
        ], 201);
    }

    public function removeItem(Request $request, MealPlanItem $item): JsonResponse
    {
        $this->authorizeItem($request, $item);
        $item->delete();

        return response()->json(null, 204);
    }

    public function moveItem(Request $request, MealPlanItem $item): JsonResponse
    {
        $this->authorizeItem($request, $item);

        $data = $request->validate([
            'day_of_week' => 'required|integer|min:0|max:6',
            'meal_slot'   => 'required|in:breakfast,lunch,dinner,snack',
        ]);

        // Remove any existing item in the target slot first
        MealPlanItem::where('meal_plan_id', $item->meal_plan_id)
            ->where('day_of_week', $data['day_of_week'])
            ->where('meal_slot', $data['meal_slot'])
            ->where('id', '!=', $item->id)
            ->delete();

        $item->update($data);
        $item->load('recipe.ingredients');

        return response()->json([
            'id'          => $item->id,
            'day_of_week' => $item->day_of_week,
            'meal_slot'   => $item->meal_slot,
            'recipe'      => new RecipeResource($item->recipe),
        ]);
    }

    public function shoppingList(Request $request): JsonResponse
    {
        $week = $request->input('week');
        abort_unless($week && preg_match('/^\d{4}-\d{2}-\d{2}$/', $week), 422, 'week param required');

        $plan = MealPlan::where('user_id', $request->user()->id)
            ->where('week_start_date', $week)
            ->with('items.recipe.ingredients', 'shoppingChecks')
            ->first();

        if (!$plan) {
            return response()->json(['groups' => [], 'checks' => []]);
        }

        // Collect all ingredients across planned recipes
        $aggregated = [];
        foreach ($plan->items as $item) {
            foreach ($item->recipe->ingredients as $ingredient) {
                $name = strtolower($ingredient->name);
                if (!isset($aggregated[$name])) {
                    $aggregated[$name] = [
                        'name'    => $ingredient->name,
                        'recipes' => [],
                        'qty'     => null,
                    ];
                }
                $aggregated[$name]['recipes'][] = $item->recipe->title;
            }
        }

        $categories = [
            'Produce'  => ['tomato','onion','garlic','ginger','potato','carrot','spinach','lettuce','cabbage','bell pepper','pepper','lemon','lime','broccoli','mushroom','cucumber','zucchini','celery','avocado','corn'],
            'Protein'  => ['chicken','beef','pork','lamb','fish','shrimp','tofu','eggs','egg','paneer','tuna','salmon'],
            'Dairy'    => ['milk','cream','butter','cheese','yogurt','curd','ghee'],
            'Pantry'   => ['rice','pasta','flour','oil','sugar','salt','soy sauce','vinegar','broth','stock','coconut milk','bread','noodle'],
            'Spices'   => ['cumin','coriander','turmeric','chili','paprika','cinnamon','cardamom','pepper','masala','oregano','basil','thyme','bay leaf','clove','nutmeg','saffron'],
        ];

        $groups = [];
        $seen   = [];

        foreach ($categories as $cat => $keywords) {
            $items = [];
            foreach ($aggregated as $name => $data) {
                foreach ($keywords as $kw) {
                    if (str_contains($name, $kw)) {
                        $items[] = $data;
                        $seen[$name] = true;
                        break;
                    }
                }
            }
            if ($items) $groups[$cat] = $items;
        }

        $other = [];
        foreach ($aggregated as $name => $data) {
            if (!isset($seen[$name])) $other[] = $data;
        }
        if ($other) $groups['Other'] = $other;

        $checks = $plan->shoppingChecks->keyBy(fn ($c) => strtolower($c->ingredient_name));

        return response()->json(['groups' => $groups, 'checks' => $checks]);
    }

    public function toggleCheck(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ingredient_name'  => 'required|string',
            'is_checked'       => 'required|boolean',
            'week_start_date'  => 'required|date_format:Y-m-d',
        ]);

        $plan = MealPlan::where('user_id', $request->user()->id)
            ->where('week_start_date', $data['week_start_date'])
            ->firstOrFail();

        ShoppingListCheck::updateOrCreate(
            ['meal_plan_id' => $plan->id, 'ingredient_name' => strtolower($data['ingredient_name'])],
            ['is_checked' => $data['is_checked']]
        );

        return response()->json(['ok' => true]);
    }

    private function authorizeItem(Request $request, MealPlanItem $item): void
    {
        $plan = MealPlan::find($item->meal_plan_id);
        abort_unless($plan && $plan->user_id === $request->user()->id, 403);
    }
}
