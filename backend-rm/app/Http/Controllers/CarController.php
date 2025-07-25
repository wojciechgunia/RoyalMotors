<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        return Car::with('manufacturer')->paginate($perPage);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'model' => 'required|string',
            'year_of_manufacture' => 'required|string',
            'version' => 'required|string',
            'type_of_vehicle' => 'required|string',
            'color' => 'required|string',
            'engine' => 'required|string',
            'power' => 'required|string',
            'transmission' => 'required|string',
            'fuel' => 'required|string',
            'number_of_doors' => 'required|integer',
            'number_of_seats' => 'required|integer',
            'other_info' => 'nullable|string',
            'image_url' => 'nullable|string',
            '3d_model_url' => 'nullable|string',
            'min_price' => 'required|numeric',
            'manufacturer_id' => 'required|exists:manufacturers,id',
        ]);

        $data['uuid'] = Str::uuid();

        $car = Car::create($data);

        return response()->json($car->load('manufacturer'), 201);
    }

    public function show($uuid)
    {
        $car = Car::where('uuid', $uuid)->with('manufacturer')->firstOrFail();
        return response()->json($car);
    }

    public function update(Request $request, $uuid)
    {
        $car = Car::where('uuid', $uuid)->firstOrFail();

        $data = $request->validate([
            'model' => 'sometimes|required|string',
            'year_of_manufacture' => 'sometimes|required|string',
            'version' => 'sometimes|required|string',
            'type_of_vehicle' => 'sometimes|required|string',
            'color' => 'sometimes|required|string',
            'engine' => 'sometimes|required|string',
            'power' => 'sometimes|required|string',
            'transmission' => 'sometimes|required|string',
            'fuel' => 'sometimes|required|string',
            'number_of_doors' => 'sometimes|required|integer',
            'number_of_seats' => 'sometimes|required|integer',
            'other_info' => 'nullable|string',
            'image_url' => 'nullable|string',
            '3d_model_url' => 'nullable|string',
            'min_price' => 'sometimes|required|numeric',
            'manufacturer_id' => 'sometimes|required|exists:manufacturers,id',
        ]);

        $car->update($data);

        return response()->json($car->fresh('manufacturer'));
    }

    public function destroy($uuid)
    {
        $car = Car::where('uuid', $uuid)->firstOrFail();
        $car->delete();

        return response()->json(['message' => 'Car deleted']);
    }
}
