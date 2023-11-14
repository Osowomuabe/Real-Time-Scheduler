import HttpError from '@wasp/core/HttpError.js'

export const createJob = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { pickupLocation, dropoffLocation, pickupTime, dropoffTime } = args;

  const vehicle = await context.entities.Vehicle.findFirst({
    where: { status: "available" },
    orderBy: { currentLocation: "asc" }
  });

  if (!vehicle) { throw new HttpError(400, "No available vehicles") };

  const createdJob = await context.entities.Job.create({
    data: {
      description: "Transport job",
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
      status: "assigned",
      vehicle: { connect: { id: vehicle.id } }
    }
  });

  await context.entities.Vehicle.update({
    where: { id: vehicle.id },
    data: { status: "busy" }
  });

  return createdJob;
}

export const updateJobStatus = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const job = await context.entities.Job.findUnique({
    where: { id: args.id }
  });
  if (!job) { throw new HttpError(404, 'Job not found') };

  const { status } = args;
  if (status !== 'accepted' && status !== 'completed' && status !== 'cancelled') {
    throw new HttpError(400, 'Invalid status')
  };

  return context.entities.Job.update({
    where: { id: args.id },
    data: { status }
  });
}

export const updateVehicleStatus = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const vehicle = await context.entities.Vehicle.findUnique({
    where: { id: args.vehicleId }
  });

  return context.entities.Vehicle.update({
    where: { id: args.vehicleId },
    data: { status: args.status, currentLocation: args.currentLocation }
  });
}