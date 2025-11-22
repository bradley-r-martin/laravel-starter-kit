import useUploadPreview from '@/Hooks/useUploadPreview';
import FileUploadService from '@/Services/FileUploadService';
import { ActionIcon, Button, FileButton, FileButtonProps, Input, Loader } from '@mantine/core';
import { X } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';

import { UploadedFile } from '@/Types';

export interface AvatarInputProps extends Omit<FileButtonProps, 'value' | 'onChange' | 'children'> {
    label?: string;
    value?: UploadedFile | null;
    error?: string;
    onChange?: (value: UploadedFile | null) => void;
}

export const AvatarInput = forwardRef<HTMLButtonElement, AvatarInputProps>((props) => {
    const { onChange, ...restProps } = props;
    const [uploading, setUploading] = useState(false);
    // Keep the uploaded file object for preview (same format as persisted files)
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

    // Clear uploaded file when value is explicitly cleared (null)
    useEffect(() => {
        if (restProps.value === null) {
            setUploadedFile(null);
        }
    }, [restProps.value]);

    // For preview, use uploaded file object if available, otherwise use the value
    const previewValue = uploadedFile || restProps.value || null;
    const preview = useUploadPreview(previewValue);
    const hasValue = Boolean(restProps.value) || Boolean(uploadedFile);

    return (
        <>
            <Input.Wrapper {...restProps}>
                <FileButton
                    onChange={async (file) => {
                        if (!file) {
                            onChange?.(null);
                            return;
                        }

                        setUploading(true);
                        try {
                            const uploadedFileResponse = await FileUploadService.upload(file);
                            // Store the uploaded file object for preview (same format as persisted files)
                            setUploadedFile(uploadedFileResponse);
                            // Store the full file object in form for submission
                            onChange?.(uploadedFileResponse);
                        } catch (error) {
                            console.error('File upload failed:', error);
                            // Clear uploaded file on error
                            setUploadedFile(null);
                            // Set to null on error
                            onChange?.(null);
                        } finally {
                            setUploading(false);
                        }
                    }}
                    accept="image/jpeg, image/png, image/jpg"
                    disabled={uploading}
                >
                    {(p) => (
                        <div className="flex items-center gap-x-3">
                            <div
                                className={`rounded-full border shadow ${props?.error ? 'border-red-500 text-red-200' : 'border-slate-300 text-slate-300'}`}
                            >
                                {!preview && (
                                    <svg
                                        {...p}
                                        className={`size-10`}
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}

                                {preview && (
                                    <img
                                        {...p}
                                        src={preview}
                                        alt="Preview"
                                        className="size-10 rounded-full border-4 border-white object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-x-1">
                                <Button
                                    type="button"
                                    size="compact-sm"
                                    styles={{
                                        root: {
                                            fontSize: 12,
                                        },
                                    }}
                                    variant="light"
                                    color={props?.error ? 'red' : 'gray'}
                                    radius="xl"
                                    {...p}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <Loader size="xs" />
                                    ) : hasValue ? (
                                        'Change'
                                    ) : (
                                        'Select'
                                    )}
                                </Button>
                                {hasValue && (
                                    <ActionIcon
                                        styles={{
                                            root: { padding: 5, height: 'auto', width: 'auto' },
                                        }}
                                        type="button"
                                        size="sm"
                                        variant="light"
                                        color="gray"
                                        radius="xl"
                                        onClick={() => {
                                            setUploadedFile(null);
                                            onChange?.(null);
                                        }}
                                    >
                                        <X className="size-3.5" />
                                    </ActionIcon>
                                )}
                            </div>
                        </div>
                    )}
                </FileButton>
            </Input.Wrapper>
        </>
    );
});

AvatarInput.displayName = 'AvatarInput';

export default AvatarInput;
