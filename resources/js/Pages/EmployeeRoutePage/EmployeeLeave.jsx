import React, { useState, useEffect } from "react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import apiService from "../services/ApiServices";

const EmployeeLeaveTable = ({ auth }) => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState({
    leave_type: "",
    user_id: auth?.user?.id || "",
    from_date: "",
    to_date: "",
    reason: "",
    name: auth?.user?.name || "",
    position: auth?.user?.position || "",
    department: auth?.user?.department || "",
    status: false,
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get("/user-leaves", {
        params: { name: auth?.user?.name },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiService.post("/users-add-leave", leaveDetails);
      console.log("Leave request submitted", response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting leave request", error);
    } finally {
      setIsLoading(false);
      fetchLeaves();

    }
  };

  const handleOpenModal = () => {
    setLeaveDetails({
      leave_type: "",
      user_id: auth?.user?.id || "",
      from_date: "",
      to_date: "",
      reason: "",
      name: auth?.user?.name || "",
      position: auth?.user?.position || "",
      department: auth?.user?.department || "",
      status: false,
    });
    setShowModal(true);
  };

  return (
    <EmployeeLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Employee Leave
        </h2>
      }
    >
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4">
          <div className="bg-white rounded shadow p-6">
            <div className="flex justify-between items-center mb-4">
              
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleOpenModal}
              >
                Request Leave
              </button>
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600 border-b">
                    Leave Type
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600 border-b">
                    From
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600 border-b">
                    To
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600 border-b">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="p-3 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="p-3 text-sm text-gray-700 border-b">
                        {leave.leave_type}
                      </td>
                      <td className="p-3 text-sm text-gray-700 border-b">
                        {leave.from_date}
                      </td>
                      <td className="p-3 text-sm text-gray-700 border-b">
                        {leave.to_date}
                      </td>
                      <td
                        className={`p-3 text-sm text-gray-700 border-b ${
                          leave.status === 'approved'
                            ? 'text-green-500'
                            : leave.status === 'rejected'
                            ? 'text-red-500'
                            : 'text-orange-500'
                        }`}
                      >
                        {leave.status === 'approved' ? 'Approved' : leave.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 space-y-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Request Leave</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Modal Content - Scrollable Section */}
              <div className="grid grid-cols-1 gap-6 max-h-96 overflow-y-auto">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={leaveDetails.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    readOnly
                  />
                </div>

                {/* Position Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    name="position"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={leaveDetails.position}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your position"
                    readOnly
                  />
                </div>

                {/* Department Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={leaveDetails.department}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your department"
                    readOnly
                  />
                </div>

                {/* Leave Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <select
                    name="leave_type"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={leaveDetails.leave_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select a leave type
                    </option>
                    <option value="Vacation">Vacation</option>
                    <option value="Sick">Sick</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                {/* Date From Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">From</label>
                  <input
                    type="date"
                    name="from_date"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={leaveDetails.from_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Date To Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <input
                    type="date"
                    name="to_date"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={leaveDetails.to_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Reason Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    name="reason"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    rows="4"
                    value={leaveDetails.reason}
                    onChange={handleInputChange}
                    required
                    placeholder="Provide a reason for your leave"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
};

export default EmployeeLeaveTable;
