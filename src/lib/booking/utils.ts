export const isPastAvailabilitySlot = (
  slot: { startTime: string; endTime: string },
  referenceTime = new Date(),
) => {
  return new Date(slot.endTime).getTime() <= referenceTime.getTime();
};
