'use client'
import React, { lazy, Suspense } from "react";
import { useStrava } from './hooks/useStrava';
import dotenv from 'dotenv';
dotenv.config();

const DarkModeToggle = lazy(() => import('./components/DarkModeToggle'));
const FilterSection = lazy(() => import('./components/FilterSection'));
const ActivitySection = lazy(() => import('./components/ActivitySection'));
const AnalysisSection = lazy(() => import('./components/AnalysisSection'));
const CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const REDIRECT_URI = "https://run.georgedoesthething.com";

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-darkBackground bg-opacity-75 z-50">
    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 dark:border-gray-600 h-32 w-32"></div>
  </div>
);

const GeorgeDoesTheRun: React.FC = () => {
  const {
    filteredActivities,
    loading,
    error,
    accessToken,
    isDarkMode,
    isMetric,
    activityType,
    startDate,
    endDate,
    filtersApplied,
    hasMoreActivities,
    setActivityType,
    setStartDate,
    setEndDate,
    toggleDarkMode,
    toggleUnitSystem,
    applyFilters,
    loadMoreActivities,
  } = useStrava();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBackground p-6 flex flex-col items-center relative">
      {loading && <Loader />}
      <div className={`w-full max-w-4xl bg-white dark:bg-darkBackground p-6 rounded-lg shadow-md ${loading ? 'opacity-50' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-darkForeground">Strava Activity Summary</h1>
          <div className="flex space-x-4">
            <Suspense fallback={<div>Loading...</div>}>
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </Suspense>
            <button
              onClick={toggleUnitSystem}
              className="bg-gray-900 text-white py-2 px-4 rounded dark:bg-gray-200 dark:text-gray-900"
            >
              {isMetric ? 'Switch to Imperial' : 'Switch to Metric'}
            </button>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <FilterSection
            activityType={activityType}
            setActivityType={setActivityType}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            applyFilters={applyFilters}
          />
          {!accessToken && !loading && (
            <a
              href={`https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=activity:read_all`}
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Authenticate with Strava
            </a>
          )}
          {error && <p className="text-red-600 dark:text-red-400">Error: {error}</p>}
          {!loading && !error && accessToken && filtersApplied && (
            <div className="flex flex-col md:flex-row">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-darkForeground">Analysis</h2>
              <AnalysisSection
                activities={filteredActivities}
                isMetric={isMetric}
                filtersApplied={filtersApplied}
              />
              <ActivitySection
                activities={filteredActivities}
                isMetric={isMetric}
                loadMoreActivities={loadMoreActivities}
                hasMoreActivities={hasMoreActivities}
              />
            </div>
          )}
        </Suspense>
        <div className="mt-6">
          <a
            href="https://github.com/georgemjohnson11/georgedoestherun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View this website&apos;s code on GitHub
          </a>
        </div>
        <div className="mt-2">
          <a
            href="https://www.strava.com/athletes/50566844"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Follow Me on Strava
          </a>
        </div>
      </div>
    </div>
  );
}

export default GeorgeDoesTheRun;