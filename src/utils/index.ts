export const updateHappenedMoreThan1HourAgo = (lastUpdated: Date): boolean => {
    return lastUpdated.getTime() < Date.now() - 1000 * 60 * 60;
  };
  