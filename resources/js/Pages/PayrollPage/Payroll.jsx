import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PayrollTable from './PendingPayroll';
import PayrollTableComplete from './CompletedPayroll';


const TabsComponent = ({ auth }) => {
    const [activeTab, setActiveTab] = useState('tab1');

    const tabs = [
        { id: 'tab1', label: 'Pending Payrolls', component: <PayrollTable /> },
        { id: 'tab2', label: 'Completed Payrolls', component: <PayrollTableComplete /> },
    ];

    const renderContent = () => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        return activeTabData ? activeTabData.component : <p>Invalid tab selection.</p>;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Payroll
                </h2>
            }
        >
            <Head title="Payroll" />
            <div>
                <div className="flex border-b border-gray-300">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 focus:outline-none ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                    : 'text-gray-500 hover:text-blue-500'
                            }`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="mt-4">
                    {renderContent()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TabsComponent;
