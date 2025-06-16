"use client";
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, Share2, Trash2, Loader2, FileIcon, AlertCircle, CheckCircle, Copy, GraduationCap } from 'lucide-react';
import { createSPASassClient } from '@/lib/supabase/client';
import { FileObject } from '@supabase/storage-js';
import { useUserArtifacts } from '@/lib/hooks/useUserArtifacts';

// Lazy load heavy components
const AlertDialog = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialog 
})));
const AlertDialogAction = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogAction 
})));
const AlertDialogCancel = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogCancel 
})));
const AlertDialogContent = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogContent 
})));
const AlertDialogDescription = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogDescription 
})));
const AlertDialogFooter = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogFooter 
})));
const AlertDialogHeader = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogHeader 
})));
const AlertDialogTitle = lazy(() => import('@/components/ui/alert-dialog').then(module => ({ 
  default: module.AlertDialogTitle 
})));
const Dialog = lazy(() => import('@/components/ui/dialog').then(module => ({ 
  default: module.Dialog 
})));
const DialogContent = lazy(() => import('@/components/ui/dialog').then(module => ({ 
  default: module.DialogContent 
})));
const DialogDescription = lazy(() => import('@/components/ui/dialog').then(module => ({ 
  default: module.DialogDescription 
})));
const DialogHeader = lazy(() => import('@/components/ui/dialog').then(module => ({ 
  default: module.DialogHeader 
})));
const DialogTitle = lazy(() => import('@/components/ui/dialog').then(module => ({ 
  default: module.DialogTitle 
})));

