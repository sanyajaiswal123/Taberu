<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('search_logs', function (Blueprint $table) {
            $table->id();
            $table->enum('query_type', ['ingredient', 'text']);
            $table->string('query_value');
            $table->integer('results_count')->default(0);
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('searched_at')->useCurrent();
            $table->index(['query_type', 'results_count']);
            $table->index('searched_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_logs');
    }
};
