<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ManufacturerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::middleware(['auth:sanctum'])->get('user', function (Request $request) {
        return $request->user();
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('file', [FileController::class, 'store']);
        Route::apiResource('manufacturers/cars', CarController::class)->except(['index', 'show']);
        Route::apiResource('manufacturers', ManufacturerController::class)->except(['index', 'show']);
    });

    Route::get('403', function (Request $request) {
        return response()->json('unauthorised', 403);
    });

    Route::get('file/{uuid}', [FileController::class, 'show']);
    Route::apiResource('manufacturers/cars', CarController::class)->only(['index', 'show']);
    Route::apiResource('manufacturers', ManufacturerController::class)->only(['index', 'show']);
});
