'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, ImageIcon, VideoIcon, Trash2, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useStories } from '@/hooks/use-stories';
import { useToast } from '@/hooks/use-toast';
import { fileToBase64 } from '@/lib/image-utils';

export default function UploadStoryPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { uploadStory, loading } = useStories();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
            toast({
                title: 'Invalid File',
                description: 'Please select an image or video file',
                variant: 'destructive'
            });
            return;
        }

        // Check file size
        const maxSize = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for videos
        if (file.size > maxSize) {
            toast({
                title: 'File Too Large',
                description: `File size must be less than ${isImage ? '10MB' : '50MB'}`,
                variant: 'destructive'
            });
            return;
        }

        setSelectedFile(file);
        setFileType(isImage ? 'image' : 'video');

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
        setFileType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast({
                title: 'No File Selected',
                description: 'Please select a file to upload',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsUploading(true);

            // Convert file to base64
            const base64Data = await fileToBase64(selectedFile);

            // Upload story
            const result = await uploadStory({
                base64Data,
                caption: caption.trim() || undefined,
                fileName: selectedFile.name
            });

            if (result) {
                toast({
                    title: 'Success',
                    description: 'Story uploaded successfully!',
                });
                router.push('/admin');
            }
        } catch (error: any) {
            console.error('Error uploading story:', error);
            toast({
                title: 'Upload Failed',
                description: error.message || 'Failed to upload story',
                variant: 'destructive'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-10 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="absolute top-10 left-6">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Upload Story</h1>
                    <p className="text-sm text-white/80 mt-1">Share your moment • Expires in 24 hours</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pt-[160px] pb-24">
                {/* File Upload Section */}
                {!preview ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div
                            onClick={handleClickUpload}
                            className="w-full max-w-md bg-[#0D1F1F] border-2 border-dashed border-[#14FFEC] rounded-[20px] p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[#0D1F1F]/70 transition-all"
                        >
                            <div className="w-20 h-20 bg-[#14FFEC]/20 rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-10 h-10 text-[#14FFEC]" />
                            </div>
                            <h3 className="text-white text-lg font-semibold mb-2">Choose a file</h3>
                            <p className="text-gray-400 text-sm text-center mb-4">
                                Images (JPG, JPEG, PNG, GIF, WEBP, BMP) up to 10MB
                                <br />
                                Videos (MP4, MOV, AVI, MKV, WEBM, 3GP) up to 50MB
                            </p>
                            <div className="flex gap-4 mt-4">
                                <div className="flex flex-col items-center">
                                    <ImageIcon className="w-8 h-8 text-[#14FFEC] mb-1" />
                                    <span className="text-xs text-gray-400">Image</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <VideoIcon className="w-8 h-8 text-[#14FFEC] mb-1" />
                                    <span className="text-xs text-gray-400">Video</span>
                                </div>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,video/mp4,video/mov,video/avi,video/mkv,video/webm,video/3gp"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Preview */}
                        <div className="relative">
                            <div className="bg-[#0D1F1F] border border-[#14FFEC] rounded-[20px] p-4 overflow-hidden">
                                {fileType === 'image' ? (
                                    <img
                                        src={preview}
                                        alt="Story preview"
                                        className="w-full h-auto max-h-[500px] object-contain rounded-[15px]"
                                    />
                                ) : (
                                    <video
                                        src={preview}
                                        controls
                                        className="w-full h-auto max-h-[500px] rounded-[15px]"
                                    />
                                )}
                            </div>
                            <button
                                onClick={handleRemoveFile}
                                className="absolute top-6 right-6 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Caption Input */}
                        <div className="space-y-3">
                            <label className="text-[#14FFEC] font-semibold text-base px-2">
                                Caption (Optional)
                            </label>
                            <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[20px] p-4">
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    maxLength={500}
                                    placeholder="Add a caption to your story..."
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none resize-none min-h-[100px] text-base"
                                />
                                <div className="text-right text-xs text-gray-500 mt-2">
                                    {caption.length}/500
                                </div>
                            </div>
                        </div>

                        {/* File Info */}
                        <div className="bg-[#0D1F1F]/50 border border-[#0C898B] rounded-[15px] p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">File:</span>
                                <span className="text-white font-medium">{selectedFile?.name}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-gray-400">Size:</span>
                                <span className="text-white">{(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-gray-400">Type:</span>
                                <span className="text-white capitalize">{fileType}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleRemoveFile}
                                className="flex-1 bg-[#0D1F1F] border border-[#0C898B] text-white py-4 rounded-[15px] font-semibold hover:bg-[#0D1F1F]/70 transition-all"
                            >
                                Change File
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || loading}
                                className="flex-1 bg-[#14FFEC] text-black py-4 rounded-[15px] font-semibold hover:bg-[#14FFEC]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading || loading ? 'Uploading...' : 'Upload Story'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
