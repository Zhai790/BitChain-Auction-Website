import { useEffect, useState } from 'react';

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useCountdown(endTime: string | Date | null): TimeRemaining {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => {
    if (!endTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const now = Date.now();
    // If endTime is a string of digits (unix timestamp), parse it as a number
    const end =
      typeof endTime === 'string' && /^\d+$/.test(endTime)
        ? parseInt(endTime, 10)
        : new Date(endTime).getTime();

    if (isNaN(end)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const difference = end - now;

    if (difference <= 0) {
      console.log('Auction already expired');
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  });

  useEffect(() => {
    if (!endTime) {
      setTimeRemaining({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      });
      return;
    }

    const calculateTimeRemaining = (): TimeRemaining => {
      const now = Date.now();
      // If endTime is a string of digits (unix timestamp), parse it as a number
      const end =
        typeof endTime === 'string' && /^\d+$/.test(endTime)
          ? parseInt(endTime, 10)
          : new Date(endTime).getTime();
      const difference = end - now;

      if (isNaN(end)) {
        console.error('Invalid date in interval:', endTime);
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isExpired: false };
    };

    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining();
      setTimeRemaining(newTime);

      if (newTime.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeRemaining;
}
