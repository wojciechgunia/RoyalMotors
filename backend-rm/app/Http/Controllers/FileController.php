<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class FileController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $category = $request->input('category');

        $query = File::query();

        if ($category) {
            $query->where('category', $category);
        }

        $files = $query->paginate($perPage);

        $transformed = $files->getCollection()->transform(function ($file) {
            $data = [
                'uuid' => $file->uuid,
                'filename' => $file->filename,
                'category' => $file->category,
                'original_name' => $file->original_name,
            ];

            if ($file->category === 'pictures') {
                try {
                    $raw = Storage::disk('ftp')->get($file->filename);
                    $base64 = base64_encode($raw);
                    $mime = Storage::disk('ftp')->mimeType($file->filename);
                    $data['image_base64'] = "data:{$mime};base64,{$base64}";
                } catch (\Exception $e) {
                    $data['image_base64'] = null;
                }
            }

            return $data;
        });

        $files->setCollection($transformed);

        return response()->json($files);
    }
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,png,pdf,gltf',
            'category' => 'required|in:pictures,3dmodels,documents',
        ]);

        $file = $request->file('file');
        $uuid = (string) Str::uuid();
        $extension = $file->getClientOriginalExtension();
        $filename = "$uuid.$extension";
        $path = "$request->category/$filename";

        Storage::disk('ftp')->put($path, file_get_contents($file));

        $record = File::create([
            'uuid' => $uuid,
            'filename' => $path,
            'original_name' => $file->getClientOriginalName(),
            'category' => $request->category,
        ]);

        return response()->json(['uuid' => $record->uuid], Response::HTTP_CREATED);
    }

    public function show(Request $request)
    {
        $request->validate(['uuid' => 'required|uuid']);

        $file = File::where('uuid', $request->uuid)->firstOrFail();
        $content = Storage::disk('ftp')->get($file->filename);

        return response($content, 200)
            ->header('Content-Type', Storage::disk('ftp')->mimeType($file->filename))
            ->header('Content-Disposition', 'inline; filename="' . $file->original_name . '"');
    }
}
