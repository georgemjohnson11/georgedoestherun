import { useState, useEffect } from 'react';
import { getAccessToken, refreshAccessToken, fetchActivities } from './api';
import { Activity } from '../components/ActivityList';

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const useStrava = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMetric, setIsMetric] = useState<boolean>(true);
  const [activityType, setActivityType] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(getStartOfMonth());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMoreActivities, setHasMoreActivities] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("strava_access_token");
    if (storedToken) {
      setAccessToken(storedToken);
      setLoading(false);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        getAccessToken(code).then(data => {
          const { access_token, refresh_token, expires_at } = data;
          localStorage.setItem("strava_access_token", access_token);
          localStorage.setItem("strava_refresh_token", refresh_token);
          localStorage.setItem("strava_expires_at", expires_at.toString());
          setAccessToken(access_token);
        }).catch(err => {
          setError(err.message);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedExpiresAt = localStorage.getItem("strava_expires_at");
      if (storedExpiresAt && parseInt(storedExpiresAt) * 1000 < Date.now()) {
        const refreshToken = localStorage.getItem("strava_refresh_token");
        if (refreshToken) {
          refreshAccessToken(refreshToken).then(data => {
            const { access_token, refresh_token, expires_at } = data;
            localStorage.setItem("strava_access_token", access_token);
            localStorage.setItem("strava_refresh_token", refresh_token);
            localStorage.setItem("strava_expires_at", expires_at.toString());
            setAccessToken(access_token);
          }).catch(err => {
            setError(err.message);
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    fetchActivities(accessToken, page, startDate || undefined, endDate || undefined).then(data => {
      const newActivities = data;
      const allActivities = [...activities, ...newActivities];
      const sortedActivities = allActivities.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
      setActivities(sortedActivities);
      setFilteredActivities(sortedActivities);
      setHasMoreActivities(newActivities.length === 30);
    }).catch(err => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }, [accessToken, page, startDate, endDate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleUnitSystem = () => {
    setIsMetric(!isMetric);
  };

  const applyFilters = () => {
    setLoading(true);
    setActivities([]);
    setFilteredActivities([]);
    setFiltersApplied(false);
    setPage(1);

    if (!accessToken) {
      setError("Access token is missing");
      setLoading(false);
      return;
    }
    fetchActivities(accessToken, 1, startDate || undefined, endDate || undefined).then(data => {
      let filtered = data;

      if (activityType !== 'all') {
        filtered = filtered.filter((activity: Activity) => activity.name.toLowerCase().includes(activityType.toLowerCase()));
      }

      const sortedFilteredActivities: Activity[] = filtered.sort((a: Activity, b: Activity) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
      setActivities(sortedFilteredActivities);
      setFilteredActivities(sortedFilteredActivities);
      setFiltersApplied(true);
      setHasMoreActivities(filtered.length === 30);
    }).catch(err => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  const loadMoreActivities = () => {
    setPage(prevPage => prevPage + 1);
  };

  return {
    activities,
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
  };
};