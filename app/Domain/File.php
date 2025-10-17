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
}
