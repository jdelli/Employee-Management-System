import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import apiService from "./services/ApiServices";

const AttendanceList = ({ auth }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Fetch the list of employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiService.get("/employees");
                setEmployees(Array.isArray(response.data.employees) ? response.data.employees : []);
            } catch (err) {
                setError("Failed to fetch employee list.");
                setEmployees([]);
            }
        };

        fetchEmployees();
    }, []);

    // Fetch attendance data for the selected employee, month, and year
    const fetchAttendance = async (employeeName, month, year) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.get(`/employee-attendance/${employeeName}`, {
                params: { month, year },
            });
            setAttendance(Array.isArray(response.data.attendance) ? response.data.attendance : []);
        } catch (err) {
            setError("Failed to fetch attendance data.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeSelect = (employeeName) => {
        setSelectedEmployee(employeeName);
        fetchAttendance(employeeName, selectedMonth, selectedYear);
    };

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        if (selectedEmployee) {
            fetchAttendance(selectedEmployee, month, selectedYear);
        }
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        if (selectedEmployee) {
            fetchAttendance(selectedEmployee, selectedMonth, year);
        }
    };

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
    };

    const formatDateTime = (date) => {
        return date ? new Date(date).toLocaleString() : "N/A";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Employee Attendance List
                </h2>
            }
        >
            <Head title="Employee Attendance List" />

            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-700">
                            Select Employee:
                        </label>
                        <select
                            id="employeeSelect"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => handleEmployeeSelect(e.target.value)}
                            value={selectedEmployee || ""}
                        >
                            <option value="">-- Select an Employee --</option>
                            {employees.map((employee) => (
                                <option key={employee.name} value={employee.name}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700">
                            Select Month:
                        </label>
                        <select
                            id="monthSelect"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => handleMonthSelect(e.target.value)}
                            value={selectedMonth || ""}
                        >
                            <option value="">-- All Month --</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700">
                            Select Year:
                        </label>
                        <select
                            id="yearSelect"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => handleYearSelect(e.target.value)}
                            value={selectedYear}
                        >
                            {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-blue-500">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : attendance.length === 0 ? (
                    selectedEmployee && <div className="text-center text-gray-500">No attendance records found.</div>
                ) : (
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="py-3 px-4 text-sm font-medium text-gray-700">Clock In</th>
                                <th className="py-3 px-4 text-sm font-medium text-gray-700">Clock Out</th>
                                <th className="py-3 px-4 text-sm font-medium text-gray-700">Clock In Image</th>
                                <th className="py-3 px-4 text-sm font-medium text-gray-700">Clock Out Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((record) => (
                                <tr key={record.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        {formatDateTime(record.clock_in)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        {record.clock_out ? formatDateTime(record.clock_out) : "Not clocked out"}
                                    </td>
                                    <td className="py-3 px-4">
                                        {record.clock_in_image && (
                                            <img
                                                src={`/storage/${record.clock_in_image}`}
                                                alt="Clock In"
                                                className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                                onClick={() => handleImageClick(`/storage/${record.clock_in_image}`)}
                                            />
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {record.clock_out_image && (
                                            <img
                                                src={`/storage/${record.clock_out_image}`}
                                                alt="Clock Out"
                                                className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                                onClick={() => handleImageClick(`/storage/${record.clock_out_image}`)}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedImage && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="relative">
                            <button
                                className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 rounded-full p-2"
                                onClick={closeImageViewer}
                            >
                                &times;
                            </button>
                            <img src={selectedImage} alt="Zoomed" className="max-w-full max-h-screen" />
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default AttendanceList;