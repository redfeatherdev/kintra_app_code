import { Button } from 'rizzui';
import { PiPencilThin } from 'react-icons/pi';
import TablePagination from '../UserManagement/UserTable/table-pagination';
import DeleteAdminButton from './DeleteAdminButton';
import EditAdminForm from './EditAdminForm';
import { useDrawer } from '../../store/drawer.store';
import { useAdminStroe } from '../../store/admin.store';
import { Flex } from '../common/Flex';
import { useAuthStore } from '../../store/auth.store';

const AdminTable = ({ fetchData }: { fetchData: () => void }) => {
  const { openDrawer } = useDrawer();
  const { user } = useAuthStore() as { user: any };
  const { loading, count, page, limit, admins, setPage, setLimit } =
    useAdminStroe() as {
      loading: boolean;
      count: number;
      page: number;
      limit: number;
      admins: any[];
      setPage: (page: number) => void;
      setLimit: (limit: number) => void;
    };

  const onPaginationChange = (page: number) => {
    setPage(page);
  };

  const onRowsPerPageChange = (limit: number) => {
    setLimit(limit);
    setPage(1);
  };

  return loading ? (
    <div className="h-[400px] flex justify-center items-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  ) : (
    <div className="mt-8">
      <span className="text-sm text-black dark:text-bodydark font-medium">
        {count} Results Found
      </span>
      <div className="overflow-x-auto mt-3">
        <table className="w-full min-w-[800px] table-fixed text-sm">
          <thead className="border-t border-b border-stroke dark:border-strokedark text-black dark:text-bodydark text-left">
            <tr className="font-medium py-2">
              <th className="pl-3 py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {admins?.map((admin, index) => (
              <tr
                key={index}
                className="border-b border-stroke dark:border-strokedark"
              >
                <td className="pl-3 py-3">{admin?.name}</td>
                <td className="py-3">{admin?.email}</td>
                <td>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      disabled={admin?.email === 'kintr.admin@gmail.com'}
                      type="button"
                      variant="flat"
                      color="danger"
                      className="w-8 h-8 p-1 bg-stroke hover:text-graydark dark:bg-boxdark dark:hover:text-gray"
                      onClick={() =>
                        openDrawer(
                          EditAdminForm,
                          'Edit Admin',
                          'Change admin info',
                          { admin: admin, fetchData },
                        )
                      }
                    >
                      <PiPencilThin className="w-4" />
                    </Button>
                    <DeleteAdminButton
                      disabled={
                        admin?.email === 'kintr.admin@gmail.com' ||
                        admin?.email === user?.email
                      }
                      id={admin.id}
                      fetchData={fetchData}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Flex justify="end" className="mt-6">
        <TablePagination
          pageSize={limit}
          setPageSize={onRowsPerPageChange as any}
          total={count}
          current={page}
          onChange={onPaginationChange}
        />
      </Flex>
    </div>
  );
};

export default AdminTable;
