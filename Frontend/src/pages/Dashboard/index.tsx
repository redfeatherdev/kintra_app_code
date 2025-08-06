import { useEffect } from "react";
import axios from 'axios';

import UserMap from "../../components/Dashboard/UserMap";
import TotalUsersCard from "../../components/Dashboard/Card/TotalUsersCard";
import TopLocationsCard from "../../components/Dashboard/Card/TopLocationsCard";
import TopCollegesCard from "../../components/Dashboard/Card/TopCollegesCard";
import RecentUsers12hCard from "../../components/Dashboard/Card/RecentUsers12hCard";
import RecentUsers4hCard from "../../components/Dashboard/Card/RecentUsers4hCard";
import Loader from "../../components/common/Loader";
import { useTotalStore } from "../../store/total.store";
import { useState } from 'react'; // Add useState to existing import
import SupportChatWidget from '../SupportChat/SupportChat'; // Adjust path as needed
import { AdminSupportSidebar } from '../Events/AdminSupportSidebar'; // Adjust path as needed

const Dashboard = () => {
  const { loading, setLoading, setTotalCount, setLocations, setGainedUser, setTopLocations, setTopColleges, setRecentUsers12hCount, setRecentUsers4hCount } = useTotalStore() as {
    loading: boolean,
    setLoading: (state: boolean) => void,
    setTotalCount: (count: number) => void,
    setLocations: (locations: { id: string; latitude: number; longitude: number }[]) => void,
    setTopLocations: (top_locations: { name: string, user_count: number }[]) => void,
    setTopColleges: (top_colleges: { college: string, user_count: number }[]) => void,
    setRecentUsers12hCount: (recent_users_12h_count: number) => void,
    setRecentUsers4hCount: (recent_users_4h_count: number) => void
    setGainedUser: (users: {
      last_week: { [key: string]: number };
      last_month: { [key: string]: number };
      last_4_months: { [key: string]: number };
      last_6_months: { [key: string]: number };
      last_year: { [key: string]: number };
    }) => void
  }

  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
const [currentUser] = useState('bypass@dev.com'); // Get from your auth context/store
const [isAdmin] = useState(true); // Get from your user permissions/auth store
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [locationRes, totalUserRes, topLocationsRes, topCollegesRes, recentUsersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user_locations`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/total_users`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/top_locations`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/top_colleges`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/recent_accounts`),
        ]);

        if (locationRes.status === 200) {
          setLocations(locationRes.data.locations);
        }

        if (totalUserRes.status === 200) {
          setTotalCount(totalUserRes.data.total_users);
          setGainedUser(totalUserRes.data.gained_user);
        }

        if (topLocationsRes.status === 200) {
          setTopLocations(topLocationsRes.data.top_locations);
        }

        if (topCollegesRes.status === 200) {
          setTopColleges(topCollegesRes.data.top_colleges);
        }

        if (recentUsersRes.status === 200) {
          setRecentUsers12hCount(recentUsersRes.data.recent_users_12h_count);
          setRecentUsers4hCount(recentUsersRes.data.recent_users_4h_count);
        }
      } catch (err: any) {
        console.error('Error fetching data: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

return (
  loading ? <Loader /> :
    <>
      <div className="mb-3">
        <span className="text-xl font-bold text-black dark:text-white">Total user statistics</span>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-9 h-[75vh]">
          <UserMap />
        </div>
        <div className="col-span-12 xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-1">
          <div className="flex flex-col gap-3">
            <TotalUsersCard />
            <TopLocationsCard />
            <TopCollegesCard />
            <RecentUsers12hCard />
            <RecentUsers4hCard />
          </div>
        </div>
      </div>

      {/* Support Chat Widget - Always visible for all users */}
      <SupportChatWidget currentUser={currentUser} />

      {/* Admin Support Sidebar - Only for admins */}
      {isAdmin && (
        <AdminSupportSidebar 
          isOpen={isAdminSidebarOpen}
          onClose={() => setIsAdminSidebarOpen(false)}
        />
      )}
    </>
)
}

export default Dashboard;

















// import { useEffect } from "react";
// import axios from 'axios';

// import UserMap from "../../components/Dashboard/UserMap";
// import TotalUsersCard from "../../components/Dashboard/Card/TotalUsersCard";
// import TopLocationsCard from "../../components/Dashboard/Card/TopLocationsCard";
// import TopCollegesCard from "../../components/Dashboard/Card/TopCollegesCard";
// import RecentUsers12hCard from "../../components/Dashboard/Card/RecentUsers12hCard";
// import RecentUsers4hCard from "../../components/Dashboard/Card/RecentUsers4hCard";
// import Loader from "../../components/common/Loader";
// import { useTotalStore } from "../../store/total.store";

// const Dashboard = () => {
//   const { loading, setLoading, setTotalCount, setLocations, setGainedUser, setTopLocations, setTopColleges, setRecentUsers12hCount, setRecentUsers4hCount } = useTotalStore() as {
//     loading: boolean,
//     setLoading: (state: boolean) => void,
//     setTotalCount: (count: number) => void,
//     setLocations: (locations: { id: string; latitude: number; longitude: number }[]) => void,
//     setTopLocations: (top_locations: { name: string, user_count: number }[]) => void,
//     setTopColleges: (top_colleges: { college: string, user_count: number }[]) => void,
//     setRecentUsers12hCount: (recent_users_12h_count: number) => void,
//     setRecentUsers4hCount: (recent_users_4h_count: number) => void
//     setGainedUser: (users: {
//       last_week: { [key: string]: number };
//       last_month: { [key: string]: number };
//       last_4_months: { [key: string]: number };
//       last_6_months: { [key: string]: number };
//       last_year: { [key: string]: number };
//     }) => void
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [locationRes, totalUserRes, topLocationsRes, topCollegesRes, recentUsersRes] = await Promise.all([
//           axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user_locations`),
//           axios.get(`${import.meta.env.VITE_API_URL}/api/v1/total_users`),
//           axios.get(`${import.meta.env.VITE_API_URL}/api/v1/top_locations`),
//           axios.get(`${import.meta.env.VITE_API_URL}/api/v1/top_colleges`),
//           axios.get(`${import.meta.env.VITE_API_URL}/api/v1/recent_accounts`),
//         ]);

//         if (locationRes.status === 200) {
//           setLocations(locationRes.data.locations);
//         }

//         if (totalUserRes.status === 200) {
//           setTotalCount(totalUserRes.data.total_users);
//           setGainedUser(totalUserRes.data.gained_user);
//         }

//         if (topLocationsRes.status === 200) {
//           setTopLocations(topLocationsRes.data.top_locations);
//         }

//         if (topCollegesRes.status === 200) {
//           setTopColleges(topCollegesRes.data.top_colleges);
//         }

//         if (recentUsersRes.status === 200) {
//           setRecentUsers12hCount(recentUsersRes.data.recent_users_12h_count);
//           setRecentUsers4hCount(recentUsersRes.data.recent_users_4h_count);
//         }
//       } catch (err: any) {
//         console.error('Error fetching data: ', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     loading ? <Loader /> :
//       <>
//         <div className="mb-3">
//           <span className="text-xl font-bold text-black dark:text-white">Total user statistics</span>
//         </div>
//         <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
//           <div className="col-span-12 xl:col-span-9 h-[75vh]">
//             <UserMap />
//           </div>
//           <div className="col-span-12 xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-1">
//             <div className="flex flex-col gap-3">
//               <TotalUsersCard />
//               <TopLocationsCard />
//               <TopCollegesCard />
//               <RecentUsers12hCard />
//               <RecentUsers4hCard />
//             </div>
//           </div>
//         </div>
//       </>
//   )
// }

// export default Dashboard;