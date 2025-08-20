'use client';

import { type Document } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'nomiko_recent_documents';

export function useRecentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsedDocuments: Document[] = JSON.parse(item);
        const sortedDocuments = parsedDocuments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setDocuments(sortedDocuments);
      }
    } catch (error) {
      console.error("Failed to parse documents from localStorage", error);
      setDocuments([]);
    }
  }, []);

  const saveDocuments = useCallback((docs: Document[]) => {
    try {
      const sortedDocuments = docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDocuments(sortedDocuments);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedDocuments));
    } catch (error) {
      console.error("Failed to save documents to localStorage", error);
    }
  }, []);

  const addDocument = useCallback((content: string, fileName: string, dataUri: string, fileType: string) => {
    const name = fileName || content.trim().split(/\s+/).slice(0, 5).join(' ') + '...';
    const newDocument: Document = {
      id: uuidv4(),
      name,
      content,
      createdAt: new Date().toISOString(),
      dataUri,
      fileType,
    };
    const updatedDocuments = [newDocument, ...documents];
    saveDocuments(updatedDocuments);
    return newDocument;
  }, [documents, saveDocuments]);

  const getDocument = useCallback((id: string): Document | undefined => {
    return documents.find(doc => doc.id === id);
  }, [documents]);

  const deleteDocument = useCallback((id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    saveDocuments(updatedDocuments);
  }, [documents, saveDocuments]);

  return { documents, addDocument, getDocument, deleteDocument };
}
