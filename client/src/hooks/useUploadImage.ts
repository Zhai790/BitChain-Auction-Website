import { useState } from 'react';
import { supabase } from '../data/supabaseClient';

export function useUploadImage() {
    const BUCKET = 'seng513-bidchain';

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Upload an image to Supabase.
     * @param file File to upload
     * @param folder "avatar" | "banner" | "nft"
     */
    async function uploadImage(
        file: File,
        folder: 'avatar' | 'banner' | 'nft',
        username: string
    ): Promise<string> {
        setUploading(true);
        setError(null);

        const filePath = `${folder}/${Date.now()}-${file.name}-${username}`;

        try {
            // Upload
            const { data, error: uploadError } = await supabase.storage
                .from(BUCKET)
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

            return publicUrl;
        } catch (err: any) {
            setError(err.message ?? 'Failed to upload image');
            throw err;
        } finally {
            setUploading(false);
        }
    }

    return {
        uploadImage,
        uploading,
        error,
        resetError: () => setError(null),
    };
}
