import { useEffect } from 'react';

import axios from 'axios';
import { Input } from 'rizzui';
import { RiSearchLine } from 'react-icons/ri';

import UserTable from '../../components/UserManagement/UserTable';
import { useUserStore } from '../../store/user.store';

const AccountOverview = () => {
  const { page, limit, search, setLoading, setSearch, setCount, setUsers } =
    useUserStore() as {
      loading: boolean;
      page: number;
      limit: number;
      count: number;
      search: string;
      setLoading: (state: boolean) => void;
      setSearch: (search: string) => void;
      setCount: (count: number) => void;
      setUsers: (users: any[]) => void;
    };

  const fetchData = async (searchQuery = search) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/get_paginated_users`,
        {
          params: { search: searchQuery, page, limit },
        },
      );

      if (res.status === 200) {
        setUsers(res.data.users);
        setCount(res.data.count);
      }
    } catch (err: any) {
      console.error('Error fetching data: ', err);
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
            Account Overview
          </span>
          <span className="text-sm">View and manage all users</span>
        </div>
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
          placeholder="Search users"
          className="w-full sm:w-auto lg:w-80 3xl:w-96 [&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
          inputClassName="border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark"
        />
      </form>
      <UserTable fetchData={fetchData} />
    </div>
  );
};

export default AccountOverview;
