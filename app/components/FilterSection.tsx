import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FilterSectionProps {
  activityType: string;
  setActivityType: (type: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  applyFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  activityType,
  setActivityType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  applyFilters,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-darkForeground">Filters</h2>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="mb-4 md:mb-0">
          <label className="block text-gray-900 dark:text-gray-300 mb-2">Activity Type</label>
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="w-full p-2 text-gray-900 border border-gray-400 rounded bg-white dark:bg-gray-700 dark:text-gray-300"
          >
            <option value="all">All</option>
            <option value="run">Run</option>
            <option value="ride">Ride</option>
            <option value="swim">Swim</option>
            <option value="hike">Hike</option>
            <option value="walk">Walk</option>
            <option value="workout">Workout</option>
            <option value="yoga">Yoga</option>
            <option value="weight_training">Weight Training</option>
            <option value="rowing">Rowing</option>
            <option value="elliptical">Elliptical</option>
            <option value="ski">Ski</option>
            <option value="snowboard">Snowboard</option>
            <option value="ice_skate">Ice Skate</option>
            <option value="inline_skate">Inline Skate</option>
            <option value="kayaking">Kayaking</option>
            <option value="canoeing">Canoeing</option>
            <option value="stand_up_paddling">Stand Up Paddling</option>
            <option value="surfing">Surfing</option>
            <option value="rock_climbing">Rock Climbing</option>
            <option value="mountain_biking">Mountain Biking</option>
            <option value="gravel_cycling">Gravel Cycling</option>
            <option value="e_bike_ride">E-Bike Ride</option>
            <option value="virtual_ride">Virtual Ride</option>
            <option value="virtual_run">Virtual Run</option>
          </select>
        </div>
        <div className="mb-4 md:mb-0">
          <label className="block text-gray-900 dark:text-gray-300 mb-2">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full p-2 text-gray-900 border border-gray-400 rounded bg-white dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="mb-4 md:mb-0">
          <label className="block text-gray-900 dark:text-gray-300 mb-2">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-full p-2 text-gray-900 border border-gray-400 rounded bg-white dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
      </div>
      <button
        onClick={applyFilters}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSection;