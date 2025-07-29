<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;

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
            return [
                'uuid' => $file->uuid,
                'filename' => $file->filename,
                'category' => $file->category,
                'original_name' => $file->original_name,
            ];
        });

        $files->setCollection($transformed);

        return response()->json($files);
    }
    public function store(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'category' => 'required|in:pictures,3dmodels,documents',
            'file' => 'required|file|mimes:zip,pdf,doc,docx,jpg,png,jpeg,glb,gltf,fbx,obj',
        ]);

        $uuid = Str::uuid()->toString();
        $file = $request->file('file');
        $filename = $request->filename . '.' . $file->getClientOriginalExtension();
        $allowed3DExtensions = ['gltf', 'glb', 'fbx', 'obj'];

        if ($request->category === '3dmodels' && $file->getClientOriginalExtension() === 'zip') {
            $tempPath = storage_path('app/temp/' . Str::uuid());
            mkdir($tempPath, 0755, true);

            $zip = new ZipArchive;
            if ($zip->open($file->getRealPath()) === true) {
                $zip->extractTo($tempPath);
                $zip->close();
            } else {
                return response()->json(['error' => 'Failed to extract zip'], 500);
            }

            $ftpPath = "3dmodels/{$request->filename}";
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($tempPath, \FilesystemIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::SELF_FIRST
            );

            $modelFilePath = null;

            foreach ($files as $localFile) {
                if ($localFile->isDir()) continue;

                $relativePath = str_replace($tempPath . DIRECTORY_SEPARATOR, '', $localFile->getPathname());
                $ftpFilePath = $ftpPath . '/' . str_replace('\\', '/', $relativePath);
                $extension = strtolower($localFile->getExtension());

                Storage::disk('ftp')->put($ftpFilePath, file_get_contents($localFile));

                if (in_array($extension, $allowed3DExtensions) && $modelFilePath === null) {
                    $modelFilePath = $ftpFilePath;
                }
            }

            \File::deleteDirectory($tempPath);

            if (!$modelFilePath) {
                return response()->json(['error' => 'No valid 3D model file found in zip'], 422);
            }

            $storedFilename = $modelFilePath;
        } else {
            Storage::disk('ftp')->put($request->category . "/" . $filename, file_get_contents($file));
            $storedFilename = $request->category . "/" . $filename;
        }

        $fileModel = File::create([
            'uuid' => $uuid,
            'filename' => $storedFilename,
            'original_name' => $file->getClientOriginalName(),
            'category' => $request->category,
        ]);

        return response()->json($fileModel, 201);
    }

    public function show(string $path)
    {
        $disk = Storage::disk('ftp');

        if (!$disk->exists($path)) {
            abort(404, 'File not found.');
        }

        $content = $disk->get($path);
        $mime = $disk->mimeType($path);

        return response($content, 200)
            ->header('Content-Type', $mime)
            ->header('Content-Disposition', 'inline; filename="' . basename($path) . '"');
    }
}
