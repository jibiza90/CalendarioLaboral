"use client";

import { useState, useMemo, useCallback } from "react";

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function useCalendar(initialDate: Date = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthLabel = useMemo(() => {
    return new Date(year, month).toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  }, [month, year]);

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [month, year]);

  const firstDayOfMonth = useMemo(() => {
    // 0 = Sunday, 1 = Monday, etc. Convert to 0 = Monday for display
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [month, year]);

  const days = useMemo<CalendarDay[]>(() => {
    const today = new Date();
    const daysArray: CalendarDay[] = [];

    // Previous month days to fill the first week
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      daysArray.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      daysArray.push({
        day,
        month,
        year,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month days to fill the last week
    const remainingDays = 42 - daysArray.length; // 6 rows * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      daysArray.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return daysArray;
  }, [daysInMonth, firstDayOfMonth, month, year]);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newMonth = prev.getMonth() - 1;
      return new Date(prev.getFullYear(), newMonth, 1);
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newMonth = prev.getMonth() + 1;
      return new Date(prev.getFullYear(), newMonth, 1);
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  const selectDate = useCallback((day: number, monthIdx: number, yearVal: number) => {
    setSelectedDate(new Date(yearVal, monthIdx, day));
    if (monthIdx !== month) {
      setCurrentDate(new Date(yearVal, monthIdx, 1));
    }
  }, [month]);

  const isSelectedDate = useCallback((day: number, monthIdx: number, yearVal: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === monthIdx &&
      selectedDate.getFullYear() === yearVal
    );
  }, [selectedDate]);

  return {
    currentDate,
    selectedDate,
    month,
    year,
    monthLabel,
    days,
    daysInMonth,
    firstDayOfMonth,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    isSelectedDate,
    setCurrentDate,
    setSelectedDate,
  };
}
