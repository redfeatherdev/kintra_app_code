import React, { useEffect } from 'react';
import { Button, Checkbox, Input, Modal, Select } from 'rizzui';
import { useUserStore } from '../../store/user.store';
import { harversine } from '../../utils/haversine';

const FilterModal = ({
  isOpen,
  onClose,
  filters,
  setFilters,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { users, filteredUsers, setFilteredUsers } = useUserStore() as {
    users: any[];
    filteredUsers: any[];
    setFilteredUsers: (users: any) => void;
  };
  const { regions } = useUserStore() as { regions: any };

  const handleChange =
    (key: keyof typeof filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.type === 'text') {
        setFilters((prev: any) => ({
          ...prev,
          [key]: e.target.value ? e.target.value : null,
        }));
      } else if (e.target.type === 'checkbox') {
        setFilters((prev: any) => ({
          ...prev,
          [key]: !prev[key],
        }));
      }
    };

  const handleSelectChange = (item: any) => {
    setFilters((prev: any) => ({
      ...prev,
      region: item.value,
    }));
  };

  const applyFilters = () => {
    if (!users) return;

    let filteredData = [...users];

    if (filters.minAge !== null) {
      filteredData = filteredData.filter(
        (user) => parseInt(user[1].age) >= filters.minAge!,
      );
    }

    if (filters.maxAge !== null) {
      filteredData = filteredData.filter(
        (user) => parseInt(user[1].age) <= filters.maxAge!,
      );
    }

    if (filters.region) {
      const selectedRegion = regions.find(
        (region: any) => region.name === filters.region,
      );
      const {
        latitude: regionLat,
        longitude: regionLon,
        range,
      } = selectedRegion;

      filteredData = filteredData.filter((user) => {
        if (user[1].livesIn) {
          const { latitude, longitude } = user[1].livesIn;
          const distance = harversine(
            regionLat,
            regionLon,
            latitude,
            longitude,
          );
          return distance <= range;
        }
      });
    }

    if (
      filters.latitude !== null &&
      filters.longitude !== null &&
      filters.range !== null
    ) {
      filteredData = filteredData.filter((user) => {
        if (user[1].livesIn) {
          const { latitude, longitude } = user[1].livesIn;
          const distance = harversine(
            filters.latitude!,
            filters.longitude!,
            latitude,
            longitude,
          );
          return distance <= filters.range!;
        }
      });
    }

    if (filters.isMale) {
      filteredData = filteredData.filter((user) => user[1].gender === 'Man');
    }

    if (filters.isFemale) {
      filteredData = filteredData.filter((user) => user[1].gender === 'Woman');
    }

    if (filters.userName) {
      filteredData = filteredData.filter((user) =>
        user[1].name.includes(filters.userName),
      );
    }

    if (filters.isActiveTopUsers && filters.percentValue) {
      const sortedData = filteredData.sort((a, b) => {
        const aLikes = a[1].likesReceived?.length || 0;
        const bLikes = b[1].likesReceived?.length || 0;
        return bLikes - aLikes;
      });
      const topCount = Math.floor(
        (sortedData.length * filters.percentValue) / 100,
      );
      filteredData = sortedData.slice(0, topCount);
    }

    setFilteredUsers(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      containerClassName="flex flex-col bg-white dark:bg-boxdark p-6"
      customSize="1000px"
    >
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col w-full sm:w-[40%]">
          <span className="text-sm text-black dark:text-bodydark font-medium">
            Age Range (Min - Max)
          </span>
          <div className="flex flex-row items-center gap-2 mt-2">
            <Input
              size="sm"
              name="minAge"
              inputMode="decimal"
              value={filters.minAge || ''}
              onChange={handleChange('minAge')}
              className="w-14 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
            <span className="text-lg text-black dark:text-bodydark">-</span>
            <Input
              size="sm"
              name="maxAge"
              inputMode="decimal"
              value={filters.maxAge || ''}
              onChange={handleChange('maxAge')}
              className="w-14 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
          </div>
          <Select
            label="Region Selections"
            options={regions.map((region: any) => ({
              value: region.name,
              label: region.name,
            }))}
            className="mt-4"
            labelClassName="text-black dark:text-bodydark"
            selectClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            value={filters.region}
            onChange={handleSelectChange}
          />
          <span className="text-sm text-black dark:text-bodydark font-medium mt-4">
            Distance from Point
          </span>
          <div className="flex flex-row mt-2 gap-2">
            <Input
              name="longitude"
              inputMode="numeric"
              placeholder="Longitude"
              value={filters.longitude || ''}
              onChange={handleChange('longitude')}
              className="[&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
            <Input
              name="latitude"
              inputMode="numeric"
              placeholder="Latitude"
              value={filters.latitude || ''}
              onChange={handleChange('latitude')}
              className="[&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
          </div>
          <Input
            name="range"
            inputMode="numeric"
            placeholder="Radial Distance"
            value={filters.range || ''}
            onChange={handleChange('range')}
            className="mt-2 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
            inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
          />
          <div className="flex flex-col mt-4 gap-2 pl-2">
            <Checkbox
              name="isMale"
              label="Male"
              inputClassName="w-5 h-5"
              iconClassName="text-white w-4 h-4 ml-0.5 mt-0.5"
              checked={filters.isMale}
              onChange={handleChange('isMale')}
            />
            <Checkbox
              name="isFemale"
              label="Female"
              inputClassName="w-5 h-5"
              iconClassName="text-white w-4 h-4 ml-0.5 mt-0.5"
              checked={filters.isFemale}
              onChange={handleChange('isFemale')}
            />
          </div>
          <Input
            name="userName"
            label="User Search (First, Last)"
            placeholder="John Doe"
            value={filters.userName}
            onChange={handleChange('userName')}
            labelClassName="text-black dark:text-bodydark"
            className="mt-5 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
            inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
          />
          <div className="flex items-center gap-2 mt-3 ml-2">
            <Checkbox
              name="isActiveTopUsers"
              inputClassName="w-5 h-5"
              iconClassName="text-white w-4 h-4 ml-0.5 mt-0.5"
              checked={filters.isActiveTopUsers}
              onChange={handleChange('isActiveTopUsers')}
            />
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm">Top</span>
              <Input
                size="sm"
                name="percent"
                inputMode="numeric"
                disabled={!filters.isActiveTopUsers}
                value={filters.percentValue || ''}
                onChange={handleChange('percentValue')}
                className="w-10 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
                inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
              />
              <span className="text-sm">% of Kintr Performers</span>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-[60%]">
          <div className="rounded-lg border border-stroke dark:border-form-strokedark mt-2">
            <div className="rounded-t-lg bg-stroke dark:bg-bodydark1 text-center text-black font-medium py-2.5">
              Searched Users ({filteredUsers.length})
            </div>
            <div className="max-h-[170px] overflow-y-auto">
              {filteredUsers?.length > 0 ? (
                filteredUsers?.map((user, index) => (
                  <div
                    key={index}
                    className={`text-sm text-center py-2 ${
                      index !== filteredUsers.length - 1 &&
                      'border-b border-b-stroke dark:border-b-form-strokedark'
                    }`}
                  >
                    {user[1]?.name}
                  </div>
                ))
              ) : (
                <div className="text-sm text-center py-2">
                  No searched users
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8 gap-3">
        <Button
          variant="outline"
          className="border-gray-200 dark:border-form-strokedark hover:text-black dark:hover:text-white px-6"
          onClick={() => {
            onClose();
            setFilteredUsers(users);
            setFilters({
              minAge: null,
              maxAge: null,
              region: '',
              longitude: null,
              latitude: null,
              range: null,
              isMale: false,
              isFemale: false,
              userName: '',
              isActiveTopUsers: false,
              percentValue: null,
            });
          }}
        >
          Cancel
        </Button>
        <Button
          className="text-white gap-2 hover:bg-primary/90"
          onClick={() => {
            onClose();
          }}
        >
          Save Filters
        </Button>
      </div>
    </Modal>
  );
};

export default FilterModal;
