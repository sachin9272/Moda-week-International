import React from 'react';
import LegalPageViewer from '../components/LegalPageViewer';

const DataProtection = () => {
    return (
        <LegalPageViewer
            pageType="data-protection"
            defaultTitle="DATA PROTECTION (GDPR COMPLIANCE)"
            defaultSubtitle="Privacy, Lawful Processing & International Standards"
        />
    );
};

export default DataProtection;
