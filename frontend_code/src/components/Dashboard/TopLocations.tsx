import { useTotalStore } from "../../store/total.store";

const TopLocations = () => {
  const { top_locations } = useTotalStore() as { top_locations: { name: string, user_count: number }[] }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="w-1/2">
          <span className="text-lg font-semibold text-black dark:text-white">Kintr Hubs City</span>
        </div>
        <div className="w-1/2">
          <span className="text-lg font-semibold text-black dark:text-white">User Counts</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {top_locations?.map((location, index) => (
          <div key={index} className="flex flex-row">
            <div className="w-1/2 px-3">
              <span>{location?.name}</span>
            </div>
            <div className="w-1/2 px-3">
              <span>{location?.user_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopLocations;