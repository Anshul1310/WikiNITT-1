"use client"
import React, { useEffect, useState } from 'react';
import AddDocumentForm from './components/AddDocumentForm';
import EditDocumentModal from './components/EditDocumentModal';
import { Button } from '@/components/ui/button';

interface AdminDocument {
    id: string;
    source_url: string;
    title: string;
    type: string;
    content: string;
}

export default function RagAdminPage() {
    const [documents, setDocuments] = useState<AdminDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [crawlStatus, setCrawlStatus] = useState<string | null>(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 20;

    // Edit State
    const [editingDoc, setEditingDoc] = useState<AdminDocument | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchDocuments = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/admin/documents?page=${pageNum}&limit=${LIMIT}`);
            if (!res.ok) throw new Error('Failed to fetch documents');
            const data = await res.json();
            setDocuments(data.items);
            setTotalPages(data.pages);
            setPage(data.page);
        } catch (err) {
            console.error(err);
            alert('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments(page);
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            const res = await fetch(`http://localhost:8000/admin/documents/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');
            fetchDocuments(page);
        } catch (err) {
            alert('Error deleting document: ' + err);
        }
    };

    const handleEdit = (doc: AdminDocument) => {
        setEditingDoc(doc);
        setIsEditOpen(true);
    };

    const handleCrawl = async () => {
        if (!confirm('Start a new crawl? This might take a while.')) return;
        setCrawlStatus('Crawling started...');
        try {
            const res = await fetch('http://localhost:8000/admin/crawl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pages: 20 })
            });
            if (!res.ok) throw new Error('Failed to trigger crawl');
            const data = await res.json();
            setCrawlStatus(`Success: ${data.message}`);
        } catch (err) {
            setCrawlStatus('Error triggering crawl');
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">RAG Index Manager</h1>
                    <p className="text-gray-500">Manage knowledge base for WikiNITT</p>
                </div>
                <div className="flex gap-4 items-center">
                    {crawlStatus && <span className="text-sm text-blue-600">{crawlStatus}</span>}
                    <Button onClick={handleCrawl} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Trigger Crawl
                    </Button>
                </div>
            </div>

            <AddDocumentForm onAdd={() => fetchDocuments(page)} />

            <EditDocumentModal
                document={editingDoc}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onUpdate={() => fetchDocuments(page)}
            />

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Source URL</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">Loading documents...</td>
                                </tr>
                            ) : documents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">No documents found.</td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={doc.title}>
                                            {doc.title || 'Untitled'}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            <a href={doc.source_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                {doc.source_url}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.type === 'manual' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEdit(doc)}
                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                        Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            variant="outline"
                            className="h-8 px-3"
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            variant="outline"
                            className="h-8 px-3"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
