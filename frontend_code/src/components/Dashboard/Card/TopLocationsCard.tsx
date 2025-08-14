import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import TopLocationsExpandModal from '../Modal/TopLocationsExpandModal'

const TopLocationsCard = () => {
  const [isOpenExpandModal, setIsOpenExpandModal] = useState<boolean>(false);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center gap-4">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <CiLocationOn className="w-6 h-6 fill-primary" />
        </div>
        <div>
          <span className="text-title-md font-bold text-black dark:text-white">Top Locations</span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-end">
        <div
          className="flex items-center gap-1 text-sm font-medium text-meta-5 hover:underline hover:cursor-pointer"
          onClick={() => { setIsOpenExpandModal(true) }}
        >
          See Locations
        </div>
      </div>

      <TopLocationsExpandModal isOpen={isOpenExpandModal} onClose={() => { setIsOpenExpandModal(false) }} />
    </div>
  )
}

export default TopLocationsCard;