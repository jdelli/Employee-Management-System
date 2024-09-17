import React, { useEffect, useState } from 'react';
import apiService from '../services/ApiServices';

const PayrollTableComplete = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());   
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
        const response = await apiService.get(`completed-payrolls?page=${currentPage}&month=${selectedMonth}&year=${selectedYear}&department=${selectedDepartment}`);
        setPayrolls(response.data.payrolls);
        setTotalPages(response.data.last_page);
      } catch (error) {
        console.error('Error fetching payrolls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, [currentPage, selectedMonth, selectedYear, selectedDepartment]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrint = (payrollId) => {
    const printContent = document.getElementById(`receipt-${payrollId}`);
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); 
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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

      {/* Month and Year Filters */}
      <div className="filter-controls flex justify-between mb-4">
        <select value={selectedMonth} onChange={handleMonthChange} className="px-4 py-2 border rounded">
          {[...Array(12).keys()].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={selectedYear}
          onChange={handleYearChange}
          className="px-4 py-2 border rounded"
          placeholder="Year"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Employee ID</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Name</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Position</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Department</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Salary</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Deductions</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Days Worked</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Total Salary</th>
            <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((payroll) => (
            <React.Fragment key={payroll.id}>
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-6 text-center text-sm text-gray-700">{payroll.employee_id}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">{payroll.name}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">{payroll.position}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">{payroll.department}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">{formatCurrency(payroll.salary)}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">{formatCurrency(payroll.deductions)}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">{payroll.days_worked}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">{formatCurrency(payroll.total_salary)}</td>
                <td className="py-3 px-6 text-center text-sm text-gray-700">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    onClick={() => handlePrint(payroll.id)}
                  >
                    Print
                  </button>
                </td>
              </tr>

              {/* Hidden content for printing */}
              <div id={`receipt-${payroll.id}`} style={{ display: 'none' }}>
                <div style={{ padding: '20px', maxWidth: '300px', margin: '0 auto', border: '1px solid #ddd' }}>
                  <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Payroll Receipt</h2>
                  <p><strong>Employee ID:</strong> {payroll.employee_id}</p>
                  <p><strong>Name:</strong> {payroll.name}</p>
                  <p><strong>Position:</strong> {payroll.position}</p>
                  <hr />
                  <p><strong>Salary:</strong> {formatCurrency(payroll.salary)}</p>
                  <p><strong>Deductions:</strong> {formatCurrency(payroll.deductions)}</p>
                  <p><strong>Days Worked:</strong> {payroll.days_worked}</p>
                  <hr />
                  <p><strong>Total Salary:</strong> {formatCurrency(payroll.total_salary)}</p>
                  <hr />
                  <p style={{ textAlign: 'center', marginTop: '20px' }}>Sahod NAA!</p>
                </div>
              </div>
            </React.Fragment>
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

export default PayrollTableComplete;
