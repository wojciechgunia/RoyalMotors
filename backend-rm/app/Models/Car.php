<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Car extends Model
{
    protected $fillable = [
        'uuid',
        'model',
        'year_of_manufacture',
        'version',
        'type_of_vehicle',
        'color',
        'engine',
        'power',
        'transmission',
        'fuel',
        'number_of_doors',
        'number_of_seats',
        'other_info',
        'image_url',
        '3d_model_url',
        'min_price',
        'manufacturer_id'
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

}
