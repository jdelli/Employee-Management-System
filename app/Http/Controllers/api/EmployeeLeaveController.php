<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmployeeLeave;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class EmployeeLeaveController extends Controller
{



public function addEmployeeLeave(Request $request)
{
    // Validate the incoming request
     $request->validate([
        'leave_type' => 'required|string',
        'from_date' => 'required|date',
        'to_date' => 'required|date',
        'reason' => 'required|string',
        'name' => 'required|string',
        'position' => 'required|string',
        'department' => 'required|string',
    ]);

    $leaveRequest = EmployeeLeave::create([
        'leave_type' => $request->input('leave_type'),
        'from_date' => $request->input('from_date'),
        'to_date' => $request->input('to_date'),
        'reason' => $request->input('reason'),
        'name' => $request->input('name'),
        'position' => $request->input('position'),
        'department' => $request->input('department'),
        'status' => false,  // default to 'pending'
    ]);

    return response()->json($leaveRequest, 201);
}

public function getEmployeeLeaves(Request $request)
{
    $userName = $request->input('name');
    $leaves = EmployeeLeave::where('name', $userName)
                ->get()
                ->map(function ($leave) {
                    // Map the status to a string (approved, rejected, or pending)
                    if ($leave->status == 1) {
                        $leave->status = 'approved';
                    } elseif ($leave->status == 0) {
                        $leave->status = 'pending';
                    } else {
                        $leave->status = 'rejected'; // Assuming status -1 represents rejection
                    }
                    return $leave;
                });

    return response()->json($leaves, 200);
}




}