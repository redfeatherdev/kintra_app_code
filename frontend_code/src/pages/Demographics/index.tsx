import axios from "axios";
import { useEffect } from "react";
import { useDemographcisStore } from "../../store/demographics.store";

import Loader from "../../components/common/Loader";
import PopularHeights from "../../components/Demographics/PopularHeights";
import PopularSkinColors from "../../components/Demographics/PopularSkinColors";
import PopularJobLevels from "../../components/Demographics/PopularJobLevels";
import PopularIncomes from "../../components/Demographics/PopularIncomes";
import PopularHobbies from "../../components/Demographics/PopularHobbies";
import PopularColleges from "../../components/Demographics/PopularColleges";
import PopularCities from "../../components/Demographics/PopularCities";

const Demographics = () => {
  const { loading, setLoading, setData } = useDemographcisStore() as {
    loading: boolean,
    setLoading: (state: boolean) => void,
    setData: (data: any) => void
  }

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_user_demographics`);

      if (res.status === 200) {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error fetching data: ", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    loading ? <Loader /> :
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <span className="font-medium text-black text-xl dark:text-bodydark">Demographics</span>
            <span className="text-sm">View user demographics by period</span>
          </div>
        </div>
        <div className="border-b border-stroke dark:border-strokedark mt-8 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
          <PopularHeights />
          <PopularSkinColors />
          <PopularJobLevels />
          <PopularIncomes />
          <PopularHobbies />
          <PopularColleges />
          <PopularCities />
        </div>
      </div>
  )
}

export default Demographics;