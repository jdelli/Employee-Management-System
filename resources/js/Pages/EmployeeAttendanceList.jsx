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

    // Fetch the list of employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiService.get("/employees");
                console.log("API response:", response.data); // Inspect the response structure
                setEmployees(Array.isArray(response.data.employees) ? response.data.employees : []);
            } catch (err) {
                console.error("Error fetching employees:", err.response?.data || err.message);
                setError("Failed to fetch employee list.");
                setEmployees([]); // Ensure `employees` is always an array
            }
        };

        fetchEmployees();
    }, []);

    // Fetch attendance data for the selected employee
    const handleEmployeeSelect = async (employeeName) => {
        setSelectedEmployee(employeeName);
        setAttendance([]);
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.get(`/employee-attendance/${employeeName}`);
            setAttendance(
                Array.isArray(response.data.attendance) ? response.data.attendance : []
            );
        } catch (err) {
            console.error("Error fetching attendance:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to fetch attendance data.");
        } finally {
            setLoading(false);
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

            <div className="mb-4">
                <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-700">
                    Select Employee:
                </label>
                <select
                    id="employeeSelect"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : attendance.length === 0 ? (
                selectedEmployee && <div>No attendance records found for the selected employee.</div>
            ) : (
                <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2 px-4 text-sm font-medium text-gray-700">Clock In</th>
                            <th className="py-2 px-4 text-sm font-medium text-gray-700">Clock Out</th>
                            <th className="py-2 px-4 text-sm font-medium text-gray-700">Clock In Image</th>
                            <th className="py-2 px-4 text-sm font-medium text-gray-700">Clock Out Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((record) => (
                            <tr key={record.id} className="border-b">
                                <td className="py-2 px-4 text-sm text-gray-800">
                                    {formatDateTime(record.clock_in)}
                                </td>
                                <td className="py-2 px-4 text-sm text-gray-800">
                                    {record.clock_out ? formatDateTime(record.clock_out) : "Not clocked out"}
                                </td>
                                <td className="py-2 px-4">
                                    {record.clock_in_image && (
                                        <img
                                            src={`/storage/${record.clock_in_image}`}
                                            alt="Clock In"
                                            className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                            onClick={() => handleImageClick(`/storage/${record.clock_in_image}`)}
                                        />
                                    )}
                                </td>
                                <td className="py-2 px-4">
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
                        <img src={selectedImage} alt="Zoomed" className="max-w-full max-h-full"/>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default AttendanceList;