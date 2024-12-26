<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = ['employee_id', 'clock_in', 'clock_out', 'clock_in_image', 'clock_out_image'];


    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
    
}



