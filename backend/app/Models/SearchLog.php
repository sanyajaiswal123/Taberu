<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchLog extends Model
{
    public $timestamps = false;

    protected $fillable = ['query_type', 'query_value', 'results_count', 'user_id'];

    protected $casts = ['searched_at' => 'datetime'];
}
