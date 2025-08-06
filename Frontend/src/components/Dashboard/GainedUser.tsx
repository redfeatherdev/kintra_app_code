import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

import { useTotalStore } from "../../store/total.store";
import { useState } from "react";

const GainedUser = () => {
  const { gained_user, total_count } = useTotalStore() as { gained_user: any, total_count: number }

  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);

  const series: { name: string; data: (number | null)[] }[] = [
    {
      name: "Users",
      data: selectedPeriod === 0
        ? Object.values(Object.fromEntries(gained_user.last_week)) as (number | null)[]
        : selectedPeriod === 1 ? Object.values(Object.fromEntries(gained_user.last_month)) as (number | null)[]
          : selectedPeriod === 2 ? Object.values(Object.fromEntries(gained_user.last_4_months)) as (number | null)[]
            : selectedPeriod === 3 ? Object.values(Object.fromEntries(gained_user.last_6_months)) as (number | null)[]
              : Object.values(Object.fromEntries(gained_user.last_year)) as (number | null)[]
    },
  ];

  const categories = selectedPeriod === 0
    ? Object.keys(Object.fromEntries(gained_user.last_week))
    : selectedPeriod === 1 ? Object.keys(Object.fromEntries(gained_user.last_month))
      : selectedPeriod === 2 ? Object.keys(Object.fromEntries(gained_user.last_4_months))
        : selectedPeriod === 3 ? Object.keys(Object.fromEntries(gained_user.last_6_months))
          : Object.keys(Object.fromEntries(gained_user.last_year))

  const options: ApexOptions = {
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 400,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: categories,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: selectedPeriod === 1,
      }
    },
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: 400,
          },
          xaxis: {
            labels: {
              rotate: -30,
              style: {
                fontSize: '10px',
              },
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              rotate: -15,
              style: {
                fontSize: '8px',
              },
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
    yaxis: {
      title: {
        style: {
          fontSize: '0px'
        }
      },
      min: 0,
      max: total_count + 100
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <div className="items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white dark:text-white dark:hover:bg-boxdark ${selectedPeriod === 0 && 'bg-white shadow-card dark:bg-boxdark'}`}
            onClick={() => { setSelectedPeriod(0) }}
          >
            Last Week
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white dark:text-white dark:hover:bg-boxdark ${selectedPeriod === 1 && 'bg-white shadow-card dark:bg-boxdark'}`}
            onClick={() => { setSelectedPeriod(1) }}
          >
            Last Month
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white dark:text-white dark:hover:bg-boxdark ${selectedPeriod === 2 && 'bg-white shadow-card dark:bg-boxdark'}`}
            onClick={() => { setSelectedPeriod(2) }}
          >
            Last 4 Months
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white dark:text-white dark:hover:bg-boxdark ${selectedPeriod === 3 && 'bg-white shadow-card dark:bg-boxdark'}`}
            onClick={() => { setSelectedPeriod(3) }}
          >
            Last 6 Months
          </button>
          <button
            className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white dark:text-white dark:hover:bg-boxdark ${selectedPeriod === 4 && 'bg-white shadow-card dark:bg-boxdark'}`}
            onClick={() => { setSelectedPeriod(4) }}
          >
            Last year
          </button>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={400}
      />
    </>
  )
}

export default GainedUser;