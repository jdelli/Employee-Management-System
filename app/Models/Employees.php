<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employees extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'name',
        'position',
        'department',
        'address',
        'salary',
        'deductions',
        'email',
        'hire_date',
        'photo',
    ];
}
