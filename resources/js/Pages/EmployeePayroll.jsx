import React, { useState, useEffect } from "react";
import apiService from "./services/ApiServices";
import apiService2 from "./services/ApiServices2";


const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const EmployeePayroll = ({ isOpen, onClose, payroll }) => {
    const [employeeId, setEmployeeId] = useState("");
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [salary, setSalary] = useState(0);
    const [deductions, setDeductions] = useState(0);
    const [daysWorked, setDaysWorked] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [payrolls, setPayrolls] = useState([]);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        Promise.all([
            apiService.get('all'), 
            apiService.get('uncompleted-payrolls')
        ]).then(([employeesResponse, payrollsResponse]) => {
            setEmployees(employeesResponse.data.employees);
            setPayrolls(payrollsResponse.data.payrolls);
        }).catch(error => console.error("Error fetching data:", error));
    }, []);

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        try {
            const { hasIncompletePayroll } = await apiService2.checkIncompletePayroll(employeeId);

            if (hasIncompletePayroll) {
                setError('Employee already has an incomplete payroll entry.');
                return;
            }

            
            await apiService.post("payroll", {
                employee_id: employeeId,
                name,
                position,
                department,
                salary,
                deductions,
                days_worked: daysWorked,
                total_salary: totalSalary,
            });

            
            onClose();
        } catch (error) {
            setError('Error adding payroll.');
        }
    };


    const handleCancel = () => {
        onClose();
        setError("");
    };

    // Update state with payroll data if it's passed
    useEffect(() => {
        if (payroll) {
            setEmployeeId(payroll.employee_id);
            setName(payroll.name);
            setPosition(payroll.position);
            setDepartment(payroll.department);
            setSalary(Number(payroll.salary));
            setDeductions(Number(payroll.deductions));
            setDaysWorked(payroll.days_worked || 0);
        }
    }, [payroll]);

    
    useEffect(() => {
        const total = salary * daysWorked - deductions;
        setTotalSalary(total);
    }, [salary, deductions, daysWorked]);

    if (!isOpen) return null;

    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">
                    Add Employee Payroll
                </h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Employee ID</label>
                            <input
                                type="text"
                                name="employee_id"
                                value={employeeId}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={position}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Department</label>
                            <input
                                type="text"
                                name="position"
                                value={department}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Salary</label>
                            <input
                                type="number"
                                name="salary"
                                value={salary}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Deductions</label>
                            <input
                                type="number"
                                name="deductions"
                                value={deductions}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Days Worked</label>
                            <input
                                type="number"
                                name="days_worked"
                                value={daysWorked}
                                onChange={(e) => setDaysWorked(Number(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Total Salary</label>
                            <input
                                type="text"
                                name="total_salary"
                                value={formatCurrency(totalSalary)}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Generate Payroll
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeePayroll;
