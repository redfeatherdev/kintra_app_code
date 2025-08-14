import { Modal } from "rizzui";

import TopColleges from "../TopColleges";

const TopCollegesExpandModal = ({ isOpen, onClose }: {
  isOpen: boolean,
  onClose: () => void
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div
        className="bg-white rounded-md p-6 transition duration-150 ease-in-out dark:bg-boxdark"
      >
        <TopColleges />
      </div>
    </Modal>
  )
}

export default TopCollegesExpandModal;