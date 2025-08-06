import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input } from 'rizzui';
import { IoIosSend } from 'react-icons/io';
import { RiSearchLine } from 'react-icons/ri';
import { toast } from 'sonner';
import { useUserStore } from '../../store/user.store';
import SendNotificationModal from '../../components/Notifications/SendNotificationModal';
import NotificationTable from '../../components/Notifications/NotificationTable';
import { useNotificationStore } from '../../store/notification.store';

const Notifications = () => {
  const {
    page,
    limit,
    search,
    setLoading,
    setSearch,
    setCount,
    setNotifications,
  } = useNotificationStore() as {
    page: number;
    limit: number;
    search: string;
    setLoading: (state: boolean) => void;
    setSearch: (search: string) => void;
    setCount: (count: number) => void;
    setNotifications: (notifications: any[]) => void;
  };
  const { setUsers, setFilteredUsers, setRegions } = useUserStore() as {
    setUsers: (users: any) => void;
    setFilteredUsers: (users: any) => void;
    setRegions: (regions: any) => void;
  };
  const [isOpenNotificationModal, setIsOpenNotificationModal] =
    useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, regionRes, notificationRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_users`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_regions`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_notifications`, {
          params: {
            search,
            page,
            limit,
          },
        }),
      ]);

      if (userRes.status === 200) {
        setUsers(Object.entries(userRes.data.users));
        setFilteredUsers(Object.entries(userRes.data.users));
      }

      if (regionRes.status === 200) {
        setRegions(regionRes.data.regions);
      }

      if (notificationRes.status === 200) {
        setNotifications(notificationRes.data.notifications);
        setCount(notificationRes.data.count);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <span className="font-medium text-black text-xl dark:text-bodydark">
            Notifications
          </span>
          <span className="text-sm">View and manage all notifications</span>
        </div>
        <Button
          className="text-white bg-primary hover:bg-primary/95 gap-1.5"
          onClick={() => {
            setIsOpenNotificationModal(true);
          }}
        >
          <IoIosSend className="w-5 h-5" />
          Send Notification
        </Button>
      </div>
      <div className="border-b border-stroke dark:border-strokedark mt-8 mb-6" />
      <form className="w-full flex items-center gap-3">
        <Input
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          prefix={<RiSearchLine size={16} className="text-steel-500 w-8" />}
          autoComplete="off"
          placeholder="Search notifications"
          className="w-full sm:w-auto lg:w-80 3xl:w-96 [&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
          inputClassName="border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark"
        />
      </form>
      <NotificationTable fetchData={fetchData} />
      <SendNotificationModal
        isOpen={isOpenNotificationModal}
        onClose={() => {
          setIsOpenNotificationModal(false);
        }}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Notifications;
