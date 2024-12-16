import React from "react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";


export default function EmployeeDashboard({ auth }) {
    return (
        <EmployeeLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Employee Dashboard
                </h2>
            }
        >
            
        </EmployeeLayout>
    );
}
