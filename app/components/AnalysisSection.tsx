import React from 'react';
import Trends from './Trends';
import Analysis from './Analysis';
import WorkoutSuggestion from './WorkoutSuggestion';
import { Activity } from './ActivityList';


interface AnalysisSectionProps {
  activities: Activity[];
  isMetric: boolean;
  filtersApplied: boolean;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  activities,
  isMetric,
  filtersApplied,
}) => {
  return (
    <div className="md:w-3/5 md:pr-4 sticky top-0">
      <Trends activities={activities} isMetric={isMetric} />
      <Analysis activities={activities} isMetric={isMetric} />
      <WorkoutSuggestion activities={activities} isMetric={isMetric} isFilterApplied={filtersApplied} />
    </div>
  );
};

export default AnalysisSection;