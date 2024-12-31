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
    const [employeeName, setEmployeeName] = useState("");
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [basicPay, setBasicPay] = useState(0);
    const [overtime, setOvertime] = useState(0);
    const [deductions, setDeductions] = useState({
        sss: 0,
        pagIbig: 0,
        philHealth: 0,
    });
    const [daysWorked, setDaysWorked] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [payrollFromDate, setPayrollFromDate] = useState("");
    const [payrollToDate, setPayrollToDate] = useState("");

    useEffect(() => {
        Promise.all([
            apiService.get("all"),
            apiService.get("uncompleted-payrolls"),
        ])
            .then(([employeesResponse, payrollsResponse]) => {
                setEmployees(employeesResponse.data.employees);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        if (payroll) {
            setEmployeeName(payroll.name);
            setName(payroll.name);
            setPosition(payroll.position);
            setDepartment(payroll.department);
            setBasicPay(Number(payroll.salary) || 0);
            setOvertime(Number(payroll.overtime) || 0);
            setDeductions({
                sss: payroll.sss ? Number(payroll.sss) : 0,
                pagIbig: payroll.pag_ibig ? Number(payroll.pag_ibig) : 0,
                philHealth: payroll.phil_health ? Number(payroll.phil_health) : 0,
            });
            setDaysWorked(payroll.days_worked || 0);
            setPayrollFromDate(payroll.payroll_from_date || ""); // Set from date
            setPayrollToDate(payroll.payroll_to_date || ""); // Set to date
        }
    }, [payroll]);

    useEffect(() => {
        const validBasicPay = isNaN(basicPay) ? 0 : basicPay;
        const validOvertime = isNaN(overtime) ? 0 : overtime;
        const validDeductions = Object.values(deductions).reduce((acc, deduction) => {
            return acc + (isNaN(deduction) ? 0 : deduction);
        }, 0);
        const validDaysWorked = isNaN(daysWorked) ? 0 : daysWorked;
        const totalEarnings = validBasicPay * validDaysWorked + validOvertime;
        const computedTotalSalary = totalEarnings - validDeductions;
        setTotalSalary(isNaN(computedTotalSalary) ? 0 : computedTotalSalary);
    }, [basicPay, overtime, deductions, daysWorked]);

    useEffect(() => {
        if (employeeName && payrollFromDate && payrollToDate) {
            apiService.get(`/employee/days-worked`, {
                params: {
                    employee_name: employeeName,
                    from: payrollFromDate,
                    to: payrollToDate,
                },
            })
                .then((response) => {
                    setDaysWorked(response.data.days_worked);
                })
                .catch((error) => {
                    console.error("Error fetching days worked:", error);
                });
        }
    }, [employeeName, payrollFromDate, payrollToDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { hasIncompletePayroll } = await apiService2.checkIncompletePayroll(employeeName);

            if (hasIncompletePayroll) {
                setError("Employee already has an incomplete payroll entry.");
                return;
            }

            await apiService.post("payroll", {
                employee_id: employeeName,
                employee_name: employeeName, // Ensure this field is included
                name,
                position,
                department,
                salary: basicPay,
                overtime,
                gross_salary: basicPay * daysWorked + overtime,
                sss: deductions.sss,
                pag_ibig: deductions.pagIbig,
                phil_health: deductions.philHealth,
                deductions: Object.values(deductions).reduce((a, b) => a + b, 0),
                days_worked: daysWorked,
                total_salary: totalSalary,
                payroll_from_date: payrollFromDate,
                payroll_to_date: payrollToDate,
            });
            onClose();
        } catch (error) {
            setError("Error adding payroll.");
        }
    };

    const handleCancel = () => {
        onClose();
        setError("");
        setOvertime(0);
        setDaysWorked(0);
        setTotalSalary(0);
        setPayrollFromDate("");
        setPayrollToDate("");
        
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Add Employee Payroll</h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div>
                            <label className="block text-gray-700">Employee Name</label>
                            <input
                                type="text"
                                value={employeeName}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Position</label>
                            <input
                                type="text"
                                value={position}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Department</label>
                            <input
                                type="text"
                                value={department}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="col-span-2">
                        <hr className="border-t border-gray-600 my-6" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Payroll From Date</label>
                            <input
                                type="date"
                                value={payrollFromDate}
                                onChange={(e) => setPayrollFromDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Payroll To Date</label>
                            <input
                                type="date"
                                value={payrollToDate}
                                onChange={(e) => setPayrollToDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 className="text-lg font-bold mb-2">Total Earnings</h4>
                            <label className="block text-gray-700">Basic Pay</label>
                            <input
                                type="number"
                                value={basicPay}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                            <label className="block text-gray-700 mt-2">Days Worked</label>
                            <input
                                type="number"
                                value={daysWorked || ''}
                                readOnly
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setDaysWorked(value === '' ? '' : Number(value));
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />

                            <label className="block text-gray-700 mt-2">Overtime</label>
                            <input
                                type="number"
                                value={overtime}
                                onChange={(e) => setOvertime(Number(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">Total Deductions</h4>
                            <label className="block text-gray-700">SSS Contribution</label>
                            <input
                                type="number"
                                value={deductions.sss}
                                onChange={(e) =>
                                    setDeductions((prev) => ({ ...prev, sss: Number(e.target.value) }))
                                }
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                            <label className="block text-gray-700 mt-2">Pag-IBIG Contribution</label>
                            <input
                                type="number"
                                value={deductions.pagIbig}
                                onChange={(e) =>
                                    setDeductions((prev) => ({ ...prev, pagIbig: Number(e.target.value) }))
                                }
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                            <label className="block text-gray-700 mt-2">PhilHealth Contribution</label>
                            <input
                                type="number"
                                value={deductions.philHealth}
                                onChange={(e) =>
                                    setDeductions((prev) => ({ ...prev, philHealth: Number(e.target.value) }))
                                }
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">Total Salary</label>
                        <input
                            type="text"
                            value={formatCurrency(totalSalary)}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeePayroll;