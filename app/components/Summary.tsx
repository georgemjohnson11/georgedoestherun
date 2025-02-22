import React from 'react';
import { FaRunning, FaClock, FaTachometerAlt, FaMountain, FaHeartbeat } from 'react-icons/fa';

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string; // New property
  total_elevation_gain?: number; // New property
  average_heartrate?: number; // New property
}

interface SummaryProps {
  activities: Activity[];
  isMetric: boolean; // New prop
}

const Summary: React.FC<SummaryProps> = ({ activities, isMetric }) => {
  if (!activities.length) return null;

  const totalDistance = activities.reduce((acc, activity) => acc + activity.distance, 0) / 1000;
  const totalTime = activities.reduce((acc, activity) => acc + activity.moving_time, 0) / 3600;
  const averageSpeed = totalDistance / totalTime;
  const totalElevationGain = activities.reduce((acc, activity) => acc + (activity.total_elevation_gain || 0), 0);
  const averageHeartRate = activities.reduce((acc, activity) => acc + (activity.average_heartrate || 0), 0) / activities.length;

  const distance = isMetric ? totalDistance.toFixed(2) + ' km' : (totalDistance * 0.621371).toFixed(2) + ' miles';
  const speed = isMetric ? averageSpeed.toFixed(2) + ' km/h' : (averageSpeed * 0.621371).toFixed(2) + ' mph';
  const elevationGain = isMetric ? totalElevationGain.toFixed(2) + ' m' : (totalElevationGain * 3.28084).toFixed(2) + ' ft';

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-darkBackground rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-darkForeground">Summary</h2>
      <div className="space-y-2">
        <p className="text-gray-900 dark:text-darkForeground flex items-center">
          <FaRunning className="text-blue-600 mr-2" />
          <span className="font-bold">Total Distance:</span> {distance}
        </p>
        <p className="text-gray-900 dark:text-darkForeground flex items-center">
          <FaClock className="text-blue-600 mr-2" />
          <span className="font-bold">Total Time:</span> {totalTime.toFixed(2)} hours
        </p>
        <p className="text-gray-900 dark:text-darkForeground flex items-center">
          <FaTachometerAlt className="text-blue-600 mr-2" />
          <span className="font-bold">Average Speed:</span> {speed}
        </p>
        <p className="text-gray-900 dark:text-darkForeground flex items-center">
          <FaMountain className="text-blue-600 mr-2" />
          <span className="font-bold">Total Elevation Gain:</span> {elevationGain}
        </p>
        <p className="text-gray-900 dark:text-darkForeground flex items-center">
          <FaHeartbeat className="text-blue-600 mr-2" />
          <span className="font-bold">Average Heart Rate:</span> {averageHeartRate.toFixed(2)} bpm
        </p>
      </div>
    </div>
  );
};

export default Summary;