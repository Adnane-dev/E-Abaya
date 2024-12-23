// app/sizing/page.tsx
import React from "react";

const SizingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Sizing Guide</h1>
      <p className="mt-4 text-gray-600">
        Find the perfect fit for our products with our sizing guide.
      </p>
      <div className="mt-8">
        <h2 className="text-xl font-medium text-gray-800">How to Measure</h2>
        <p className="mt-2 text-gray-600">
          Here s how to take your measurements for the best fit.
        </p>
        <ul className="list-disc pl-6 mt-4 text-gray-600">
          <li>Measure around the fullest part of your chest</li>
          <li>Measure your waist at the smallest part</li>
          <li>Measure your hips at the fullest part</li>
        </ul>
        {/* Add sizing charts, tables, or images if needed */}
      </div>
    </div>
  );
};

export default SizingPage;
