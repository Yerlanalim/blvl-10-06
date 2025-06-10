'use client';

import React from 'react';
import LegalDocument from '@/components/LegalDocument';
import { notFound } from 'next/navigation';

const legalDocuments = {
    'privacy-notice': {
        title: 'Privacy Notice',
        path: '/terms/privacy-notice.md'
    },
    'terms-of-service': {
        title: 'Terms of Service',
        path: '/terms/terms-of-service.md'
    },
    'refund-policy': {
        title: 'Refund Policy',
        path: '/terms/refund-policy.md'
    }
} as const;

type LegalDocument = keyof typeof legalDocuments;

interface LegalPageProps {
    document: LegalDocument;
    lng: string;
}

interface LegalPageParams {
    params: Promise<LegalPageProps>
}

export default function LegalPage({ params }: LegalPageParams) {
    const {document} = React.use<LegalPageProps>(params);

    if (!legalDocuments[document]) {
        notFound();
    }

    const { title, path } = legalDocuments[document];

    return (
        <div className="container mx-auto px-4 py-8">
            <LegalDocument
                title={title}
                filePath={path}
            />
        </div>
    );
}