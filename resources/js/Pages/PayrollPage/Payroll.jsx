import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PayrollTable from './PendingPayroll';
import PayrollTableComplete from './CompletedPayroll';

const TabsComponent = ({ auth }) => {
    const [activeTab, setActiveTab] = useState('tab1');

    const renderContent = () => {
        switch (activeTab) {
            case 'tab1':
                return <div><PayrollTable /></div>;
            case 'tab2':
                return <div><PayrollTableComplete /></div>;
            default:
                return null;
        }
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
                    <button
                        onClick={() => setActiveTab('tab1')}
                        className={`px-4 py-2 ${activeTab === 'tab1' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    >
                        Pending Payrolls
                    </button>
                    <button
                        onClick={() => setActiveTab('tab2')}
                        className={`px-4 py-2 ${activeTab === 'tab2' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    >
                        Completed
                    </button>
                    
                </div>

                <div className="mt-4">
                    {renderContent()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TabsComponent;
