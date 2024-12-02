import React from "react";

const PayrollForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Payroll Form</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Earnings Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Total Earnings</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="basicPay">
                  Basic Pay
                </label>
                <input
                  type="number"
                  id="basicPay"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter basic pay"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="overtime">
                  Overtime
                </label>
                <input
                  type="number"
                  id="overtime"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter overtime amount"
                />
              </div>
            </div>

            {/* Total Deductions Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Total Deductions</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="sssContri">
                  SSS Contribution
                </label>
                <input
                  type="number"
                  id="sssContri"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter SSS contribution"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="pagIbigContri">
                  Pag-IBIG Contribution
                </label>
                <input
                  type="number"
                  id="pagIbigContri"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter Pag-IBIG contribution"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="philHealthContri">
                  PhilHealth Contribution
                </label>
                <input
                  type="number"
                  id="philHealthContri"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter PhilHealth contribution"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="tardyUndertime">
                  Tardy/Undertime
                </label>
                <input
                  type="number"
                  id="tardyUndertime"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter tardy/undertime deductions"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="absent">
                  Absent
                </label>
                <input
                  type="number"
                  id="absent"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter absent deductions"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Submit Payroll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayrollForm;
