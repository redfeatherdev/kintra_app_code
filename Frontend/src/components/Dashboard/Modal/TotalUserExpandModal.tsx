import { Modal } from "rizzui";

import GainedUser from "../GainedUser";

const TotalUserExpandModal = ({ isOpen, onClose }: {
  isOpen: boolean,
  onClose: () => void
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div
        className="bg-white rounded-md p-6 transition duration-150 ease-in-out dark:bg-boxdark"
      >
        <GainedUser />
      </div>
    </Modal>
  )
}

export default TotalUserExpandModal;