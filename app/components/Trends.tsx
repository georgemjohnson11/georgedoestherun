import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  total_elevation_gain?: number;
  average_heartrate?: number;
}

interface TrendsProps {
  activities: Activity[];
  isMetric: boolean; // New prop
}

const Trends: React.FC<TrendsProps> = ({ activities, isMetric }) => {
  // Get the most recent activities and reverse the order to be chronological
  const recentActivities = activities;

  const dates = recentActivities.map(activity => new Date(activity.start_date).toLocaleDateString());
  const heartRates = recentActivities.map(activity => activity.average_heartrate || 0);
  const elevationGains = recentActivities.map(activity => activity.total_elevation_gain || 0);
  const paces = recentActivities.map(activity => {
    const paceInSeconds = isMetric ? (activity.moving_time / (activity.distance / 1000)) : (activity.moving_time / (activity.distance / 1609.34));
    return paceInSeconds;
  });

  const heartRateData = {
    labels: dates,
    datasets: [
      {
        label: 'Average Heart Rate',
        data: heartRates,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
    ],
  };

  const elevationGainData = {
    labels: dates,
    datasets: [
      {
        label: 'Elevation Gain',
        data: elevationGains.map(gain => isMetric ? gain : gain * 3.28084),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
      },
    ],
  };

  const paceData = {
    labels: dates,
    datasets: [
      {
        label: `Pace (${isMetric ? 's/km' : 's/mile'})`,
        data: paces,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
      },
    ],
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-darkBackground rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-darkForeground">Trends</h2>
      <div className="mb-6">
        <Line data={heartRateData} />
      </div>
      <div className="mb-6">
        <Line data={elevationGainData} />
      </div>
      <div className="mb-6">
        <Line data={paceData} />
      </div>
    </div>
  );
};

export default Trends;