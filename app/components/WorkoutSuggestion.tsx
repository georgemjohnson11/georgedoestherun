import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  type: string;
  total_elevation_gain?: number;
  average_heartrate?: number;
}

interface WorkoutSuggestionProps {
  activities: Activity[];
  isMetric: boolean;
  isFilterApplied: boolean;
}

const WorkoutSuggestion: React.FC<WorkoutSuggestionProps> = ({ activities, isMetric, isFilterApplied }) => {
  const [suggestedWorkout, setSuggestedWorkout] = useState<string>('');
  const [suggestedMovingTime, setSuggestedMovingTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const modelPath = 'localstorage://workout-model'; // Store model locally

  useEffect(() => {
    if (!isFilterApplied || activities.length < 10) return;

    const trainAndPredict = async () => {
      setLoading(true);
      setError(null);

      try {
        // Sort and slice the last 30 activities
        const filteredActivities = activities
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(-30); // Take the last 30 activities

        if (filteredActivities.length < 10) {
          setError('Not enough recent activities for training.');
          setLoading(false);
          return;
        }

        const distances = filteredActivities.map(activity => activity.distance);
        const movingTimes = filteredActivities.map(activity => activity.moving_time);
        console.log(distances);
        console.log(movingTimes);
        // Sliding window preparation
        const timeSteps = 5;
        const featureSize = 1;
        const X: number[][][] = [];
        const Y: number[][] = [];

        for (let i = 0; i < distances.length - timeSteps; i++) {
          X.push(distances.slice(i, i + timeSteps).map(d => [d]));
          Y.push([distances[i + timeSteps], movingTimes[i + timeSteps]]);
        }

        const inputTensor = tf.tensor3d(X, [X.length, timeSteps, featureSize]);
        const targetTensor = tf.tensor2d(Y, [Y.length, 2]);

        // Check if model exists
        let lstmModel;
        try {
          lstmModel = await tf.loadLayersModel(modelPath);
          console.log("Loaded existing model.");
        } catch (e) {
          console.log("Training new model... %d", e);
          lstmModel = tf.sequential();
          lstmModel.add(tf.layers.lstm({ inputShape: [timeSteps, featureSize], units: 128, returnSequences: true }));
          lstmModel.add(tf.layers.lstm({ units: 64, returnSequences: false }));
          lstmModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
          lstmModel.add(tf.layers.dense({ units: 2 })); // Predict distance and moving_time
          lstmModel.compile({ optimizer: tf.train.adam(0.001), loss: 'meanAbsoluteError' });

          await lstmModel.fit(inputTensor, targetTensor, {
            epochs: 200,
            batchSize: 16,
            callbacks: tf.callbacks.earlyStopping({ monitor: 'loss', patience: 20 })
          });

          // Save the trained model
          await lstmModel.save(modelPath);
        }

        // Prepare test input tensor
        const testInput = tf.tensor3d([distances.slice(-timeSteps).map(d => [d])], [1, timeSteps, featureSize]);
        
        // Predict next workout
        const prediction = lstmModel.predict(testInput) as tf.Tensor;
        const [predictedDistance, predictedMovingTime] = Array.from(await prediction.data());

        // Convert back to original scale
        const actualDistance = predictedDistance/100;
        const actualMovingTime = predictedMovingTime/10;

        // Convert units
        const distance = isMetric ? actualDistance.toFixed(2) + ' km' : (actualDistance * 0.621371).toFixed(2) + ' miles';

        // Get workout type from the last recorded activity
        const activityType = filteredActivities[filteredActivities.length - 1].type;

        setSuggestedWorkout(`${activityType} ${distance}`);
        setSuggestedMovingTime(`Estimated Moving Time: ${actualMovingTime.toFixed(2)} minutes`);
      } catch (err) {
        setError('Error predicting workout: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    trainAndPredict();
  }, [activities, isMetric, isFilterApplied]);

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-darkBackground rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-darkForeground">Suggested Workout</h2>
      {loading && <p className="text-gray-900 dark:text-darkForeground">Loading...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!loading && !error && (
        <>
          <p className="text-gray-900 dark:text-darkForeground">{suggestedWorkout}</p>
          <p className="text-gray-900 dark:text-darkForeground">{suggestedMovingTime}</p>
        </>
      )}
    </div>
  );
};

export default WorkoutSuggestion;
