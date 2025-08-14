import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Button, Modal, Popover } from 'rizzui';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const DeleteAdminButton = ({
  id,
  disabled,
  fetchData,
}: {
  id: string;
  disabled: boolean;
  fetchData: () => void;
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const isExtraSmall = useMediaQuery('(max-width:424px )');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/delete_admin/${id}`,
      );
      if (res.status === 200) {
        toast.success(res.data.msg);
        isModalOpen && setIsModalOpen(false);
        setLoading(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.response.data.msg);
    }
  };

  if (isExtraSmall) {
    return (
      <>
        <Button
          type="button"
          variant="flat"
          color="danger"
          disabled={disabled}
          className="w-8 h-8 p-1 text-red-600 bg-red-100 hover:bg-red-200/70 dark:hover:bg-red-200/70"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <TrashIcon className="w-4" />
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          containerClassName="bg-white dark:bg-boxdark p-4"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-black dark:text-white">
              Delete Admin?
            </span>
            <span className="text-sm mt-2">
              Are you sure want to delete this admin?
            </span>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              className="dark:border dark:border-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="flat"
              color="danger"
              className=" text-red-600 bg-red-100 hover:bg-red-200/70 dark:hover:bg-red-200/70"
              isLoading={isLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="left">
      <Popover.Trigger>
        <Button
          aria-label="Delete Notification Button"
          color="danger"
          variant="flat"
          disabled={disabled}
          className="w-8 h-8 p-1 text-red-600 bg-red-100 hover:bg-red-200/70 dark:hover:bg-red-200/70"
        >
          <TrashIcon className="w-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="dark:bg-boxdark border-none">
        {({ setOpen }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-black dark:text-white mb-2">
              Delete admin?
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this admin?
            </span>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                className="border border-gray-200 dark:border-gray-700"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="flat"
                className="bg-red-100 hover:bg-red-200/70 dark:hover:bg-red-200/90 text-red-600"
                isLoading={isLoading}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};

export default DeleteAdminButton;
