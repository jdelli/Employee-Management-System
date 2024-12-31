import React, { useState, useEffect, useRef } from "react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import apiService from "../services/ApiServices";
import moment from "moment";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

export default function EmployeeDashboard({ auth }) {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [cameraActive, setCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const employeeName = auth.user.name;

    // Real-time clock
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const currentDate = moment().format("YYYY-MM-DD");
            const response = await apiService.get(`/attendance/${employeeName}?date=${currentDate}`);
            
            // Filter for today's records only
            const todaysRecords = response.data.filter(record => 
                moment(record.clock_in).format("YYYY-MM-DD") === currentDate
            );
            
            setAttendance(todaysRecords);

            // Check for day change and reset attendance if necessary
            resetAttendanceIfNewDay(todaysRecords);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Add this new useEffect to check for day changes
    useEffect(() => {
        const dayCheckInterval = setInterval(() => {
            fetchAttendance();
        }, 60000); // Check every minute
        
        return () => clearInterval(dayCheckInterval);
    }, []);

    const resetAttendanceIfNewDay = (attendanceRecords) => {
        const firstRecord = attendanceRecords[0];
        if (firstRecord && moment(firstRecord.clock_in).isBefore(moment().startOf("day"))) {
            resetClockOut(firstRecord.id);
        }
    };

    const resetClockOut = async (attendanceId) => {
        try {
            await apiService.post("/attendance/clock-out", {
                attendance_id: attendanceId,
                clock_out: moment().format("YYYY-MM-DD HH:mm:ss"),
            });
        } catch (error) {
            console.error("Error resetting attendance:", error);
        }
    };

    const startCamera = () => {
        setCameraActive(true);
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((error) => {
                console.error("Error accessing camera:", error);
                setCameraActive(false);
            });
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        setCameraActive(false);
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL("image/png");
        setCapturedImage(photoData);
        stopCamera();
        return photoData;
    };

    const handleClockIn = async () => {
        const photo = capturePhoto();
        const formData = new FormData();
        formData.append("employee_id", auth.user.id);
        formData.append("name", auth.user.name);
        formData.append("clock_in", moment().format("YYYY-MM-DD HH:mm:ss"));
        formData.append("clock_in_image", dataURItoBlob(photo));

        setLoading(true);
        try {
            await apiService.post("/attendance/clock-in", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            fetchAttendance();
        } catch (error) {
            console.error("Error clocking in:", error.response.data);
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        const photo = capturePhoto();
        const formData = new FormData();
        formData.append("clock_out", moment().format("YYYY-MM-DD HH:mm:ss"));
        formData.append("clock_out_image", dataURItoBlob(photo));
    
        // Add the ID of the attendance record to the form data
        const currentAttendance = attendance.find(record => !record.clock_out);
        if (!currentAttendance) {
            console.error("No ongoing attendance record found for clock out.");
            return;
        }
        formData.append("id", currentAttendance.id);
    
        setLoading(true);
        try {
            await apiService.post("/attendance/clock-out", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            fetchAttendance();
        } catch (error) {
            console.error("Error clocking out:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (date) => {
        return moment(date).format("hh:mm:ss A");
    };

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([uintArray], { type: mimeString });
    };

    // Determine if the employee has clocked in today
    const hasClockedInToday = attendance.some(record => record.clock_in && !record.clock_out);

    return (
        <EmployeeLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">Employee Dashboard</h2>}
        >
            <div className="max-w-4xl mx-auto mt-6 px-4">
                {/* Clock Section */}
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="mb-4 p-4 bg-blue-100 rounded-full shadow-xl">
                        <Clock value={currentTime} size={250} renderNumbers={true} />
                    </div>
                    <div className="text-center text-4xl font-semibold text-gray-800 shadow-lg p-2 bg-white rounded-xl">
                        {moment(currentTime).format("hh:mm:ss A")}
                    </div>
                </div>

                {/* Camera Section */}
                {cameraActive && (
                    <div className="mt-6 flex flex-col items-center">
                        <video ref={videoRef} className="rounded-lg shadow-md" autoPlay muted />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-8 justify-center my-6">
                    <button
                        onClick={() => {
                            startCamera();
                            handleClockIn();
                        }}
                        disabled={loading || hasClockedInToday}
                        className={`w-36 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${loading || hasClockedInToday ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        {loading ? "Clocking In..." : "Clock In"}
                    </button>
                    <button
                        onClick={() => {
                            startCamera();
                            handleClockOut();
                        }}
                        disabled={loading || !hasClockedInToday}
                        className={`w-36 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${loading || !hasClockedInToday ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
                    >
                        {loading ? "Clocking Out..." : "Clock Out"}
                    </button>
                </div>

                {/* Attendance History */}
                <div className="mt-6">
                    {loading ? (
                        <div className="text-center text-gray-500">Loading attendance...</div>
                    ) : attendance.length === 0 ? (
                        <div className="text-center text-gray-500">No attendance records found.</div>
                    ) : (
                        <ul className="space-y-6">
                            {attendance.map((record) => (
                                <li
                                    key={record.id}
                                    className="p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium text-gray-700">Clocked In:</span>
                                        <span className="text-gray-600">{formatTime(record.clock_in)}</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="font-medium text-gray-700">Clocked Out:</span>
                                        <span className="text-gray-600">{record.clock_out ? formatTime(record.clock_out) : "In Progress"}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </EmployeeLayout>
    );
}