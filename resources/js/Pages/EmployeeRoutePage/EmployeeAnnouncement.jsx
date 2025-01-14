import React, { useState, useEffect } from 'react';
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import apiService from '../services/ApiServices';
import { usePage } from '@inertiajs/react';

const EmployeeAnnouncements = () => {
  const { auth } = usePage().props;
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await apiService.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  return (
    <EmployeeLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Announcements
        </h2>
      }
    >
      <div className="p-6 bg-gray-100 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium mb-8 text-center text-gray-800">Announcements</h1>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            {announcements.length > 0 ? (
              <div className="space-y-6">
                {announcements.map((announce, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-50 border-b last:border-none rounded-lg shadow-md"
                  >
                    <p className="text-gray-800 mb-4 whitespace-pre-line text-sm">{announce.content}</p>
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
    </EmployeeLayout>
  );
};

export default EmployeeAnnouncements;
