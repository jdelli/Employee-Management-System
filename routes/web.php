<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware(['checkrole:user'])->group(function () {
    // User routes
    Route::get('/user-dashboard', function () {
        return Inertia::render('EmployeeRoutePage/EmployeeDashboard');
    })->name('user-dashboard');

    Route::get('/user-payroll', function () {
        return Inertia::render('EmployeeRoutePage/EmployeePayroll');
    })->name('user-payroll');

    Route::get('/user-leave', function () {
        return Inertia::render('EmployeeRoutePage/EmployeeLeave');
    })->name('user-leave');

    Route::get('/user-announcement', function () {
        return Inertia::render('EmployeeRoutePage/EmployeeAnnouncement');
    })->name('user-announcement');
});




Route::middleware(['checkrole:admin'])->group(function () {
    Route::get('/admin-dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/admin-employees', function () {
        return Inertia::render('Employees');
    })->name('employees');

    Route::get('/admin-payroll', function () {
        return Inertia::render('PayrollPage/Payroll');
    })->name('payroll');

    Route::get('/admin-leave', function () {
        return Inertia::render('EmployeeLeaveAproval');
    })->name('leave');

    Route::get('/admin-attendance', function () {
        return Inertia::render('EmployeeAttendanceList');
    })->name('attendance');
    
    Route::get('/admin-announcement', function () {
        return Inertia::render('Announcement');
    })->name('announcement');
});











Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
