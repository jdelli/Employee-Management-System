<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employees;

class PayrollApiController extends Controller
{
    
    public function getPayroll(Request $request)
    {
        // Validate the request
        $request->validate([
            'employee_id' => ['required', function ($value, $fail) {
                $payrollExists = Payroll::where('employee_id', $value)
                                        ->where('completed', false)
                                        ->exists();
                if ($payrollExists) {
                    $fail('Employee ID already has an incomplete payroll entry.');
                }
            }],
            'name' => 'required|string',
            'position' => 'required|string',
            'department' => 'required|string',
            'salary' => 'required|numeric',
            'deductions' => 'required|numeric',
            'days_worked' => 'required|integer',
        ]);

        // Create a new payroll entry
        $payroll = Payroll::create([
            'employee_id' => $request->employee_id,
            'name' => $request->name,
            'position' => $request->position,
            'department' => $request->department,
            'salary' => $request->salary,
            'gross_salary' => $request->salary * $request->days_worked,
            'sss' => $request->sss,
            'pag_ibig' => $request->pag_ibig,
            'phil_health' => $request->phil_health,
            'deductions' => $request->deductions,
            'days_worked' => $request->days_worked,
            'total_salary' => ($request->salary * $request->days_worked) - $request->deductions,
        ]);

        return response()->json([
            'message' => 'Payroll added successfully',
            'payroll' => $payroll
        ], 200);
    }

    // Get all uncompleted payrolls with pagination
    public function getAllPayrollsUncompleted(Request $request)
    {
        
        $department = $request->input('department', 'all'); 

       
        $query = Payroll::where('completed', false);

       
        if ($department !== 'all') {
            $query->where('department', $department);
        }

      
        $payrolls = $query->paginate(10);

        return response()->json([
            'message' => 'Uncompleted payrolls retrieved successfully',
            'payrolls' => $payrolls->items(),
            'current_page' => $payrolls->currentPage(),
            'last_page' => $payrolls->lastPage(),
            'total' => $payrolls->total(),
        ], 200);
    }

    // Get all completed payrolls with pagination
    public function getAllPayrollsCompleted(Request $request)
    {
        $month = $request->input('month', date('m'));  
        $year = $request->input('year', date('Y'));    
        $departments = $request->input('department', 'all'); 

        $query = Payroll::where('completed', true)
            ->whereYear('created_at', $year)  
            ->whereMonth('created_at', $month);  

       
        if ($departments !== 'all') {
            $query->where('department', $departments);
        }


        $payrolls = $query->paginate(10);

        return response()->json([
            'message' => 'Payrolls for the selected month retrieved successfully',
            'payrolls' => $payrolls->items(),
            'current_page' => $payrolls->currentPage(),
            'last_page' => $payrolls->lastPage(),
            'total' => $payrolls->total(),
        ], 200);
    }

    // Mark payroll as done
    public function markAsDone($id)
    {
        $payroll = Payroll::find($id);

        if ($payroll) {
            $payroll->completed = true;
            $payroll->save();
            return response()->json([
                'message' => 'Payroll marked as done successfully',
                'payroll' => $payroll
            ], 200);
        } else {
            return response()->json([
                'message' => 'Payroll not found'
            ], 404);
        }
    }



    // Delete payroll
    public function deletePayroll($id)
    {
        $payroll = Payroll::find($id);

        if ($payroll) {
            $payroll->delete();
            return response()->json(['message' => 'Payroll deleted successfully'], 200);
        }

        return response()->json(['message' => 'Payroll not found'], 404);
    }




    // Get all Pending Payrolls
    public function getPendingPayrolls()
    {
        $payrollCount = Payroll::where('completed', false)->count();
        return response()->json(['payrollCount' => $payrollCount]);
    }


    

    // Check if the employee has an incomplete payroll
    public function checkIncompletePayroll($employeeId)
    {
        $hasIncompletePayroll = Payroll::where('employee_id', $employeeId)
                                        ->where('completed', false)
                                        ->exists();

        return response()->json(['hasIncompletePayroll' => $hasIncompletePayroll]);
    }













    //for users

 public function getAllPayrollsCompletedUsers(Request $request)
{
    $month = $request->input('month', date('m'));
    $year = $request->input('year', date('Y'));
    $departments = $request->input('department', 'all');
    $userName = $request->input('user_name'); // Input for user name

    $query = Payroll::where('completed', true)
        ->whereYear('created_at', $year)
        ->whereMonth('created_at', $month);

    if ($departments !== 'all') {
        $query->where('department', $departments);
    }

    if ($userName) {
        $query->whereHas('user', function ($q) use ($userName) {
            $q->where('name', $userName);
        });
    }

    $payrolls = $query->paginate(10);

    return response()->json([
        'message' => 'Payrolls for the selected month retrieved successfully',
        'payrolls' => $payrolls->items(),
        'current_page' => $payrolls->currentPage(),
        'last_page' => $payrolls->lastPage(),
        'total' => $payrolls->total(),
    ], 200);
}


}
