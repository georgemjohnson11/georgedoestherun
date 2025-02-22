import React from 'react';
import ActivityList, { Activity } from './ActivityList';

interface ActivitySectionProps {
  activities: Activity[];
  isMetric: boolean;
  loadMoreActivities: () => void;
  hasMoreActivities: boolean;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  activities,
  isMetric,
  loadMoreActivities,
  hasMoreActivities,
}) => {
  return (
    <div className="md:w-2/5 md:pl-4 top-0">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-darkForeground">Recent Activities</h2>
      <ActivityList activities={activities} isMetric={isMetric} />
      <button
        onClick={loadMoreActivities}
        className={`mt-4 py-2 px-4 rounded ${hasMoreActivities ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        disabled={!hasMoreActivities}
      >
        Load More Activities
      </button>
    </div>
  );
};

export default ActivitySection;