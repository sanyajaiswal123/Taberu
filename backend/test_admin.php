<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'admin@taberu.com')->first();
auth()->login($user);

$req = Illuminate\Http\Request::create('/api/admin/users', 'GET');
$controller = new \App\Http\Controllers\Api\Admin\AdminUserController();
echo "Users: " . $controller->index($req)->getContent() . "\n\n";

$req2 = Illuminate\Http\Request::create('/api/admin/recipes', 'GET');
$controller2 = new \App\Http\Controllers\Api\Admin\AdminRecipeController();
echo "Recipes: " . substr($controller2->index($req2)->getContent(), 0, 300) . "...\n\n";

$req3 = Illuminate\Http\Request::create('/api/admin/analytics/engagement', 'GET');
$controller3 = new \App\Http\Controllers\Api\Admin\AdminAnalyticsController();
echo "Engagement: " . $controller3->engagement()->getContent() . "\n\n";
