import React from 'react';

const EmployeeCard = ({ numberOfEmployees, totalPayrolls }) => (
  <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
    <div className="flex flex-col space-y-4">
      {/* Total Employees Section */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold text-gray-800">Total Employees:</h2>
        <span className="text-lg font-bold text-blue-600">{numberOfEmployees}</span>
      </div>

      {/* Total Payrolls Section */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold text-gray-800">Total Pending Payrolls:</h2>
        <span className="text-lg font-bold text-green-600">{totalPayrolls}</span>
      </div>
    </div>
  </div>
);

export default EmployeeCard;
