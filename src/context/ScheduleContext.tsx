import React, { createContext, useContext, useEffect, useState } from "react";
import { ScheduleEvent, ScheduleDetail } from "../types";

interface ScheduleContextType {
  events: ScheduleEvent[];
  details: Record<string, ScheduleDetail>;
  loading: boolean;
  error: string | null;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [details, setDetails] = useState<Record<string, ScheduleDetail>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 두 개의 json을 병렬로 fetch
    Promise.all([
      fetch("/data/schedule.json").then(res => res.json()),
      fetch("/data/scheduleDetail.json").then(res => res.json())
    ])
      .then(([eventsData, detailsData]) => {
        setEvents(eventsData);
        // detailsData를 id로 매핑
        const detailMap: Record<string, ScheduleDetail> = {};
        detailsData.forEach((d: ScheduleDetail) => {
          detailMap[d.id] = d;
        });
        setDetails(detailMap);
      })
      .catch(() => setError("일정 데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScheduleContext.Provider value={{ events, details, loading, error }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error("useSchedule must be used within a ScheduleProvider");
  return ctx;
};