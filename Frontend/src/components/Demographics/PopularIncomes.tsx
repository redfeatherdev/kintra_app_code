import { useState } from 'react';
import { useDemographcisStore } from '../../store/demographics.store';

const PopularIncomes = () => {
  const { data } = useDemographcisStore() as { data: any };
  const [period, setPeriod] = useState<string>('day');

  const formatIncome = (income: number) => {
    if (income >= 1_000_000_000_000) {
      return (income / 1_000_000_000_000).toFixed(2) + 'T';
    } else if (income >= 1_000_000_000) {
      return (income / 1_000_000_000).toFixed(2) + 'B';
    } else if (income >= 1_000_000) {
      return (income / 1_000_000).toFixed(2) + 'M';
    } else if (income >= 1_000) {
      return (income / 1_000).toFixed(2) + 'K';
    }
    return income;
  };

  return (
    <div className="flex flex-col bg-white dark:bg-boxdark border border-stroke dark:border-strokedark p-3">
      <div className="flex justify-end">
        <div className="items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:text-white dark:hover:bg-primary ${
              period === 'day' &&
              'bg-primary text-white shadow-card dark:bg-primary'
            }`}
            onClick={() => {
              setPeriod('day');
            }}
          >
            Day
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:text-white dark:hover:bg-primary ${
              period === 'week' &&
              'bg-primary text-white shadow-card dark:bg-primary'
            }`}
            onClick={() => {
              setPeriod('week');
            }}
          >
            Week
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:text-white dark:hover:bg-primary ${
              period === 'month' &&
              'bg-primary text-white shadow-card dark:bg-primary'
            }`}
            onClick={() => {
              setPeriod('month');
            }}
          >
            Month
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:text-white dark:hover:bg-primary ${
              period === '6months' &&
              'bg-primary text-white shadow-card dark:bg-primary'
            }`}
            onClick={() => {
              setPeriod('6months');
            }}
          >
            6 Months
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:text-white dark:hover:bg-primary ${
              period === 'year' &&
              'bg-primary text-white shadow-card dark:bg-primary'
            }`}
            onClick={() => {
              setPeriod('year');
            }}
          >
            Year
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 px-3">
        <span className="font-bold text-black dark:text-white">
          Male Popular Income:{' '}
        </span>
        <span className="text-black dark:text-white">
          {formatIncome(data[period].top_yearly_incomes.Man[0])}
        </span>
      </div>
      <div className="flex gap-3 px-4 mt-1">
        <div className="items-center">
          <span className="text-sm font-semibold text-black dark:text-white">
            2:{' '}
          </span>
          <span className="text-sm">
            {formatIncome(data[period].top_yearly_incomes.Man[1])}
          </span>
        </div>
        <div className="items-center">
          <span className="text-sm font-semibold text-black dark:text-white">
            3:{' '}
          </span>
          <span className="text-sm">
            {formatIncome(data[period].top_yearly_incomes.Man[2])}
          </span>
        </div>
        <div className="items-center">
          <span className="text-sm font-semibold text-black dark:text-white">
            4:{' '}
          </span>
          <span className="text-sm">
            {formatIncome(data[period].top_yearly_incomes.Man[3])}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 px-3">
        <span className="font-bold text-black dark:text-white">
          Female Popular Income:{' '}
        </span>
        <span className="text-black">
          {formatIncome(data[period].top_yearly_incomes.Woman[0])}
        </span>
      </div>
      <div className="flex gap-3 px-4 mt-1">
        <div className="items-center">
          <span className="text-sm font-semibold text-black dark:text-white">
            2:{' '}
          </span>
          <span className="text-sm">
            {formatIncome(data[period].top_yearly_incomes.Woman[1])}
          </span>
        </div>
        <div className="items-center">
          <span className="text-sm font-semibold text-black dark:text-white">
            3:{' '}
          </span>
          <span className="text-sm">
            {formatIncome(data[period].top_yearly_incomes.Woman[2])}
          </span>
        </div>
        <div className="items-center">
          <span className="text-sm font-semibold text-black dark:text-white">
            4:{' '}
          </span>
          <span className="text-sm">
            {formatIncome(data[period].top_yearly_incomes.Woman[3])}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PopularIncomes;
