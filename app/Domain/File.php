<?php

declare(strict_types=1);

namespace App\Domain;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class File
{
    public function __construct(
        public ?string $path = null,
        public ?string $disk = 'private',
        public ?string $mime_type = null,
        public ?int $size = null,
        public ?string $filename = null,
    ) {}

    /**
     * @param  array<string, string|int|null>|null  $attributes
     */
    public static function fromArray(?array $attributes): self
    {
        if ($attributes === null || $attributes === []) {
            return new self();
        }

        return new self(
            path: isset($attributes['path']) && is_string($attributes['path']) ? $attributes['path'] : null,
            disk: isset($attributes['disk']) && is_string($attributes['disk']) ? $attributes['disk'] : 'private',
            mime_type: isset($attributes['mime_type']) && is_string($attributes['mime_type']) ? $attributes['mime_type'] : null,
            size: isset($attributes['size']) && is_int($attributes['size']) ? $attributes['size'] : null,
            filename: isset($attributes['filename']) && is_string($attributes['filename']) ? $attributes['filename'] : null,
        );
    }

    public static function fromUploadedFile(UploadedFile $file, string $disk = 'public', string $directory = ''): self
    {
        $extension = $file->getClientOriginalExtension();

        $path = Storage::disk($disk)->putFileAs(
            $directory,
            $file,
            Str::uuid().'.'.$extension
        );

        return new self(
            path: $path ?: null, // ensure null instead of false
            disk: $disk,
            mime_type: $file->getClientMimeType(),
            size: $file->getSize(),
            filename: $file->getClientOriginalName(),
        );
    }

    public static function fromTemporaryUpload(string $uuid, string $targetDisk = 'public', string $targetDirectory = ''): ?self
    {
        // Find the file in temp directory by UUID (temp files are now stored in public disk)
        $files = Storage::disk('public')->files('temp');

        foreach ($files as $file) {
            // Ensure $file is a string (Storage::files() returns string[])
            if (! is_string($file)) {
                continue;
            }

            $filename = basename($file);
            // Check if filename starts with the UUID (format: uuid.extension)
            if (str_starts_with($filename, $uuid.'.')) {
                $extension = pathinfo($filename, PATHINFO_EXTENSION);
                $newPath = ($targetDirectory !== '' && $targetDirectory !== '0' ? $targetDirectory.'/' : '').$uuid.'.'.$extension;

                // Move file from temp to target location
                $contents = Storage::disk('public')->get($file);
                if ($contents === null) {
                    return null;
                }

                Storage::disk($targetDisk)->put($newPath, $contents);

                // Get file info
                $mimeType = Storage::disk($targetDisk)->mimeType($newPath);
                $size = Storage::disk($targetDisk)->size($newPath);

                // Delete temp file
                Storage::disk('public')->delete($file);

                return new self(
                    path: $newPath,
                    disk: $targetDisk,
                    mime_type: $mimeType ?: null,
                    size: $size ?: null,
                    filename: $filename,
                );
            }
        }

        return null;
    }

    /**
     * Persist the file from temporary storage to the target disk if it's in temporary storage.
     * Returns the persisted file instance or the original file if it's already persisted.
     */
    public function persist(string $targetDisk = 'public', string $targetDirectory = ''): self
    {
        // If not a temporary file, return itself
        if ($this->path === null || $this->path === '' || $this->path === '0' || ! str_starts_with($this->path, 'temp/')) {
            return $this;
        }

        // Extract UUID from path (format: temp/uuid.extension)
        $uuid = basename($this->path, '.'.pathinfo($this->path, PATHINFO_EXTENSION));

        $persistedFile = self::fromTemporaryUpload($uuid, $targetDisk, $targetDirectory);

        // Return the persisted file if successful, otherwise return original
        return $persistedFile ?? $this;
    }

    /**
     * @return array<string, string|int|null>
     */
    public function toArray(): array
    {
        return [
            'path' => $this->path,
            'disk' => $this->disk,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'filename' => $this->filename,
        ];
    }

    public function url(): ?string
    {
        return $this->path !== null && $this->path !== '' && $this->path !== '0'
            ? Storage::url($this->path)
            : null;
    }

    public function exists(): bool
    {
        return $this->path !== null && Storage::disk($this->disk)->exists($this->path);
    }

    public function isValid(): bool
    {
        return $this->path !== null;
    }
}
