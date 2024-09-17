import React from 'react';

const EmployeeProfileModal = ({ employee, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  const photoUrl = employee.photo ? `/storage/${employee.photo}` : '/images/default.png';

  const handleDelete = () => {
    onDelete(employee.id);
    onClose();
  };

  const handleEdit = () => {
    onEdit(employee);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8 relative overflow-hidden">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start">
          
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <img
              className="w-36 h-36 object-cover rounded-lg shadow-lg border-4 border-indigo-600"
              src={photoUrl}
              alt="Profile"
            />
          </div>

           
          <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-6">
            <h2 className="text-3xl font-bold text-gray-800">{employee.name || 'No Name Provided'}</h2>
            <p className="text-lg text-indigo-600 font-medium">{employee.position || 'No Position Provided'}</p>
            <p className="text-sm text-gray-500 mb-4">{employee.email || 'No Email Provided'}</p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Employee ID:</span>
                <span className="text-gray-600">{employee.employee_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Department:</span>
                <span className="text-gray-600">{employee.department || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="text-gray-600">{employee.address || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Salary:</span>
                <span className="text-gray-600">₱{employee.salary || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Deductions:</span>
                <span className="text-gray-600">₱{employee.deductions || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Hire Date:</span>
                <span className="text-gray-600">
                  {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

       
        <div className="mt-8 flex justify-center space-x-6">
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;
