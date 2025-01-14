<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Announcement;

class AnnouncementController extends Controller
{


    // Fetch all announcements
    public function getAnnouncements()
    {
        $announcements = Announcement::latest()->get();
        return response()->json($announcements);
    }

    
    // Store a new announcement
    public function storeAnnouncement(Request $request)
    {
        $request->validate([
            'announcement' => 'required|string|max:10000', // Adjust max length as per the column size
        ]);

        $announcement = Announcement::create([
            'content' => $request->announcement,
        ]);

        return response()->json(['success' => true, 'announcement' => $announcement]);
    }


    public function getUnreadAnnouncementsCount(Request $request)
    {
        $unreadCount = Announcement::whereDoesntHave('views')->count();

        return response()->json(['unread_count' => $unreadCount]);
    }


    public function markAnnouncementsAsRead(Request $request)
    {
        $userId = $request->input('user_id');
        
        // Mark all unread announcements as read for the user
        Announcement::whereDoesntHave('views', function($query) use ($userId) {
            $query->where('user_id', $userId);
        })->each(function($announcement) use ($userId) {
            $announcement->views()->create([
                'user_id' => $userId,
            ]);
        });

        return response()->json(['message' => 'All announcements marked as read']);
    }






}
