import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Modal, Button, Checkbox, Input, Textarea } from 'rizzui';
import { IoIosSend } from 'react-icons/io';
import { useUserStore } from '../../store/user.store';
import FilterModal from './FilterModal';
import AppNotificationModal from './AppNotificationModal';

const SendNotificationModal = ({
  isOpen,
  onClose,
  fetchData,
}: {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
}) => {
  const { users, filteredUsers, setFilteredUsers } = useUserStore() as {
    users: any[];
    filteredUsers: any[];
    setFilteredUsers: (users: any[]) => void;
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);
  const [isCheckedAppNotification, setCheckedAppNotification] =
    useState<boolean>(false);
  const [isOpenAppNotificationModal, setIsOpenAppNotificationModal] =
    useState<boolean>(false);
  const [filters, setFilters] = useState({
    minAge: null,
    maxAge: null,
    region: '',
    longitude: null,
    latitude: null,
    range: null,
    isMale: false,
    isFemale: false,
    userName: '',
    isActiveTopUsers: false,
    percentValue: null,
  });
  const [appNotificationSettings, setAppNotificationSettings] = useState<{
    popupLocation: string;
    popupRedirectPath: string;
    btnColor: { red: number; green: number; blue: number };
    txtColor: { red: number; green: number; blue: number };
    btnText: string;
    text: string;
    textPosition: string;
    imgFile?: File | null;
  }>({
    popupLocation: 'Initialization',
    popupRedirectPath: 'Initialization',
    btnColor: {
      red: 0,
      green: 0,
      blue: 0,
    },
    txtColor: {
      red: 0,
      green: 0,
      blue: 0,
    },
    btnText: '',
    text: '',
    textPosition: 'Top Left',
    imgFile: null,
  });
  const [errors, setErrors] = useState({
    name: '',
    title: '',
    content: '',
  });

  const handleSendNotification = async () => {
    if (name.length === 0)
      setErrors((prev: any) => ({
        ...prev,
        name: 'Name of notification is required',
      }));

    if (title.length === 0)
      setErrors((prev: any) => ({
        ...prev,
        title: 'Title of notification is required',
      }));

    if (content.length === 0)
      setErrors((prev: any) => ({
        ...prev,
        content: 'Content is required',
      }));

    if (filteredUsers.length === 0) {
      toast.error('Total reached users is 0');
    }

    if (
      name.length > 0 &&
      title.length > 0 &&
      content.length > 0 &&
      filteredUsers.length > 0
    ) {
      const allUserIds = filteredUsers.map((user) => user[0]);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('title', title);
      formData.append('content', content);
      formData.append('users', JSON.stringify(allUserIds));
      if (isCheckedAppNotification) {
        const appNotificationSettingsWithoutImgUrl = {
          ...appNotificationSettings,
        };
        delete appNotificationSettingsWithoutImgUrl.imgFile;
        formData.append(
          'appNotificationSettings',
          JSON.stringify(appNotificationSettingsWithoutImgUrl),
        );
      }
      if (appNotificationSettings.imgFile) {
        formData.append('imgFile', appNotificationSettings.imgFile);
      }

      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/add_notification`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        if (res.status === 200) {
          setLoading(false);
          toast.success(res.data.msg);
          onClose();
          setFilters({
            minAge: null,
            maxAge: null,
            region: '',
            longitude: null,
            latitude: null,
            range: null,
            isMale: false,
            isFemale: false,
            userName: '',
            isActiveTopUsers: false,
            percentValue: null,
          });
          setAppNotificationSettings({
            popupLocation: 'Initialization',
            popupRedirectPath: 'Initialization',
            btnColor: {
              red: 0,
              green: 0,
              blue: 0,
            },
            txtColor: {
              red: 0,
              green: 0,
              blue: 0,
            },
            btnText: '',
            text: '',
            textPosition: 'Top Left',
            imgFile: null,
          });
          setFilteredUsers(users);
          setName('');
          setTitle('');
          setContent('');
          setCheckedAppNotification(false);
          fetchData();
        }
      } catch (err: any) {
        toast.error(err.response.data.msg);
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        containerClassName="flex flex-col bg-white dark:bg-boxdark p-6"
        customSize="800px"
      >
        <div className="flex justify-center mb-7">
          <span className="text-2xl font-bold text-black dark:text-white">
            Send Notification
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col gap-3 w-full sm:w-[50%]">
            <Input
              label="Name of Notification"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.length > 0) {
                  setErrors((prev) => ({
                    ...prev,
                    name: '',
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    name: 'Name of notification is required',
                  }));
                }
              }}
              className="[&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
              error={errors.name}
              errorClassName="text-xs text-red-500 ml-2 mt-1"
            />
            <Input
              label="Title of Notification"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.length > 0) {
                  setErrors((prev) => ({
                    ...prev,
                    title: '',
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    title: 'Title of notification is required',
                  }));
                }
              }}
              className="[&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
              error={errors.title}
              errorClassName="text-xs text-red-500 ml-2 mt-1"
            />
            <Textarea
              label="Content"
              rows={3}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value.length > 0) {
                  setErrors((prev) => ({
                    ...prev,
                    content: '',
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    content: 'Content is required',
                  }));
                }
              }}
              className="dark:text-bodydark"
              textareaClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
              error={errors.content}
              errorClassName="text-xs text-red-500 ml-2 mt-1"
            />
            <Button
              className="w-40 text-white hover:bg-primary/90 mt-1"
              onClick={() => {
                setIsOpenFilterModal(true);
              }}
            >
              Filter
            </Button>
            <Checkbox
              label="In App Notification"
              checked={isCheckedAppNotification}
              onChange={() => {
                if (!isCheckedAppNotification) {
                  setIsOpenAppNotificationModal(!isOpenAppNotificationModal);
                }
                setCheckedAppNotification(!isCheckedAppNotification);
              }}
              inputClassName="w-5 h-5"
              iconClassName="text-white w-4 h-4 ml-0.5 mt-0.5"
            />
          </div>
          <div className="w-full sm:w-[50%]">
            <span className="text-sm font-medium dark:text-bodydark">
              Preview
            </span>
            <div className="flex flex-col min-h-[90px] bg-stroke dark:bg-gray-700/80 mt-2 px-5 py-2 rounded-lg">
              <span className="text-lg text-black dark:text-white font-bold">
                {title}
              </span>
              <span className="font-medium mt-1">{content}</span>
            </div>
            <div className="flex justify-end mt-2">
              <span className="font-medium dark:text-bodydark">
                Total User Reached: {filteredUsers ? filteredUsers.length : 0}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8 gap-3">
          <Button
            variant="outline"
            className="border-gray-200 dark:border-form-strokedark hover:text-black dark:hover:text-white px-6"
            onClick={() => {
              onClose();
              setFilteredUsers(users);
            }}
          >
            Cancel
          </Button>
          <Button
            isLoading={loading}
            disabled={!!errors.name || !!errors.title || !!errors.content}
            className="text-white gap-2 hover:bg-primary/90"
            onClick={handleSendNotification}
          >
            <IoIosSend className="text-lg" />
            Send Notification
          </Button>
        </div>
      </Modal>
      <FilterModal
        isOpen={isOpenFilterModal}
        onClose={() => {
          setIsOpenFilterModal(false);
        }}
        filters={filters}
        setFilters={setFilters}
      />
      <AppNotificationModal
        isOpen={isOpenAppNotificationModal}
        onClose={() => {
          setIsOpenAppNotificationModal(false);
        }}
        appNotificationSettings={appNotificationSettings}
        setAppNotificationSettings={setAppNotificationSettings}
      />
    </>
  );
};

export default SendNotificationModal;
