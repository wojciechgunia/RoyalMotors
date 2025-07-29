<?php

namespace App\Http\Controllers;

use App\Models\Manufacturer;
use Illuminate\Http\Request;

class ManufacturerController extends Controller
{
    public function index()
    {
        return Manufacturer::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:manufacturers,code',
            'name' => 'required|string|unique:manufacturers,name',
            'logo_url' => 'nullable|string|url',
        ]);

        $manufacturer = Manufacturer::create($validated);

        return response()->json($manufacturer, 201);
    }

    public function show($code)
    {
        $manufacturer = Manufacturer::with('cars')->where('code', $code)->firstOrFail();
        return response()->json($manufacturer);
    }

    public function update(Request $request, $code)
    {
        $manufacturer = Manufacturer::where('code', $code)->firstOrFail();

        $validated = $request->validate([
            'code' => 'sometimes|required|string|unique:manufacturers,code,' . $manufacturer->id,
            'name' => 'sometimes|required|string|unique:manufacturers,name,' . $manufacturer->id,
            'logo_url' => 'nullable|string|url',
        ]);

        $manufacturer->update($validated);

        return response()->json($manufacturer);
    }


    public function destroy($code)
    {
        $manufacturer = Manufacturer::where('code', $code)->firstOrFail();
        $manufacturer->delete();

        return response()->json(['message' => 'Manufacturer deleted']);
    }
}
