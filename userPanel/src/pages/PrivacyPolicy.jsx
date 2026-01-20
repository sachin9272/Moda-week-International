import React from 'react';
import LegalPageViewer from '../components/LegalPageViewer';

const PrivacyPolicy = () => {
    return (
        <LegalPageViewer
            pageType="privacy-policy"
            defaultTitle="PRIVACY & POLICY"
            defaultSubtitle="Data Protection, Privacy, Media & Confidentiality Policy"
        />
    );
};

export default PrivacyPolicy;
