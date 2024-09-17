<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employees;
use Validator;
use Illuminate\Support\Facades\Storage;



class EmployeeApiController extends Controller
{
    protected $employeeModel;

    public function __construct() 
    {
        $this->employeeModel = new Employees();
    }



    // ADD
    public function saveEmployee(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|string|max:255|unique:employees,employee_id',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'salary' => 'required|numeric', 
            'deductions' => 'required|numeric', 
            'email' => 'required|string|email|max:255|unique:employees,email', 
            'hire_date' => 'required|date',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ]);

        
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        
        $employee = new Employees();

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoPath = $photo->store('photos', 'public');
            $employee->photo = $photoPath;
        }

        $employee->fill($request->except('photo'));

        $employee->save();

        return response()->json([
            'message' => 'Employee added successfully',
            'employee' => $employee
        ], 200);
    }




    // Get all employees
    public function getAllEmployees(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('limit', 10);
        $sortBy = $request->input('sortBy', 'name'); 
        $sortDirection = $request->input('sortDirection', 'asc'); 
        $department = $request->input('department', 'all'); 
    
        $query = Employees::query();
    
        if ($department !== 'all') {
            $query->where('department', $department);
        }
    
        $query->orderBy($sortBy, $sortDirection);
    
        $employees = $query->paginate($itemsPerPage);
    
        return response()->json([
            'employees' => $employees->items(),
            'total' => $employees->total(),
            'current_page' => $employees->currentPage(),
            'last_page' => $employees->lastPage(),
            'per_page' => $employees->perPage(),
        ], 200);
    }



    // Delete 
    public function deleteEmployee($id)
    {
        $employee = $this->employeeModel->find($id);

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        if ($employee->photo) {

            Storage::disk('public')->delete($employee->photo);
        }

        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully'], 200);
    }





    // Update
    public function updateEmployee(Request $request, $id)
    {
        $employee = $this->employeeModel->find($id);

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }


    

        $employee->update($request->all());
        return response()->json(['message' => 'Employee updated successfully', 'employee' => $employee], 200);
    }



    public function updatePhoto(Request $request, $id)
    {
        
        $employee = Employees::find($id);

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        
        if ($request->hasFile('photo')) {
            if ($employee->photo) {
                Storage::disk('public')->delete($employee->photo);
            }

           
            $photo = $request->file('photo');
            $photoPath = $photo->store('photos', 'public');
            $employee->photo = $photoPath;
        }           
        
        $employee->fill($request->except('photo'));

        
        $employee->save();

        return response()->json(['message' => 'Photo updated successfully', 'employee' => $employee], 200);
    }





    // Count
    public function countEmployee()
    {
        $employeeCount = $this->employeeModel->count();
        return response()->json(['total' => $employeeCount], 200);
    }

    public function countIT()
    {
        $employeeCount = $this->employeeModel->where('department', 'IT')->count();
        return response()->json(['totalIt' => $employeeCount], 200);
    }

    public function countHR()
    {
        $employeeCount = $this->employeeModel->where('department', 'HR')->count();
        return response()->json(['totalHR' => $employeeCount], 200);
    }

    public function countFinance()
    {
        $employeeCount = $this->employeeModel->where('department', 'Finance')->count();
        return response()->json(['totalFinance' => $employeeCount], 200);
    }

    public function countMarketing()
    {
        $employeeCount = $this->employeeModel->where('department', 'Marketing')->count();
        return response()->json(['totalMarketing' => $employeeCount], 200);
    }
}
