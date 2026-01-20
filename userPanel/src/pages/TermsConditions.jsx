import React from 'react';
import LegalPageViewer from '../components/LegalPageViewer';

const TermsConditions = () => {
    return (
        <LegalPageViewer
            pageType="terms-conditions"
            defaultTitle="TERMS & CONDITIONS"
            defaultSubtitle="Legal Use | Participation | Ticket & Access Rules"
        />
    );
};

export default TermsConditions;
