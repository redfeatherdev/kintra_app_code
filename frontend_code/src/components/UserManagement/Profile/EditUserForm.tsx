import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button, Input, Select } from 'rizzui';

import { Box } from '../../common/Box';
import { Flex } from '../../common/Flex';
import ReactDatePicker from './DatePicker';
import { FixedDrawerBottom } from '../../common/FixedDrawerBottom';

import { useDrawer } from '../../../store/drawer.store';

export const EditUserForm = ({
  user,
  setUser,
}: {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { closeDrawer } = useDrawer();
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedValue =
      name === 'age' ||
      name === 'yearlyIncome' ||
      name === 'attractiveness' ||
      name === 'longitude' ||
      name === 'latitude'
        ? Number(value) || 0
        : value;

    if (name === 'longitude' || name === 'latitude') {
      setUserData((prevData: any) => ({
        ...prevData,
        livesIn: {
          ...prevData.livesIn,
          [name]: updatedValue,
        },
      }));
    } else {
      setUserData((prevData: any) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setUserData((prevData: any) => ({
      ...prevData,
      birthday: date || new Date(),
    }));
  };

  const handleAddItem = (
    value: string,
    type: 'hobbies' | 'importantTraits',
  ) => {
    if (value && !userData[type].includes(value)) {
      setUserData((prevData: any) => ({
        ...prevData,
        [type]: [...prevData[type], value],
      }));
    }
  };

  const handleRemoveItem = (
    item: string,
    type: 'hobbies' | 'importantTraits',
  ) => {
    setUserData((prevData: any) => ({
      ...prevData,
      [type]: prevData[type].filter((i: string) => i !== item),
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: 'hobbies' | 'importantTraits',
  ) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value.trim();
      if (value) {
        handleAddItem(value, type);
        e.currentTarget.value = '';
      }
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { id, ...userDataWithoutId } = userData;
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/update_user/${userData.userId}`,
        userDataWithoutId,
      );
      if (res.status === 200) {
        toast.success('User edited successfully!');
        setLoading(false);
        closeDrawer();
        setUser(userData);
      }
    } catch (err: any) {
      console.error('Error updating user: ', err);
      toast.error('Error updating user: ', err.response.data.error);
    }
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Flex direction="col" align="stretch" className="gap-5">
        <Box>
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="Enter name"
            value={userData?.name}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="email"
            label="Email"
            placeholder="Enter email"
            value={userData?.email}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={userData?.phoneNumber}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Select
            name="gender"
            label="Gender"
            options={[
              { label: 'Man', value: 'Man' },
              { label: 'Woman', value: 'Woman' },
            ]}
            value={userData?.gender}
            onChange={(item: any) => {
              setUserData((prevData: any) => ({
                ...prevData,
                gender: item.value,
              }));
            }}
            labelClassName="dark:text-bodydark"
            selectClassName="border-steel-100 ring-0 dark:border-steel-500 dark:bg-steel-600/20 dark:text-bodydark"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="genderInterest"
            label="Gender Interest"
            placeholder="Enter your gender interest"
            value={userData?.genderInterest}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="number"
            name="age"
            label="Age"
            placeholder="Enter your age"
            value={userData?.age}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="height"
            label="Height"
            placeholder="Enter your height"
            value={userData?.height}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box className="flex flex-col">
          <span className="text-sm mb-1.5 font-medium dark:text-bodydark">
            Birthday
          </span>
          <ReactDatePicker
            selected={userData?.birthday}
            onChange={handleDateChange}
            placeholderText="Select your birthday"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="bio"
            label="Bio"
            placeholder="Enter your bio"
            value={userData?.bio}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="famous"
            label="Famous"
            placeholder="Enter your famous"
            value={userData?.famous}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="skinColor"
            label="Skin Color"
            placeholder="Enter your skin color"
            value={userData?.skinColor}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="hairColor"
            label="Hair Color"
            placeholder="Enter your hair color"
            value={userData?.hairColor}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="number"
            name="attractiveness"
            label="Attractiveness"
            placeholder="Enter your attractiveness"
            value={userData?.attractiveness}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="jobTitle"
            label="Job Title"
            placeholder="Enter your job title"
            value={userData?.jobTitle}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="jobProminence"
            label="Job Prominence"
            placeholder="Enter your job prominence"
            value={userData?.jobProminence}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="number"
            name="yearlyIncome"
            label="Yearly Income"
            placeholder="Enter your yearly income"
            value={userData?.yearlyIncome}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box className="flex flex-col">
          <span className="text-sm mb-3 font-medium dark:text-bodydark">
            Hobbies
          </span>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {userData?.hobbies.map((hobby: string, index: number) => (
              <div
                key={index}
                className="flex items-center px-4 py-1 bg-gray-200 rounded-full text-sm"
                onClick={() => {
                  handleRemoveItem(hobby, 'hobbies');
                }}
              >
                {hobby}
                <span className="ml-2 cursor-pointer text-gray-500 hover:text-red-500">
                  ×
                </span>
              </div>
            ))}
          </div>
          <Input
            type="text"
            name="hobby"
            placeholder="Enter your hobby"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
            onKeyDown={(e) => handleKeyDown(e, 'hobbies')}
          />
        </Box>

        <Box className="flex flex-col">
          <span className="text-sm mb-3 font-medium dark:text-bodydark">
            Important Traits
          </span>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {userData?.importantTraits.map((trait: string, index: number) => (
              <div
                key={index}
                className="flex items-center px-4 py-1 bg-gray-200 rounded-full text-sm"
                onClick={() => {
                  handleRemoveItem(trait, 'importantTraits');
                }}
              >
                {trait}
                <span className="ml-2 cursor-pointer text-gray-500 hover:text-red-500">
                  ×
                </span>
              </div>
            ))}
          </div>
          <Input
            type="text"
            name="importantTrait"
            placeholder="Enter your important trait"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
            onKeyDown={(e) => handleKeyDown(e, 'importantTraits')}
          />
        </Box>

        <Box>
          <Input
            type="text"
            name="collegeOrSchool"
            label="College"
            placeholder="Enter your college"
            value={userData?.collegeOrSchool}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="number"
            name="longitude"
            label="Longitude"
            placeholder="Enter your longitude"
            value={userData?.livesIn?.longitude || ''}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box className="mb-5">
          <Input
            type="number"
            name="latitude"
            label="Latitude"
            placeholder="Enter your latitude"
            value={userData?.livesIn?.latitude || ''}
            onChange={handleChange}
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full dark:text-bodydark"
            inputClassName="px-3 border-[1.5px] border-stroke ring-0 [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <FixedDrawerBottom>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="border-stroke dark:border-strokedark hover:text-black"
            onClick={closeDrawer}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="lg"
            className="w-full disabled:bg-[#F8F9FB] text-white bg-primary hover:opacity-90"
            isLoading={loading}
            onClick={handleUpdate}
          >
            Save
          </Button>
        </FixedDrawerBottom>
      </Flex>
    </Flex>
  );
};
