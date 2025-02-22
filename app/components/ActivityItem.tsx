import React from 'react';

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  total_elevation_gain?: number;
  average_heartrate?: number; // New field
}

interface ActivityItemProps {
  activity: Activity;
  isMetric: boolean; // New prop
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isMetric }) => {
  const distance = isMetric ? (activity.distance / 1000).toFixed(2) + ' km' : (activity.distance / 1609.34).toFixed(2) + ' miles';
  const elevationGain = isMetric ? (activity.total_elevation_gain ? activity.total_elevation_gain.toFixed(2) + ' m' : 'N/A') : (activity.total_elevation_gain ? (activity.total_elevation_gain * 3.28084).toFixed(2) + ' ft' : 'N/A');
  const heartRate = activity.average_heartrate ? activity.average_heartrate.toFixed(2) + ' bpm' : 'N/A';
  
  const paceInSeconds = isMetric ? (activity.moving_time / (activity.distance / 1000)) : (activity.moving_time / (activity.distance / 1609.34));
  const paceMinutes = Math.floor(paceInSeconds / 60);
  const paceSeconds = Math.floor(paceInSeconds % 60);
  const pace = `${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds} ${isMetric ? 'min/km' : 'min/mile'}`;

  return (
    <li className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900 dark:text-darkForeground">
          {activity.name}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(activity.start_date).toLocaleDateString()}
        </span>
      </div>
      <div className="mt-2 text-gray-900 dark:text-darkForeground">
        <p>
          <span className="font-bold text-blue-600">Distance:</span> {distance}
        </p>
        <p>
          <span className="font-bold text-blue-600">Elevation Gain:</span> {elevationGain}
        </p>
        <p>
          <span className="font-bold text-blue-600">Average Heart Rate:</span> {heartRate}
        </p>
        <p>
          <span className="font-bold text-blue-600">Pace:</span> {pace}
        </p>
      </div>
    </li>
  );
};

export default ActivityItem;