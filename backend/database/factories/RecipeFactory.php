<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RecipeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'        => $this->faker->words(3, true),
            'description'  => $this->faker->sentence(),
            'category'     => $this->faker->randomElement(['breakfast', 'dinner', 'snacks', 'dessert']),
            'cuisine'      => $this->faker->randomElement(['japanese', 'indian', 'italian', 'chinese', 'korean', 'mexican']),
            'cook_time'    => $this->faker->randomElement(['15 mins', '30 mins', '45 mins', '1 hour']),
            'servings'     => $this->faker->numberBetween(1, 6),
            'difficulty'   => $this->faker->randomElement(['easy', 'medium', 'hard']),
            'emoji'        => '🍜',
            'image'        => null,
            'gradient'     => null,
            'rating'       => $this->faker->randomFloat(2, 3, 5),
            'review_count' => $this->faker->numberBetween(0, 200),
            'view_count'   => $this->faker->numberBetween(0, 1000),
            'instructions' => ['Step 1.', 'Step 2.'],
        ];
    }
}
