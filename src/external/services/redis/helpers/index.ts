export function hasBeenMoreThanOneHour(givenDate: Date): boolean {
  const parsedGivenDate = new Date(givenDate);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - parsedGivenDate.getTime();

  const oneHourInMilliseconds = 60 * 60 * 1000; // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds

  return timeDifference > oneHourInMilliseconds;
}