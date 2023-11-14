import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getJob from '@wasp/queries/getJob';
import updateJobStatus from '@wasp/actions/updateJobStatus';

export function Driver() {
  const { driverId } = useParams();

  const { data: job, isLoading, error } = useQuery(getJob, { id: driverId });
  const acceptJobFn = useAction(acceptJob);
  const completeJobFn = useAction(completeJob);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleAcceptJob = () => {
    acceptJobFn({ id: job.id });
  };

  const handleCompleteJob = () => {
    completeJobFn({ id: job.id });
  };

  return (
    <div className='p-4'>
      <h2>Current Location: {job.driver.currentLocation}</h2>
      <h2>Assigned Job:</h2>
      <p>Description: {job.description}</p>
      <p>Pickup Location: {job.pickupLocation}</p>
      <p>Dropoff Location: {job.dropoffLocation}</p>
      <p>Pickup Time: {job.pickupTime}</p>
      <p>Dropoff Time: {job.dropoffTime}</p>
      <p>Status: {job.status}</p>

      {job.status === 'assigned' && (
        <button
          onClick={handleAcceptJob}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Accept Job
        </button>
      )}

      {job.status === 'accepted' && (
        <button
          onClick={handleCompleteJob}
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        >
          Complete Job
        </button>
      )}
    </div>
  );
}