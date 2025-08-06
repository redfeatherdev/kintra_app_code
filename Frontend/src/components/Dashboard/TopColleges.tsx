import { useTotalStore } from "../../store/total.store";

const TopColleges = () => {
  const { top_colleges } = useTotalStore() as { top_colleges: { college: string, user_count: number }[] }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="w-[60%]">
          <span className="text-lg font-semibold text-black dark:text-white">Kintr Hubs Colleges</span>
        </div>
        <div className="w-[40%]">
          <span className="text-lg font-semibold text-black dark:text-white">User Counts</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {top_colleges?.map((college, index) => (
          <div key={index} className="flex flex-row">
            <div className="w-[60%] px-3">
              <span>{college?.college}</span>
            </div>
            <div className="w-[40%] px-3">
              <span>{college?.user_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopColleges;