import React, { useState, useEffect } from 'react';
import { Activity } from './ActivityList';


const PageComponent = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activityType, setActivityType] = useState('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch activities based on the current page
    const fetchActivities = async () => {
      setLoading(true);
      const response = await fetch(`/api/activities?page=${page}`);
      const data = await response.json();
      if (data.activities.length === 0) {
        setHasMoreActivities(false);
      } else {
        setActivities(prevActivities => [...prevActivities, ...data.activities]);
      }
      setLoading(false);
    };

    fetchActivities();
  }, [page]);

  const applyFilters = () => {
    let filtered = activities;

    if (activityType !== 'all') {
      filtered = filtered.filter(activity => activity.name.toLowerCase().includes(activityType.toLowerCase()));
    }

    if (startDate) {
      filtered = filtered.filter(activity => new Date(activity.start_date) >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(activity => new Date(activity.start_date) <= endDate);
    }

    const sortedFilteredActivities = filtered.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
    setFilteredActivities(sortedFilteredActivities);
  };

  const loadMoreActivities = () => {
    if (hasMoreActivities) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBackground p-6 flex flex-col items-center relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-darkBackground bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Activity Type"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          className="mr-2 p-2 border"
        />
        <input
          type="date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          className="mr-2 p-2 border"
        />
        <input
          type="date"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
          className="mr-2 p-2 border"
        />
        <button onClick={applyFilters} className="p-2 bg-blue-500 text-white">Apply Filters</button>
      </div>
      {/* Render activities */}
      {filteredActivities.map(activity => (
        <div key={activity.id}>{activity.name}</div>
      ))}
      {!loading && hasMoreActivities && (
        <button onClick={loadMoreActivities}>Load More</button>
      )}
    </div>
  );
};

export default PageComponent;