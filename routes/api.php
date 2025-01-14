<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeeApiController;
use App\Http\Controllers\Api\PayrollApiController;
use App\Http\Controllers\Api\EmployeeLeaveController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AnnouncementController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');




Route::middleware('auth:sanctum')->post('/tokens/create', function (Request $request) {
    // Create a new token for the authenticated user
    $token = $request->user()->createToken($request->token_name);
    
    // Return the plain-text token
    return ['token' => $token->plainTextToken];
});




//CRUDE
Route::post("/saves", [EmployeeApiController::class, "saveEmployee"]);
Route::get("/all", [EmployeeApiController::class, "getAllEmployees"]);
Route::put("/update/{id}", [EmployeeApiController::class, "updateEmployee"]);
Route::delete("/delete/{id}", [EmployeeApiController::class, "deleteEmployee"]);

//photo
Route::post('/update-photo/{id}', [EmployeeApiController::class, 'updatePhoto']);



//Count per Department
Route::get("/count", [EmployeeApiController::class, "countEmployee"]);
Route::get("/countIT", [EmployeeApiController::class, "countIT"]);
Route::get("/countHR", [EmployeeApiController::class, "countHR"]);
Route::get("/countFinance", [EmployeeApiController::class, "countFinance"]);
Route::get("/countMarketing", [EmployeeApiController::class, "countMarketing"]);



//Payroll
Route::post("/payroll", [PayrollApiController::class, "getPayroll"]);
Route::get("/uncompleted-payrolls", [PayrollApiController::class, "getAllPayrollsUncompleted"]);
Route::put("/done/{id}", [PayrollApiController::class, "markAsDone"]);
Route::get("/completed-payrolls", [PayrollApiController::class, "getAllPayrollsCompleted"]);
Route::delete("/delete-payroll/{id}", [PayrollApiController::class, "deletePayroll"]);

//Payroll Pending Count
Route::get("/count-pending-payroll", [PayrollApiController::class, "getPendingPayrolls"]);





//Check if payroll is incomplete
Route::get('check-incomplete-payroll/{employeeId}', [PayrollApiController::class, 'checkIncompletePayroll']);





////////
Route::get('/employees/{id}', [EmployeeApiController::class, 'getEmployeeById']);




//users
Route::get('/users-get-payroll', [payrollApiController::class, 'getAllPayrollsCompletedUsers']);




// Add employee leave (secured)
Route::post('/users-add-leave', [EmployeeLeaveController::class, 'addEmployeeLeave']);
Route::get('/user-leaves', [EmployeeLeaveController::class, 'getEmployeeLeaves']);
// Accept or reject employee leave
Route::put('/employee-leaves/{id}/accept', [EmployeeLeaveController::class, 'acceptLeave']);
Route::put('/employee-leaves/{id}/reject', [EmployeeLeaveController::class, 'rejectLeave']);


Route::get('/get-all-employee-leaves', [EmployeeLeaveController::class, 'fetchEmployeeLeaves']);





//attendance
Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);
Route::get('/attendance/{employee_id}', [AttendanceController::class, 'getEmployeeAttendance']);
Route::post('/attendance/reset', [AttendanceController::class, 'resetAttendance']);



Route::get('/employees', [AttendanceController::class, 'listEmployees']);
Route::get('/employee-attendance/{name}', [AttendanceController::class, 'getEmployeeAttendanceList']);




Route::get('/employee/days-worked', [PayrollApiController::class, 'getDaysWorked']);







Route::get('/unread-announcements-count', [AnnouncementController::class, 'getUnreadAnnouncementsCount']);
Route::post('/mark-announcements-read', [AnnouncementController::class, 'markAnnouncementsAsRead']);
Route::get('/announcements', [AnnouncementController::class, 'getAnnouncements']);
Route::post('/announcements', [AnnouncementController::class, 'storeAnnouncement']);