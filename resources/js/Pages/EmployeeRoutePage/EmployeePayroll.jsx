import React, { useEffect, useState } from 'react';
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import apiService from "../services/ApiServices";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(amount);

const EmployeeTable = ({ auth }) => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayrolls = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/users-get-payroll', {
          params: { user_name: auth.user.name },
        });
        setPayrolls(response.data.payrolls);
      } catch (err) {
        setError('Failed to fetch payroll data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, [auth.user.name]);

  const handlePrint = (payroll) => {
    const printContent = document.getElementById(`receipt-${payroll.id}`);
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); 
  };

  return (
    <EmployeeLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Payroll
        </h2>
      }
    >
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Basic Pay</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Days Worked</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Deductions</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Salary</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-sm text-gray-600 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-sm text-gray-600 text-center">
                      {error}
                    </td>
                  </tr>
                ) : payrolls.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-sm text-gray-600 text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  payrolls.map((payroll) => (
                    <React.Fragment key={payroll.id}>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{payroll.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(payroll.salary)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{payroll.days_worked}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(payroll.deductions)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(payroll.total_salary)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(payroll.created_at).toLocaleDateString()}
                        </td>
                        
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={() => handlePrint(payroll)}
                          >
                            Print
                          </button>
                        </td>
                      </tr>


                    {/* Print receipt modal */} 
                      <div id={`receipt-${payroll.id}`} style={{ display: 'none' }}>
                        <div style={{ padding: '20px', maxWidth: '300px', margin: '0 auto', border: '1px solid #ddd' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Payroll Receipt</h2>
                        <p><strong>Employee ID:</strong> {payroll.employee_id}</p>
                        <p><strong>Name:</strong> {payroll.name}</p>
                        <p><strong>Position:</strong> {payroll.position}</p>
                        <hr />
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                            <tr>
                                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '5px' }}>Category</th>
                                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'right', padding: '5px' }}>Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td style={{ padding: '5px' }}>Base Salary</td>
                                <td style={{ padding: '5px', textAlign: 'right' }}>{formatCurrency(payroll.salary)}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px' }}>Days Worked</td>
                                <td style={{ padding: '5px', textAlign: 'right' }}>{payroll.days_worked}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px' }}>Overtime Pay</td>
                                <td style={{ padding: '5px', textAlign: 'right' }}>{payroll.overtime}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px', fontWeight: 'bold' }}>Gross Pay</td>
                                <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>
                                {formatCurrency(payroll.gross_salary)}
                                </td>
                            </tr>
                            {/* Line Separator */}
                            <tr>
                                <td colSpan="2">
                                <hr />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px' }}>SSS</td>
                                <td style={{ padding: '5px', textAlign: 'right' }}>{formatCurrency(payroll.sss)}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px' }}>Pag-IBIG</td>
                                <td style={{ padding: '5px', textAlign: 'right' }}>{formatCurrency(payroll.pag_ibig)}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px' }}>PhilHealth</td>
                                <td style={{ padding: '5px', textAlign: 'right' }}>{formatCurrency(payroll.phil_health)}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px', fontWeight: 'bold' }}>Total Deductions</td>
                                <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>
                                {formatCurrency(payroll.deductions)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <hr />
                        <p style={{ fontWeight: 'bold', textAlign: 'right' }}>
                            Net Pay: {formatCurrency(payroll.total_salary)}
                        </p>
                        </div>

                      </div>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTable;
