<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'name',
        'position',
        'department',
        'salary',
        'deductions',
        'days_worked',
        'total_salary',
        'completed',
    ];
}

