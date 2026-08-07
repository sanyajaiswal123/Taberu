<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$instance = App\Models\PersonalAccessToken::find('6a7640e4bff85d3b980449f6');
$tokenable = $instance->tokenable;

echo "HasApiTokens in class_uses_recursive: " . (in_array(Laravel\Sanctum\HasApiTokens::class, class_uses_recursive($tokenable)) ? 'true' : 'false') . "\n";
