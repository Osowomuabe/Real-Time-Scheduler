import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getVehicle from '@wasp/queries/getVehicle';
import getJob from '@wasp/queries/getJob';
import createJob from '@wasp/actions/createJob';
import updateJobStatus from '@wasp/actions/updateJobStatus';

export function DashboardPage() {
  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useQuery(getVehicle);
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useQuery(getJob);
  const createJobFn = useAction(createJob);
  const updateJobStatusFn = useAction(updateJobStatus);

  if (vehiclesLoading || jobsLoading) return 'Loading...';
  if (vehiclesError || jobsError) return 'Error: ' + (vehiclesError || jobsError);

  const handleCreateJob = () => {
    createJobFn();
  };

  const handleUpdateJobStatus = (jobId, status) => {
    updateJobStatusFn({ jobId, status });
  };

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <button
          onClick={handleCreateJob}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Create Job
        </button>
      </div>
      <div>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className='bg-gray-100 p-4 mb-4 rounded-lg'
          >
            <div>{vehicle.driver.username}</div>
            <div>{vehicle.status}</div>
            <div>
              <button
                onClick={() => handleUpdateJobStatus(vehicle.job.id, 'accepted')}
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
              >
                Accept Job
              </button>
              <button
                onClick={() => handleUpdateJobStatus(vehicle.job.id, 'completed')}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2'
              >
                Complete Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}