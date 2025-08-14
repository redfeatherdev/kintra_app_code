import { useEffect, useRef, useState } from "react";
import { useTotalStore } from "../../../store/total.store";

const RecentUsers12hCard = () => {
  const countRef = useRef(0);
  const [count, setCount] = useState<number>(0);

  const { recent_users_12h_count } = useTotalStore() as { recent_users_12h_count: number };

  useEffect(() => {
    if (recent_users_12h_count <= 1) {
      setCount(recent_users_12h_count);
      return;
    }

    const increment = Math.ceil(recent_users_12h_count / 100);
    const interval = setInterval(() => {
      if (countRef.current >= recent_users_12h_count) {
        clearInterval(interval);
        setCount(recent_users_12h_count);
      } else {
        countRef.current += increment;
        setCount(Math.min(countRef.current, recent_users_12h_count));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [recent_users_12h_count]);

  return (
    <div className="flex flex-col rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col gap-4 justify-center items-center">
        <span className="text-title-sm font-bold text-black dark:text-white text-center">Accounts Created in last 12 hours ({count})</span>
      </div>
    </div>
  )
}

export default RecentUsers12hCard;