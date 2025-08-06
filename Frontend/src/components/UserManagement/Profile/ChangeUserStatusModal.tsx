import React, { useState } from "react";
import { Modal, Button } from "rizzui";
import { toast } from "sonner";
import axios from "axios";
import { TbInfoTriangle } from "react-icons/tb";

const ChangeUserStatusModal = ({ isOpen, onClose, user, setUser }: {
  isOpen: boolean,
  onClose: () => void,
  user: any,
  setUser: React.Dispatch<React.SetStateAction<any>>
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/change_status/${user?.userId}`,
        { status: user.status }
      );
      if (res.status === 200) {
        toast.success(res.data.msg);
        setLoading(false);
        onClose();
        setTimeout(() => {
          setUser(res.data.user);
        }, 500);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="bg-white rounded-md p-6 transition duration-150 ease-in-out dark:bg-boxdark"
      >
        <div className="flex gap-4">
          <div className={`rounded-full w-11 h-11 flex justify-center items-center ${user?.status === 1 ? 'bg-red-200' : 'bg-green-200'}`}>
            <TbInfoTriangle className={`${user?.status === 1 ? 'text-red-600' : 'text-green-600'} text-xl`} />
          </div>
          <div className="flex flex-col grow">
            <span className="text-lg text-black font-semibold dark:text-white">{user?.status === 1 ? 'Disable' : 'Enable'} User</span>
            <span>Are you sure want to {user?.status === 1 ? 'disable' : 'enable'} this user?</span>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="submit"
                className={`text-black dark:text-white bg-white dark:bg-boxdark border-stroke dark:border-strokedark hover:bg-gray-50 hover:dark:bg-boxdark-2 shadow-sm`}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                className={` text-white hover:opacity-90 ${user?.status === 1 ? 'bg-red-600 hover:dark:bg-red-700' : 'bg-green-600 hover:dark:bg-green-700'}`}
                onClick={handleChangeStatus}
              >
                {user?.status === 1 ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ChangeUserStatusModal;