'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddDocumentForm({ onAdd }: { onAdd: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/admin/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: crypto.randomUUID(),
                    title,
                    source_url: sourceUrl,
                    content,
                    type: 'manual'
                })
            });

            if (!res.ok) throw new Error('Failed to add document');

            setTitle('');
            setSourceUrl('');
            setContent('');
            setIsOpen(false);
            onAdd(); // Refresh list
        } catch (err) {
            alert('Error adding document: ' + err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="mb-4">
                + Add New Document
            </Button>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Document</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Hostel Regulations 2024"
                    />
                </div>

                <div>
                    <Label htmlFor="url">Source URL</Label>
                    <Input
                        id="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        placeholder="https://nitt.edu/..."
                    />
                </div>

                <div>
                    <Label htmlFor="content">Content</Label>
                    <textarea
                        id="content"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Paste the document content here..."
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Save Document'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
