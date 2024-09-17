import React, { useEffect, useState } from 'react';
import apiService from '../services/ApiServices';

const PayrollTable = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');



  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
  };

  
  useEffect(() => {
    const fetchPayrolls = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`uncompleted-payrolls?page=${currentPage}&department=${selectedDepartment}`);
        setPayrolls(response.data.payrolls); 
        setTotalPages(response.data.last_page);
      } catch (error) {
        console.error('Error fetching payrolls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, [currentPage, selectedDepartment]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDone = async (payrollId) => {
    try {
      await apiService.put(`done/${payrollId}`);

      const response = await apiService.get(`uncompleted-payrolls?page=${currentPage}`);
      setPayrolls(response.data.payrolls);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error marking payroll as done:', error);
    }
  };


  const handleDelete = async (payrollId) => {
    try {
      await apiService.delete(`/delete-payroll/${payrollId}`);
      
      const response = await apiService.get(`uncompleted-payrolls?page=${currentPage}`);
      setPayrolls(response.data.payrolls);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error deleting payroll:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {/* Department Dropdown */}
      <div className="mb-4">
        <label htmlFor="department" className="mr-2">Sort Department:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      <table className="min-w-full border-collapse block md:table shadow-lg">
        <thead className="block md:table-header-group bg-gray-200">
          <tr className="block md:table-row border border-gray-300">
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Employee ID</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Position</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Department</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Salary</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Deductions</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Days Worked</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Total Salary</th>
            <th className="block md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group bg-white">
          {payrolls.map((payroll) => (
            <tr key={payroll.id} className="border-b border-gray-200 block md:table-row hover:bg-gray-50">
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{payroll.employee_id}</td>
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{payroll.name}</td>
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{payroll.position}</td>
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{payroll.department}</td>
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{formatCurrency(payroll.salary)}</td>
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{formatCurrency(payroll.deductions)}</td>
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{payroll.days_worked}</td>
              <td className="block md:table-cell px-6 py-4 text-gray-700 text-sm">{formatCurrency(payroll.total_salary)}</td>
              <td className="block md:table-cell px-6 py-4 space-x-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                  onClick={() => handleDone(payroll.id)}
                >
                  Done
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                  onClick={() => handleDelete(payroll.id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Pagination Controls */}
      <div className="pagination-controls flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={i + 1 === currentPage}
            className={`px-4 py-2 mx-1 ${i + 1 === currentPage ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PayrollTable;
