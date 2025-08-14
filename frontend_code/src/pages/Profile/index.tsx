import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';

import { FaPencil, FaEye } from 'react-icons/fa6';
import { RiUserSettingsLine } from 'react-icons/ri';

import { useDrawer } from '../../store/drawer.store';
import FullProfileModal from '../../components/UserManagement/Profile/FullProfileModal';
import ChangeUserStatusModal from '../../components/UserManagement/Profile/ChangeUserStatusModal';
import { EditUserForm } from '../../components/UserManagement/Profile/EditUserForm';

const Profile = () => {
  const location = useLocation();
  const user = location.state.user;
  const { openDrawer } = useDrawer();

  const [userData, setUserData] = useState({ ...user });
  const [isOpenFullProfileModal, setOpenFullProfileModal] =
    useState<boolean>(false);
  const [isOpenStatusModal, setOpenStatusModal] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-medium text-black text-xl dark:text-bodydark">
            Profile
          </span>
          <span className="text-sm">View user profile in detail</span>
        </div>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link
                className="font-medium text-black text-sm dark:text-bodydark"
                to="/users"
              >
                Account Overview
              </Link>
            </li>
            <span>/</span>
            <li className="font-medium text-primary text-sm">Profile</li>
          </ol>
        </nav>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6 px-6 py-8 flex flex-col">
        <div className="flex flex-col items-center gap-4">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            showArrows={false}
            autoPlay={true}
            interval={3000}
            infiniteLoop={true}
            stopOnHover={false}
            swipeable={true}
            emulateTouch={true}
            renderThumbs={() =>
              userData?.profileImageURLs?.map(
                (imageURL: string, index: number) => (
                  <div
                    key={index}
                    className="w-16 h-16 border-none overflow-hidden"
                  >
                    <img
                      src={imageURL}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ),
              )
            }
            className="w-60"
          >
            {userData?.profileImageURLs?.map(
              (imageURL: string, index: number) => (
                <div
                  key={index}
                  className="w-full h-60 flex items-center justify-center"
                >
                  <img
                    src={imageURL}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ),
            )}
          </Carousel>
          <span className="text-xl text-black dark:text-white">
            {userData?.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-black dark:text-white">
              Created At :
            </span>
            <span className="">
              {new Date(userData?.created_at).getFullYear()}-
              {new Date(userData?.created_at).getMonth() + 1}-
              {new Date(userData?.created_at).getDate()}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
            <div className="flex items-center justify-center gap-2 border-r border-stroke px-4 dark:border-strokedark">
              <span className="font-semibold text-black dark:text-white">
                Hair Color :
              </span>
              <span>{userData?.hairColor}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 md:py-0 border-r border-stroke px-4 dark:border-strokedark">
              <span className="font-semibold text-black dark:text-white">
                Skin Color :
              </span>
              <span>{userData?.skinColor}</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-4">
              <span className="font-semibold text-black dark:text-white">
                Attractiveness:
              </span>
              <span>{userData?.attractiveness}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <button
              className="inline-flex items-center justify-center py-2.5 px-5 text-center text-sm text-gray-500 dark:text-white bg-slate-100 hover:bg-slate-300/60 dark:bg-slate-600 dark:hover:bg-slate-600/60 gap-2.5 rounded-full shadow-sm"
              onClick={() => {
                setOpenFullProfileModal(true);
              }}
            >
              <FaEye />
              <span className="font-medium">View Full Profile</span>
            </button>
            <button
              className="inline-flex items-center justify-center py-2.5 px-5 text-center text-sm text-amber-500 bg-amber-100 hover:bg-amber-300/60 dark:bg-amber-200 dark:hover:bg-amber-100/90 gap-2.5 rounded-full shadow-sm"
              onClick={() => {
                openDrawer(EditUserForm, 'Edit User', 'Update a user', {
                  user: userData,
                  setUser: setUserData,
                });
              }}
            >
              <FaPencil />
              <span className="font-medium">Edit User</span>
            </button>
            <button
              className={`inline-flex items-center justify-center py-2.5 px-5 text-center text-sm gap-2.5 rounded-full ${
                userData.status === 1
                  ? 'text-red-500 bg-red-100 hover:bg-red-300/60 dark:hover:bg-red-200/70'
                  : 'text-green-500 bg-green-100 hover:bg-green-300/60 dark:bg-green-200 dark:hover:bg-green-100/90'
              }`}
              onClick={() => {
                setOpenStatusModal(true);
              }}
            >
              <RiUserSettingsLine className="w-4.5" />
              <span className="font-medium">
                {userData?.status === 1 ? 'Disable User' : 'Enable User'}
              </span>
            </button>
          </div>
        </div>
      </div>
      <FullProfileModal
        isOpen={isOpenFullProfileModal}
        onClose={() => {
          setOpenFullProfileModal(false);
        }}
        user={user}
      />
      <ChangeUserStatusModal
        isOpen={isOpenStatusModal}
        onClose={() => {
          setOpenStatusModal(false);
        }}
        user={userData}
        setUser={setUserData}
      />
    </div>
  );
};

export default Profile;
