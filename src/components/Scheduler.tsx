import { useState, useMemo, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSchedule } from "../context/ScheduleContext";
import { ScheduleEvent } from "../types";
import styles from "./Scheduler.module.css";

const Scheduler = () => {
  const { events, details, loading, error } = useSchedule();
  const [popupEvent, setPopupEvent] = useState<ScheduleEvent | null>(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // 팝업이 열릴 때 스크롤 막기
  useEffect(() => {
    if (popupEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [popupEvent]);

  // 날짜별로 이벤트 매핑
  const scheduleMap = useMemo(() => {
    const map: Record<string, ScheduleEvent[]> = {};
    events.forEach(ev => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  // 타입별 여러 스티커 배열로 변경
  const typeStickerMap: Record<
    NonNullable<ScheduleEvent["type"]>,
    { srcs: string[]; classNames: string[] }
  > = {
    공연: {
      srcs: ["/images/calenderSt1.png", "/images/calenderSt5.png"],
      classNames: [styles.performance1, styles.performance2],
    },
    방송: {
      srcs: ["/images/calenderSt7.png", "/images/calenderSt3.png"],
      classNames: [styles.broadcast1, styles.broadcast2],
    },
    팬미팅: {
      srcs: ["/images/calenderSt4.png", "/images/calenderSt8.png", "/images/calenderSt2.png"],
      classNames: [styles.fanmeeting1, styles.fanmeeting2, styles.fanmeeting3],
    },
    팬사인회: {
      srcs: ["/images/calenderSt6.png", "/images/calenderSt2.png"],
      classNames: [styles.fansign1, styles.fansign2],
    },
  
    기타: {
      srcs: ["/images/calenderSt10.png", "/images/calenderSt9.png"],
      classNames: [styles.etc1, styles.etc2],
    },
    컴백: {
      srcs: ["/images/calenderSt10.png", "/images/calenderSt9.png"],
      classNames: [styles.etc1, styles.etc2],
    }
  };

  // 타입별 전체 등장 순서 계산
  const typeGlobalCount: Record<string, number> = {};
  events.forEach(ev => {
    if (!ev.type) return;
    if (!typeGlobalCount[ev.type]) typeGlobalCount[ev.type] = 0;
    typeGlobalCount[ev.type]++;
  });

  // 날짜순 정렬
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  // 각 이벤트의 타입별 순서 인덱스 매핑 (날짜순)
  const eventTypeOrderMap: Record<string, number> = {};
  const typeOrderCounter: Record<string, number> = {};
  sortedEvents.forEach(ev => {
    if (!ev.type) return;
    if (!typeOrderCounter[ev.type]) typeOrderCounter[ev.type] = 0;
    eventTypeOrderMap[ev.id] = typeOrderCounter[ev.type];
    typeOrderCounter[ev.type]++;
  });

  // 로컬 타임존 기준 YYYY-MM-DD 반환
  function getYMD(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function tileContent({ date }: { date: Date }) {
    const ymd = getYMD(date);
    const dayEvents = scheduleMap[ymd];
    if (!dayEvents) return null;

    // 이전 날짜의 마지막 이벤트 타입
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevYmd = getYMD(prevDate);
    const prevDayEvents = scheduleMap[prevYmd];
    const prevLastEventType = prevDayEvents?.[prevDayEvents.length - 1]?.type;

    // 다음 날짜의 첫 번째 이벤트 타입
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextYmd = getYMD(nextDate);
    const nextDayEvents = scheduleMap[nextYmd];
    const nextFirstEventType = nextDayEvents?.[0]?.type;

    return (
      <div className={styles.dayEventList}>
        {dayEvents.map((ev, idx) => {
          if (!ev.type || !typeStickerMap[ev.type]) return null;

          // 첫번째 일정이고 이전 날짜의 마지막 일정 타입과 다를 때
          const isFirst =
            idx === 0 && ev.type !== prevLastEventType;

          // 마지막 일정이고 다음 날짜의 첫 일정 타입과 다를 때
          const isLast =
            idx === dayEvents.length - 1 && ev.type !== nextFirstEventType;

          // 이 이벤트의 타입별 전체 등장 순서
          const order = eventTypeOrderMap[ev.id] ?? 0;
          const stickerArr = typeStickerMap[ev.type].srcs;
          const stickerSrc = stickerArr[order % stickerArr.length];

          return (
            <div
              key={ev.id}
              className={styles.dayEvent}
              onClick={e => {
                e.stopPropagation();
                setPopupEvent(ev);
              }}
            >
              {(isFirst || isLast) && (
                <img
                  src={stickerSrc}
                  alt={ev.type}
                  className={`${styles.stickerImg} ${typeStickerMap[ev.type].classNames[order % typeStickerMap[ev.type].classNames.length]}`}
                  style={{ marginRight: 4, verticalAlign: "middle" }}
                />
              )}
              {ev.title}
            </div>
          );
        })}
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>일정 불러오는 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // 월 이동 함수
  const goToPrevMonth = () => {
    setActiveStartDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };
  const goToNextMonth = () => {
    setActiveStartDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  return (
    <div className={styles.schedulerWrapper}>
      <div className={styles.monthNav}>
        <button className={styles.monthBtnL} onClick={goToPrevMonth} aria-label="이전 달"></button>
        <span className={` ${styles.monthTitle}  main_card_h2`}>
          {activeStartDate.getMonth() + 1}월
        </span>
        <button className={styles.monthBtnR} onClick={goToNextMonth} aria-label="다음 달"></button>
      </div>
      <Calendar
        locale="en-US"
        calendarType="gregory"
        tileContent={tileContent}
        onClickDay={date => {
          const ymd = getYMD(date);
          if (scheduleMap[ymd]) {
            setPopupEvent(scheduleMap[ymd][0]);
          }
        }}
        className={styles.calendar}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setActiveStartDate(activeStartDate);
        }}
        prevLabel={null}
        nextLabel={null}
        navigationLabel={undefined}
      />
      {popupEvent && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <button
              className={styles.popupCloseBtn}
              onClick={() => setPopupEvent(null)}
              aria-label="닫기"
            >
            </button>
            <h3 className={`${styles.popupTitle} h3_tit`}>{popupEvent.title}</h3>
            <div className={styles.popupTop}>
              {details[popupEvent.id]?.imageUrl && (
                <img
                  src={details[popupEvent.id]?.imageUrl}
                  alt={popupEvent.title}
                  className={styles.popupImage}
                />
              )}
              <p className={styles.popupDesc}>
                {details[popupEvent.id]?.description || "상세 내용 없음"}
              </p>
            </div>
            <div className={styles.popupInfoRow}>
              <div className={styles.popupInfo}>
                <div className={styles.popupInfoLabel}>날짜/시간</div>
                <div className={styles.popupInfoValue}>
                  {details[popupEvent.id]?.datetime || "-"}
                </div>
              </div>
              <div className={styles.popupInfo}>
                <div className={styles.popupInfoLabel}>장소</div>
                <div className={styles.popupInfoValue}>
                  {details[popupEvent.id]?.location || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.schedulerInfo}>
        <p className={styles.schedulerInfoText}>
          ※ 원하시는 일정을 클릭하면, 세부 정보를 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default Scheduler;