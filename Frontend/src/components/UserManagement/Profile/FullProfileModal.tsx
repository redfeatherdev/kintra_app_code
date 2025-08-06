import { Modal } from "rizzui";

const FullProfileModal = ({ isOpen, onClose, user }: {
  isOpen: boolean,
  onClose: () => void,
  user: any
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div
        className="bg-white rounded-md p-6 transition duration-150 ease-in-out dark:bg-boxdark"
      >
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-semibold text-black dark:text-white mb-2">{user?.name}</span>
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-black dark:text-white font-semibold">Email: </span>
              <span className="dark:text-bodydark">{user?.email}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Phone: </span>
              <span className="dark:text-bodydark">{user?.phoneNumber}</span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-black dark:text-white font-semibold">Gender: </span>
              <span className="dark:text-bodydark">{user?.gender}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Gender Interest: </span>
              <span className="dark:text-bodydark">{user?.genderInterest}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Age: </span>
              <span className="dark:text-bodydark">{user?.age}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Height: </span>
              <span className="dark:text-bodydark">{user?.height}</span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-black dark:text-white font-semibold">Birthday: </span>
              <span className="dark:text-bodydark">{new Date(user?.birthday).getFullYear()}/{new Date(user?.birthday).getMonth() + 1}/{new Date(user?.birthday).getDate()}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Bio: </span>
              <span className="dark:text-bodydark">{user?.bio}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Famous: </span>
              <span className="dark:text-bodydark">{user?.famous}</span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-black dark:text-white font-semibold">Skin Color: </span>
              <span className="dark:text-bodydark">{user?.skinColor}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Hair Color: </span>
              <span className="dark:text-bodydark">{user?.hairColor}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Attractiveness: </span>
              <span className="dark:text-bodydark">{user?.attractiveness}</span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-black dark:text-white font-semibold">Job Title: </span>
              <span className="dark:text-bodydark">{user?.jobTitle}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Job Prominence: </span>
              <span className="dark:text-bodydark">{user?.jobProminence}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Yearly Income: </span>
              <span className="dark:text-bodydark">{user?.yearlyIncome}</span>
            </div>
          </div>
          <div>
            <span className="text-black dark:text-white font-semibold">Hobbies: </span>
            <span className="dark:text-bodydark">{user?.hobbies?.join(', ')}</span>
          </div>
          <div>
            <span className="text-black dark:text-white font-semibold">Important Traits: </span>
            <span className="dark:text-bodydark">{user?.importantTraits?.join(', ')}</span>
          </div>
          <div>
            <div>
              <span className="text-black dark:text-white font-semibold">College: </span>
              <span className="dark:text-bodydark">{user?.collegeOrSchool}</span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div>
              <span className="text-black dark:text-white font-semibold">Latitude: </span>
              <span className="dark:text-bodydark">{user?.livesIn?.latitude}</span>
            </div>
            <div>
              <span className="text-black dark:text-white font-semibold">Longitude: </span>
              <span className="dark:text-bodydark">{user?.livesIn?.longitude}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FullProfileModal;