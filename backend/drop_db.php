<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    \Illuminate\Support\Facades\DB::connection('mongodb')->getMongoClient()->dropDatabase(env('DB_DATABASE', 'taberu'));
    echo "Database dropped.\n";
} catch (\Exception $e) {
    echo "Failed: " . $e->getMessage() . "\n";
}
