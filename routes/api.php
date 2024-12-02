<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeeApiController;
use App\Http\Controllers\Api\PayrollApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');




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

