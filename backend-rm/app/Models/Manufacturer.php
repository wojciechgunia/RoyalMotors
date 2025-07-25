<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manufacturer extends Model
{
    protected $fillable = [
        'code',
        'name',
        'logo_url'
    ];

    public function cars(): HasMany
    {
        return $this->hasMany(Car::class);
    }
}
