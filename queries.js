import HttpError from '@wasp/core/HttpError.js'

export const getJob = async (args, context) => {
  if (!context.user) throw new HttpError(401);

  const job = await context.entities.Job.findUnique({
    where: { id: args.id },
    include: {
      vehicle: true,
      driver: true
    }
  });

  if (!job) throw new HttpError(400, 'Job not found');

  if (job.driverId !== context.user.id) throw new HttpError(400, 'Job does not belong to you');

  return job;
}

export const getVehicle = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { id } = args;

  const vehicle = await context.entities.Vehicle.findUnique({
    where: { id },
    include: { driver: true, jobs: true }
  });

  if (!vehicle) { throw new HttpError(404, 'No vehicle found with id ' + id) }

  return vehicle;
}