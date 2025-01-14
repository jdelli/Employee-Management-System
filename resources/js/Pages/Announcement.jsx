import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import apiService from './services/ApiServices';
import { usePage } from '@inertiajs/react';

const EmployeeMessaging = () => {
  const { auth } = usePage().props;
  const [announcements, setAnnouncements] = useState([]);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const response = await apiService.get('/announcements');
    setAnnouncements(response.data);
  };

  const postAnnouncement = () => {
    if (!announcement.trim()) return;

    apiService.post('/announcements', { announcement }).then(() => {
      setAnnouncement('');
      fetchAnnouncements();
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Employee Announcements
        </h2>
      }
    >
      <div className="p-6 bg-gray-100 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium mb-6 text-center text-gray-800">Employee Announcements</h1>

          {/* Announcement Section */}
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Post an Announcement</h2>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
              placeholder="Type your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows="6"
            />
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
              onClick={postAnnouncement}
            >
              Post Announcement
            </button>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Recent Announcements</h3>
            {announcements.length > 0 ? (
              <div className="space-y-6">
                {announcements.map((announce, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white shadow rounded-lg border border-gray-200"
                  >
                    {/* Render content with line breaks preserved */}
                    <pre className="text-gray-800 whitespace-pre-line text-sm">{announce.content}</pre>
                    <span className="text-xs text-gray-500">{new Date(announce.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No announcements yet.</p>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default EmployeeMessaging;
