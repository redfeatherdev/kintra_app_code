import { useEffect } from 'react';
import axios from 'axios';
import { Button, Input } from 'rizzui';
import { useAdminStroe } from '../../store/admin.store';
import { GoPlus } from 'react-icons/go';
import { RiSearchLine } from 'react-icons/ri';
import { toast } from 'sonner';
import { useDrawer } from '../../store/drawer.store';
import AdminTable from '../../components/Admin/AdminTable';
import CreateAdminForm from '../../components/Admin/CreateAdminForm';

const AdminMangement = () => {
  const { openDrawer } = useDrawer();
  const { search, page, limit, setLoading, setSearch, setCount, setAdmins } =
    useAdminStroe() as {
      search: string;
      page: number;
      limit: number;
      setLoading: (state: boolean) => void;
      setSearch: (search: string) => void;
      setCount: (count: number) => void;
      setAdmins: (admins: any[]) => void;
    };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/get_admins`,
        {
          params: {
            search,
            page,
            limit,
          },
        },
      );
      if (res.status === 200) {
        setAdmins(res.data.admins);
        setCount(res.data.count);
      }
    } catch (err: any) {
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
            Admin Management
          </span>
          <span className="text-sm">View and manage all admins</span>
        </div>
        <Button
          className="text-white bg-primary hover:bg-primary/95 gap-1.5"
          onClick={() => {
            openDrawer(CreateAdminForm, 'Create User', 'Create a new user', {
              fetchData,
            });
          }}
        >
          <GoPlus className="w-5 h-5" />
          Create User
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
          placeholder="Search admins"
          className="w-full sm:w-auto lg:w-80 3xl:w-96 [&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
          inputClassName="border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark"
        />
      </form>
      <AdminTable fetchData={fetchData} />
    </div>
  );
};

export default AdminMangement;
