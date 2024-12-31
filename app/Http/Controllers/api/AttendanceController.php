<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use Carbon\Carbon;
use App\Models\User;

class AttendanceController extends Controller
{



    public function clockIn(Request $request)
    {
        $request->validate([
            
            'name' => 'required|string',
            'clock_in' => 'required|date_format:Y-m-d H:i:s',
            'clock_in_image' => 'required|image|max:2048',
        ]);

        // Store the uploaded image
        $imagePath = $request->file('clock_in_image')->store('clock_in_images', 'public');

        // Create attendance record
        $attendance = Attendance::create([
            
            'name' => $request->name,
            'clock_in' => $request->clock_in,
            'clock_in_image' => $imagePath, // Save image path
        ]);

        return response()->json($attendance, 201);
    }


    public function clockOut(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:attendances,id',
            'clock_out' => 'required|date_format:Y-m-d H:i:s',
            'clock_out_image' => 'required|image|max:2048',
        ]);
    
        // Store the uploaded image
        $imagePath = $request->file('clock_out_image')->store('clock_out_images', 'public');
    
        // Update the attendance record
        $attendance = Attendance::findOrFail($request->id);
        $attendance->update([
            'clock_out' => $request->clock_out,
            'clock_out_image' => $imagePath, // Save image path
        ]);
    
        return response()->json($attendance);
    }




    public function getEmployeeAttendance($employee_name, Request $request)
    {
        $currentDate = Carbon::parse($request->query('date'))->startOfDay(); // Parse the date parameter for today


        // Fetch today's attendance records
        $attendance = Attendance::where('name', $employee_name)
                                ->whereDate('clock_in', '=', $currentDate->toDateString()) // Ensure attendance is for today
                                ->get();

        if ($attendance->isEmpty()) {
            return response()->json(['message' => 'No attendance records found.'], 404);
        }

        return response()->json($attendance);
    }

    public function resetAttendance(Request $request)
    {
        $currentDate = Carbon::now()->startOfDay();

        // Reset attendance records for the previous day
        $attendance = Attendance::whereDate('clock_in', '=', $currentDate->toDateString())
                                ->whereNull('clock_out')
                                ->update(['clock_out' => $currentDate->toDateTimeString()]); // Set clock_out for incomplete records

        return response()->json(['message' => 'Attendance reset for today']);
    }










// Fetch all employees' clock in and clock out records based on their name
public function getEmployeeAttendanceList($name)
{
    // Fetch attendance records where the name matches
    $attendance = Attendance::where('name', $name)->get();

    // Check if attendance records exist
    if ($attendance->isEmpty()) {
        return response()->json(['message' => 'No attendance records found.'], 404);
    }

    return response()->json(['attendance' => $attendance]);
}
// List all employees
public function listEmployees()
{
    $employees = User::select('name')->get();
    return response()->json(['employees' => $employees]);
}










}