export default function FileManagementPage() {
    const { user } = useGlobal();
    const [files, setFiles] = useState<FileObject[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Use the new artifacts hook
    const { artifactsData, loading: artifactsLoading, error: artifactsError } = useUserArtifacts(user?.id);

    const loadFiles = useCallback(async () => {
        try {
            setError('');
            const supabase = await createSPASassClient();
            const { data, error } = await supabase.getFiles(user!.id);

            if (error) throw error;
            setFiles(data || []);
        } catch (err) {
            setError('Failed to load files');
            console.error('Error loading files:', err);
        }
    }, [user]);

    const handleFileUpload = useCallback(async (file: File) => {
        try {
            setUploading(true);
            setError('');

            console.log(user)

            const supabase = await createSPASassClient();
            const { error } = await supabase.uploadFile(user!.id!, file.name, file);

            if (error) throw error;

            await loadFiles();
            setSuccess('File uploaded successfully');
        } catch (err) {
            setError('Failed to upload file');
            console.error('Error uploading file:', err);
        } finally {
            setUploading(false);
        }
    }, [user, loadFiles]);

    useEffect(() => {
        if (user?.id) {
            loadFiles();
        }
    }, [user, loadFiles]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;
        handleFileUpload(fileList[0]);
        event.target.value = '';
    };


    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, [handleFileUpload]);


    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);


    const handleDownload = async (filename: string) => {
        try {
            setError('');
            const supabase = await createSPASassClient();
            const { data, error } = await supabase.shareFile(user!.id!, filename, 60, true);

            if (error) throw error;

            window.open(data.signedUrl, '_blank');
        } catch (err) {
            setError('Failed to download file');
            console.error('Error downloading file:', err);
        }
    };

    const handleShare = async (filename: string) => {
        try {
            setError('');
            const supabase = await createSPASassClient();
            const { data, error } = await supabase.shareFile(user!.id!, filename, 24 * 60 * 60);

            if (error) throw error;

            setShareUrl(data.signedUrl);
            setSelectedFile(filename);
        } catch (err) {
            setError('Failed to generate share link');
            console.error('Error sharing file:', err);
        }
    };

    const handleDelete = async () => {
        if (!fileToDelete) return;

        try {
            setError('');
            const supabase = await createSPASassClient();
            const { error } = await supabase.deleteFile(user!.id!, fileToDelete);

            if (error) throw error;

            await loadFiles();
            setSuccess('File deleted successfully');
        } catch (err) {
            setError('Failed to delete file');
            console.error('Error deleting file:', err);
        } finally {
            setShowDeleteDialog(false);
            setFileToDelete(null);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setError('Failed to copy to clipboard');
        }
    };


    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Learning Materials</CardTitle>
                    <CardDescription>Download materials from completed lessons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-4">
                            <CheckCircle className="h-4 w-4"/>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex items-center justify-center w-full">
                        <label
                            className={`w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border-2 cursor-pointer transition-colors ${
                                isDragging
                                    ? 'border-primary-500 border-dashed bg-primary-50'
                                    : 'border-primary-600 hover:bg-primary-50'
                            }`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className="w-8 h-8"/>
                            <span className="mt-2 text-base">
                                {uploading
                                    ? 'Uploading...'
                                    : isDragging
                                        ? 'Drop your file here'
                                        : 'Drag and drop or click to select a file (max 50mb)'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleInputChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <div className="space-y-6">
                        {/* Show error from artifacts loading */}
                        {artifactsError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertDescription>{artifactsError}</AlertDescription>
                            </Alert>
                        )}

                        {/* Loading state */}
                        {artifactsLoading && (
                            <div className="flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin"/>
                                <span className="ml-2">Loading learning materials...</span>
                            </div>
                        )}

                        {/* Display artifacts grouped by level */}
                        {!artifactsLoading && artifactsData && (
                            <>
                                {artifactsData.artifacts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3"/>
                                        <p className="text-gray-500">Complete lessons to unlock materials</p>
                                    </div>
                                ) : (
                                    artifactsData.artifacts.map((levelArtifacts) => (
                                        <div key={levelArtifacts.level_id} className="space-y-3">
                                            {/* Level header */}
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Level {levelArtifacts.level_id}
                                                </span>
                                                <h3 className="font-medium text-gray-900">
                                                    {levelArtifacts.level_title}
                                                </h3>
                                            </div>
                                            
                                            {/* Level artifact */}
                                            {levelArtifacts.artifact && (
                                                <div
                                                    key={levelArtifacts.artifact.id}
                                                    className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <FileIcon className="h-6 w-6 text-gray-400"/>
                                                        <div>
                                                            <span className="font-medium">{levelArtifacts.artifact.file_name}</span>
                                                            <p className="text-sm text-gray-500">
                                                                Unlocked on {new Date(levelArtifacts.artifact.unlocked_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleDownload(levelArtifacts.artifact!.file_path)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                            title="Download"
                                                        >
                                                            <Download className="h-5 w-5"/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(levelArtifacts.artifact!.file_path)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                            title="Share"
                                                        >
                                                            <Share2 className="h-5 w-5"/>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setFileToDelete(levelArtifacts.artifact!.file_path);
                                                                setShowDeleteDialog(true);
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-5 w-5"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </>
                        )}

                        {/* Legacy files section (for admin uploads) */}
                        {files.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Admin Files
                                    </span>
                                    <h3 className="font-medium text-gray-900">
                                        Other Materials
                                    </h3>
                                </div>
                                {files.map((file) => (
                                    <div
                                        key={file.name}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FileIcon className="h-6 w-6 text-gray-400"/>
                                            <span className="font-medium">{file.name.split('/').pop()}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleDownload(file.name)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Download"
                                            >
                                                <Download className="h-5 w-5"/>
                                            </button>
                                            <button
                                                onClick={() => handleShare(file.name)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                title="Share"
                                            >
                                                <Share2 className="h-5 w-5"/>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFileToDelete(file.name);
                                                    setShowDeleteDialog(true);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-5 w-5"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Share Dialog */}
                    <Suspense fallback={<div className="h-32 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>}>
                        <Dialog open={Boolean(shareUrl)} onOpenChange={() => {
                            setShareUrl('');
                            setSelectedFile(null);
                        }}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Share {selectedFile?.split('/').pop()}</DialogTitle>
                                    <DialogDescription>
                                        Copy the link below to share your file. This link will expire in 24 hours.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 p-2 border rounded bg-gray-50"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(shareUrl)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors relative"
                                    >
                                        <Copy className="h-5 w-5"/>
                                        {showCopiedMessage && (
                                            <span
                                                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Suspense>

                    {/* Delete Confirmation Dialog */}
                    <Suspense fallback={<div className="h-32 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>}>
                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete File</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this file? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}