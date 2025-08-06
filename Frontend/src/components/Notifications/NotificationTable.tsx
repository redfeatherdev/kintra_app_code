import { Flex } from '../common/Flex';
import TablePagination from '../UserManagement/UserTable/table-pagination';
import DeleteNotificationButton from './DeleteNotificationButton';
import { useNotificationStore } from '../../store/notification.store';

const NotificationTable = ({ fetchData }: { fetchData: () => void }) => {
  const { loading, page, limit, count, notifications, setPage, setLimit } =
    useNotificationStore() as {
      loading: boolean;
      page: number;
      limit: number;
      count: number;
      notifications: any[];
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
              <th className="py-2 font-medium">Title</th>
              <th className="py-2 font-medium">Content</th>
              <th className="py-2 font-medium">Total User Received</th>
              <th className="py-2 font-medium">Seen Users</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(notifications).map(
              ([notificationId, notificationData]: [string, any]) => (
                <tr
                  key={notificationId}
                  className="border-b border-stroke dark:border-strokedark"
                >
                  <td className="pl-3 py-3">
                    <div className="flex items-center gap-2.5">
                      {notificationData?.name}
                    </div>
                  </td>
                  <td className="py-3">{notificationData?.title}</td>
                  <td className="py-3">{notificationData?.content}</td>
                  <td className="py-3">
                    {Object.entries(notificationData.seen).length}
                  </td>
                  <td className="py-3">
                    {
                      Object.entries(notificationData.seen).filter(
                        ([_, value]) => value === true,
                      ).length
                    }
                  </td>
                  <td>
                    <div className="flex justify-end items-center gap-1.5">
                      <DeleteNotificationButton
                        notificationId={notificationData.id}
                        fetchData={fetchData}
                      />
                    </div>
                  </td>
                </tr>
              ),
            )}
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

export default NotificationTable;
