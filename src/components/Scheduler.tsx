import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSchedule } from "../context/ScheduleContext";
import { ScheduleEvent } from "../types";
import styles from "./Scheduler.module.css";

const Scheduler = () => {
  const { events, details, loading, error } = useSchedule();
  const [popupEvent, setPopupEvent] = useState<ScheduleEvent | null>(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // 날짜별로 이벤트 매핑
  const scheduleMap = useMemo(() => {
    const map: Record<string, ScheduleEvent[]> = {};
    events.forEach(ev => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);
  // 스티커 정보 매핑 (날짜별)
  // 1. stickerMap 구조 변경
  const stickerMap: Record<string, { src: string; className: string }> = {
    "2025-06-01": { src: "/images/calenderSt1.png", className: styles.sticker_0601 },
    "2025-06-04": { src: "/images/calenderSt4.png", className: styles.sticker_0604 },
    "2025-06-06": { src: "/images/calenderSt2.png", className: styles.sticker_0606 },
    "2025-06-10": { src: "/images/calenderSt6.png", className: styles.sticker_0610 },
    "2025-06-11": { src: "/images/calenderSt7.png", className: styles.sticker_0611 },
    "2025-06-14": { src: "/images/calenderSt5.png", className: styles.sticker_0614 },
    "2025-06-19": { src: "/images/calenderSt8.png", className: styles.sticker_0619 },
    "2025-06-24": { src: "/images/calenderSt3.png", className: styles.sticker_0624 },
    "2025-06-27": { src: "/images/calenderSt9.png", className: styles.sticker_0627 },
    "2025-06-28": { src: "/images/calenderSt10.png", className: styles.sticker_0628 },
  };

  // 각 셀에 일정 표시
  function tileContent({ date }: { date: Date }) {

    const stickerClassMap: Record<string, string> = {
      "0601": styles.sticker_0601,
      "0604": styles.sticker_0604,
      "0606": styles.sticker_0606,
      "0610": styles.sticker_0610,
      "0611": styles.sticker_0611,
      "0614": styles.sticker_0614,
      "0619": styles.sticker_0619,
      "0624": styles.sticker_0624,
      "0627": styles.sticker_0627,
      "0628": styles.sticker_0628,
    };

    const ymd = date.toISOString().slice(0, 10);
    const stickerObj = stickerMap[ymd];
    const dayEvents = scheduleMap[ymd];
    if (!dayEvents) return null;
    return (
      <div className={styles.dayEventList}>
        {stickerObj && (
          <img
            src={stickerObj.src}
            alt="스티커"
            className={`${styles.stickerImg} ${stickerObj.className}`}
          />
        )}
        {dayEvents.map(ev => (
          <div
            key={ev.id}
            className={styles.dayEvent}
            onClick={e => {
              e.stopPropagation();
              setPopupEvent(ev);
            }}
          >
            {ev.title}
          </div>
        ))}
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
          const ymd = date.toISOString().slice(0, 10);
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
              ×
            </button>
            <h3 className={styles.popupTitle}>{popupEvent.title}</h3>
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
            <div className={styles.popupInfoRow}>
              <div>
                <div className={styles.popupInfoLabel}>날짜/시간</div>
                <div className={styles.popupInfoValue}>
                  {details[popupEvent.id]?.datetime || "-"}
                </div>
              </div>
              <div>
                <div className={styles.popupInfoLabel}>장소</div>
                <div className={styles.popupInfoValue}>
                  {details[popupEvent.id]?.location || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;