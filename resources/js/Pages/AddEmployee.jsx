import React, { useState } from "react";
import apiService from "./services/ApiServices";

const EmployeeModalAdd = ({ isOpen, onClose, refreshEmployees }) => {
    const [employee_id, setEmployeeId] = useState("");
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [address, setAddress] = useState("");
    const [salary, setSalary] = useState("");
    const [deductions, setDeductions] = useState("");
    const [email, setEmail] = useState("");
    const [hire_date, setHireDate] = useState("");
    const [photo, setPhoto] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const departmentOptions = ['IT', 'HR', 'Finance', 'Marketing'];

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("employee_id", employee_id);
        formData.append("name", name);
        formData.append("position", position);
        formData.append("department", department);
        formData.append("address", address);
        formData.append("salary", salary);
        formData.append("deductions", deductions);
        formData.append("email", email);
        formData.append("hire_date", hire_date);
        if (photo) formData.append("photo", photo);

        apiService.post("saves", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log(response.data);
            refreshEmployees();
            onClose();
            resetForm();
        })
        .catch((error) => {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                setErrorMessage(errorMessages);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        });
    };

    const resetForm = () => {
        setEmployeeId("");
        setName("");
        setPosition("");
        setDepartment("");
        setAddress("");
        setSalary("");
        setDeductions("");
        setEmail("");
        setHireDate("");
        setPhoto(null);
        setErrorMessage("");
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">
                    Add Employee
                </h3>
                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className="mb-4 text-red-500">
                            {errorMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Employee ID</label>
                            <input
                                type="text"
                                name="employee_id"
                                value={employee_id}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Department</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            >
                                <option value="">Select a department</option>
                                {departmentOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Salary</label>
                            <input
                                type="number"
                                name="salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Deductions</label>
                            <input
                                type="number"
                                name="deductions"
                                value={deductions}
                                onChange={(e) => setDeductions(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Hire Date</label>
                            <input
                                type="date"
                                name="hire_date"
                                value={hire_date}
                                onChange={(e) => setHireDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Photo</label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModalAdd;
