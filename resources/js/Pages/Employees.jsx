import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EmployeeModalAdd from "./AddEmployee";
import EmployeeModalEdit from "./EditEmployee";
import apiService from './services/ApiServices'; // Ensure correct import
import EmployeePayroll from "./EmployeePayroll";
import EmployeeProfileModal from "./EmployeeProfile/EmployeeProfile";

const Employees = ({ auth }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEmployeeProfileModalOpen, setIsEmployeeProfileModalOpen] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [payroll, setPayroll] = useState(null);
    const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);

    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    useEffect(() => {
        fetchData(currentPage, sortBy, sortDirection, selectedDepartment);
    }, [currentPage, sortBy, sortDirection, selectedDepartment]);

    const fetchData = async (page = 1, sortBy = 'name', sortDirection = 'asc', department = 'all') => {
        try {
            const response = await apiService.get(`all?page=${page}&limit=${itemsPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&department=${department}`);
            setEmployeeData(response.data.employees);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        setCurrentPage(1); 
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const handleProfileClick = (employee) => {
        setEditingEmployee(employee);
        setIsEmployeeProfileModalOpen(true);
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (employeeId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
            try {
                await apiService.delete(`delete/${employeeId}`);
                fetchData(currentPage, sortBy, sortDirection, selectedDepartment);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handlePayrollClick = (employee) => {
        setPayroll(employee);
        setIsPayrollModalOpen(true);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Employee Management System
                </h2>
            }
        >
            <Head title="Employee" />

            <div className="container mx-auto px-4 py-6">
                {/* Add Employee Button */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    Add Employee
                </button>

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

                {/* Employee Table */}
                <table className="min-w-full bg-white border border-gray-200 shadow-lg">
                    <thead className="bg-gray-200">
                        <tr>
                        <th
                            onClick={() => handleSortChange('employee_id')}
                            className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Employee ID {sortBy === 'employee_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            onClick={() => handleSortChange('name')}
                            className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            onClick={() => handleSortChange('position')}
                            className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Position {sortBy === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            onClick={() => handleSortChange('department')}
                            className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Department {sortBy === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            onClick={() => handleSortChange('hire_date')}
                            className="py-3 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Hire Date {sortBy === 'hire_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeData.length > 0 ? (
                        employeeData.map((employee) => (
                            <tr key={employee.id} className="border-b hover:bg-gray-100">
                            <td className="py-3 px-6 text-sm text-gray-700">{employee.employee_id}</td>
                            <td className="py-3 px-6 text-sm text-gray-700">{employee.name}</td>
                            <td className="py-3 px-6 text-sm text-gray-700">{employee.position}</td>
                            <td className="py-3 px-6 text-sm text-gray-700">{employee.department}</td>
                            <td className="py-3 px-6 text-sm text-gray-700">{employee.hire_date}</td>
                            <td className="py-3 px-6 text-sm text-gray-700 space-x-2">
                                <button
                                onClick={() => handleProfileClick(employee)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                Profile
                                </button>
                                <button
                                onClick={() => handleEdit(employee)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                Edit
                                </button>
                                <button
                                onClick={() => handleDelete(employee.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                Delete
                                </button>
                                <button
                                onClick={() => handlePayrollClick(employee)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                Payroll
                                </button>
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="6" className="py-4 px-6 text-center text-sm text-gray-700">
                            No employees found.
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>


                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Next
                    </button>
                </div>

                {/* Add Employee Modal */}
                <EmployeeModalAdd
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    refreshEmployees={() => fetchData(currentPage, sortBy, sortDirection, selectedDepartment)}
                />

                {/* Edit Employee Modal */}
                <EmployeeModalEdit
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    refreshEmployees={() => fetchData(currentPage, sortBy, sortDirection, selectedDepartment)}
                    editingEmployee={editingEmployee}
                />

                {/* Employee Profile Modal */}
                <EmployeeProfileModal
                    isOpen={isEmployeeProfileModalOpen}
                    onClose={() => setIsEmployeeProfileModalOpen(false)}
                    employee={editingEmployee}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Payroll Modal */}
                <EmployeePayroll
                    isOpen={isPayrollModalOpen}
                    onClose={() => setIsPayrollModalOpen(false)}
                    payroll={payroll}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Employees;
