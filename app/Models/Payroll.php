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
        'gross_salary',
        'sss',
        'pag_ibig',
        'phil_health',
        'deductions',
        'days_worked',
        'total_salary',
        'completed',
        
    ];

    /**
     * Get the user associated with the payroll.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'name', 'name');
    }
}

