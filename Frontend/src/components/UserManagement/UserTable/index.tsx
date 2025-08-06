import { Button } from 'rizzui';
import { useNavigate } from 'react-router-dom';

import { FaEye } from 'react-icons/fa6';
import { useUserStore } from '../../../store/user.store';

import Badge from '../../common/Badge';
import TablePagination from './table-pagination';
import DeleteUserButton from './delete-user-button';
import { Flex } from '../../common/Flex';

const UserTable = ({ fetchData }: { fetchData: () => void }) => {
  const { loading, page, limit, count, users, setPage, setLimit } =
    useUserStore() as {
      loading: boolean;
      page: number;
      limit: number;
      count: number;
      users: any[];
      setPage: (page: number) => void;
      setLimit: (limit: number) => void;
    };
  const navigate = useNavigate();

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
        <table className="w-full min-w-[1200px] table-fixed text-sm">
          <thead className="border-t border-b border-stroke dark:border-strokedark text-black dark:text-bodydark text-left">
            <tr className="font-medium py-2">
              <th className="pl-3 py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Gender</th>
              <th className="py-2 font-medium">Age</th>
              <th className="py-2 font-medium">Attractiveness</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(users).map(([userId, userData]: [string, any]) => (
              <tr
                key={userId}
                className="border-b border-stroke dark:border-strokedark"
              >
                <td className="pl-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={userData?.profileImageURL}
                      alt="Profile Image"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {userData?.name}
                  </div>
                </td>
                <td className="py-2">{userData?.email}</td>
                <td className="py-2">{userData?.gender}</td>
                <td className="py-2">{userData?.age}</td>
                <td className="py-2">{userData?.attractiveness}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2.5">
                    <Badge status={userData?.status} />
                    {userData?.status === 1 ? 'Enabled' : 'Disabled'}
                  </div>
                </td>
                <td>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      type="button"
                      variant="flat"
                      className="w-8 h-8 p-1 bg-stroke hover:text-graydark dark:bg-boxdark dark:hover:text-gray"
                      onClick={() => {
                        navigate(`/users/profile/${userId}`, {
                          state: {
                            user: userData,
                          },
                        });
                      }}
                    >
                      <FaEye className="text-[15px]" />
                    </Button>
                    <DeleteUserButton
                      userId={userData.id}
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

export default UserTable;
