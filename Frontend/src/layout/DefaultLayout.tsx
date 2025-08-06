import React, { useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom'; // Add this import
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { CustomDrawer } from '../components/common/Drawer';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // Add this line
  
  // Check if current route is admin-support
  const isAdminSupport = location.pathname.includes('/admin-support');

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Only show header if not admin support page */}
          {!isAdminSupport && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          
          <main className={isAdminSupport ? 'h-full' : ''}>
            {isAdminSupport ? (
              // For admin support, render children without padding/margins
              children
            ) : (
              // For other pages, use the normal layout
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
                <CustomDrawer />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;



// import React, { useState, ReactNode } from 'react';
// import Header from '../components/common/Header';
// import Sidebar from '../components/common/Sidebar';
// import { CustomDrawer } from '../components/common/Drawer';

// const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="dark:bg-boxdark-2 dark:text-bodydark">
//       {/* <!-- ===== Page Wrapper Start ===== --> */}
//       <div className="flex h-screen overflow-hidden">
//         {/* <!-- ===== Sidebar Start ===== --> */}
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         {/* <!-- ===== Sidebar End ===== --> */}

//         {/* <!-- ===== Content Area Start ===== --> */}
//         <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//           {/* <!-- ===== Header Start ===== --> */}
//           <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           {/* <!-- ===== Header End ===== --> */}

//           {/* <!-- ===== Main Content Start ===== --> */}
//           <main>
//             <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
//               {children}
//               <CustomDrawer />
//             </div>
//           </main>
//           {/* <!-- ===== Main Content End ===== --> */}
//         </div>
//         {/* <!-- ===== Content Area End ===== --> */}
//       </div>
//       {/* <!-- ===== Page Wrapper End ===== --> */}
//     </div>
//   );
// };

// export default DefaultLayout;
