import { useState } from "react";
import { LiaUniversitySolid } from "react-icons/lia";
import TopCollegesExpandModal from "../Modal/TopCollegesExpandModal";

const TopCollegesCard = () => {
  const [isOpenExpandModal, setIsOpenExpandModal] = useState<boolean>(false);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center gap-4">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <LiaUniversitySolid className="w-6.5 h-6.5 fill-primary" />
        </div>
        <div>
          <span className="text-title-md font-bold text-black dark:text-white">Top Colleges</span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-end">
        <div
          className="flex items-center gap-1 text-sm font-medium text-meta-5 hover:underline hover:cursor-pointer"
          onClick={() => { setIsOpenExpandModal(true) }}
        >
          See Colleges
        </div>
      </div>

      <TopCollegesExpandModal isOpen={isOpenExpandModal} onClose={() => { setIsOpenExpandModal(false) }} />
    </div>
  )
}

export default TopCollegesCard;