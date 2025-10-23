import React from 'react';
import UnifiedForm from '../screens/UnifiedForm';

const NominationFormDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background-color)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--tertiary-color)] mb-2">
            Nomination Form with PDF Upload
          </h1>
          <p className="text-gray-600">
            Test the integrated PDF upload functionality in the nomination form
          </p>
        </div>
        
        <UnifiedForm formType="applyForNomination" />
      </div>
    </div>
  );
};

export default NominationFormDemo;
