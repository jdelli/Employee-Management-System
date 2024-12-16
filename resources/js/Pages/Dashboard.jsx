import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmployeeCard from './EmployeeCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import apiService from './services/ApiServices';

const Dashboard = ({ auth }) => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPayrolls, setTotalPayrolls] = useState(0);
  const [totalITEmployees, setTotalITEmployees] = useState(0);
  const [totalHREmployees, setTotalHREmployees] = useState(0);
  const [totalFinanceEmployees, setTotalFinanceEmployees] = useState(0);
  const [totalMarketingDepartment, setTotalMarketingDepartment] = useState(0);

  useEffect(() => {
    const fetchEmployeeCounts = async () => {
      try {
        const [employees, payroll, it, hr, finance, marketing] = await Promise.all([
          apiService.get('count'),
          apiService.get('/count-pending-payroll'),
          apiService.get('countIT'),
          apiService.get('countHR'),
          apiService.get('countFinance'),
          apiService.get('countMarketing')
        ]);
        setTotalEmployees(employees.data.total);
        setTotalPayrolls(payroll.data.payrollCount);
        setTotalITEmployees(it.data.totalIt);
        setTotalHREmployees(hr.data.totalHR);
        setTotalFinanceEmployees(finance.data.totalFinance);
        setTotalMarketingDepartment(marketing.data.totalMarketing);
      } catch (error) {
        console.error('Error fetching employee counts:', error);
      }
    };

    fetchEmployeeCounts();
  }, []);

  const data = [
    { department: 'IT', employees: totalITEmployees },
    { department: 'HR', employees: totalHREmployees },
    { department: 'Finance', employees: totalFinanceEmployees },
    { department: 'Marketing', employees: totalMarketingDepartment }
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">Admin Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EmployeeCard numberOfEmployees={totalEmployees} totalPayrolls={totalPayrolls} />
          </div>

          {/* Employee Growth Chart Section */}
          <div className="mt-8 bg-white p-6 shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employee Growth</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="employees" fill="#4a90e2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
