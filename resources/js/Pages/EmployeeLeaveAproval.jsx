import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import apiService from "./services/ApiServices";

const EmployeeLeaveTable = ({ auth }) => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Fetch leave data on component mount
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await apiService.get("/get-all-employee-leaves");
                setLeaveRequests(response.data);
            } catch (error) {
                console.error("Error fetching leave requests:", error);
            }
        };

        fetchLeaveRequests();
    }, []);

    const openModal = (employee) => {
        setSelectedEmployee(employee);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleAction = async (id, action) => {
        try {
            const endpoint = `/employee-leaves/${id}/${action}`;
            const response = await apiService.put(endpoint);

            if (response.status === 200) {
                console.log(`Leave ${action === "accept" ? "accepted" : "rejected"} successfully.`);

                // Update leaveRequests state
                setLeaveRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.id === id
                            ? { ...request, status: action === "accept" ? 1 : -1 }
                            : request
                    )
                );

                closeModal();
            }
        } catch (error) {
            console.error(`Error ${action === "accept" ? "accepting" : "rejecting"} leave:`, error);
            alert("An error occurred. Please try again.");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 0:
                return "bg-yellow-100 text-yellow-600";
            case 1:
                return "bg-green-100 text-green-600";
            case -1:
                return "bg-red-100 text-red-600";
            default:
                return "";
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Employee Leave Approval
                </h2>
            }
        >
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="container mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600 border-b text-left"></th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 border-b text-left">Name</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 border-b text-left">Department</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 border-b text-left">Leave Type</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 border-b text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="p-4 border-b">
                                            <button
                                                onClick={() => openModal(request)}
                                                className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg focus:outline-none focus:ring"
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td className="p-4 border-b text-gray-700">{request.name}</td>
                                        <td className="p-4 border-b text-gray-700">{request.department}</td>
                                        <td className="p-4 border-b text-gray-700">{request.leave_type}</td>
                                        <td className="p-4 border-b">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(request.status)}`}
                                            >
                                                {request.status === 0
                                                    ? "Pending"
                                                    : request.status === 1
                                                    ? "Approved"
                                                    : "Rejected"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {modalOpen && selectedEmployee && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Leave Request Details</h3>
                        <div className="space-y-2 text-gray-700">
                            <p>
                                <strong>Name:</strong> {selectedEmployee.name}
                            </p>
                            <p>
                                <strong>Position:</strong> {selectedEmployee.position}
                            </p>
                            <p>
                                <strong>Department:</strong> {selectedEmployee.department}
                            </p>
                            <p>
                                <strong>Leave Type:</strong> {selectedEmployee.leave_type}
                            </p>
                            <p>
                                <strong>From:</strong> {selectedEmployee.from_date}
                            </p>
                            <p>
                                <strong>To:</strong> {selectedEmployee.to_date}
                            </p>
                            <p>
                                <strong>Reason:</strong> {selectedEmployee.reason}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedEmployee.status === 0
                                    ? "Pending"
                                    : selectedEmployee.status === 1
                                    ? "Approved"
                                    : "Rejected"}
                            </p>
                        </div>
                        <div className="mt-6 flex space-x-4">
                            <button
                                onClick={() => handleAction(selectedEmployee.id, "accept")}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg focus:outline-none"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleAction(selectedEmployee.id, "reject")}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none"
                            >
                                Reject
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default EmployeeLeaveTable;
