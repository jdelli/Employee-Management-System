import React, { useState, useEffect } from "react";
import apiService from "./services/ApiServices";

const EmployeeModalEdit = ({ isOpen, onClose, refreshEmployees, editingEmployee }) => {
    const [employee_id, setEmployeeId] = useState("");
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [address, setAddress] = useState("");
    const [salary, setSalary] = useState("");
    const [deductions, setDeductions] = useState("");
    const [email, setEmail] = useState("");
    const [hire_date, setHireDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [photo, setPhoto] = useState(null);

    const departmentOptions = ['IT', 'HR', 'Finance', 'Marketing'];

    useEffect(() => {
        if (editingEmployee) {
            setEmployeeId(editingEmployee.employee_id);
            setName(editingEmployee.name);
            setPosition(editingEmployee.position);
            setDepartment(editingEmployee.department);
            setAddress(editingEmployee.address);
            setSalary(editingEmployee.salary);
            setDeductions(editingEmployee.deductions);
            setEmail(editingEmployee.email);
            setHireDate(editingEmployee.hire_date);
        }
    }, [editingEmployee]);

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await apiService.put(`/update/${editingEmployee.id}`, {
                employee_id,
                name,
                position,
                department,
                address,
                salary,
                deductions,
                email,
                hire_date,
            });

            if (photo) {
                const photoFormData = new FormData();
                photoFormData.append('photo', photo);

                await apiService.post(`/update-photo/${editingEmployee.id}`, photoFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            console.log('Employee updated successfully');
            refreshEmployees();
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrorMessage('Email already exists. Please use a different email.');
            } else {
                setErrorMessage('An error occurred while submitting the form. Please try again.');
            }
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        setErrorMessage("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-60">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Edit Employee</h3>
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
                                onChange={handlePhotoChange}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModalEdit;
