import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import css from "./DashboardGraph.module.css";

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
  ArcElement
);

const DashboardGraph = (props: {
  listLabelsGraph: string[];
  listValueQTYGraph: number[];
  listLabelHighest: string[];
  listLabelLowest: string[];
  listValueHighest: number[];
  listValueLowest: number[];
}) => {

  const listLabelsGraph = props.listLabelsGraph
  const listValueQTYGraph = props.listValueQTYGraph
  const listLabelHighest = props.listLabelHighest
  const listLabelLowest = props.listLabelLowest
  const listValueHighest = props.listValueHighest
  const listValueLowest = props.listValueLowest

  const optionsBarChart: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: "black",
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        display: true,
        ticks: {
          color: "black",
          font: {
            weight: "bold",
          },
          //   callback: function (value) {
          //     return value.toLocaleString("id-ID");
          //   },
        },
        max: Math.max(...listValueQTYGraph) * 1.2,
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        display: true,
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
          value: {
            color: "black",
          },
        },
      },
    },
  };

  const optionsHighest: ChartOptions<"bar"> = {
    ...optionsBarChart,
    indexAxis: "y",
    scales: {
      ...optionsBarChart.scales,
      x: {
        position: "top",
        ...optionsBarChart.scales?.x,
      },
      y: {
        max: Math.max(...listValueHighest) * 1.2,
      },
    },
    plugins: {
      ...optionsBarChart.plugins,
      datalabels: {
        anchor: "end",
        align: "end",
        display: true,
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
          value: {
            color: "black",
          },
        },
      },
    },
  };

  const optionsLowest: ChartOptions<"bar"> = {
    ...optionsBarChart,
    indexAxis: "y",
    scales: {
      ...optionsBarChart.scales,
      x: {
        position: "top",
        reverse: true,
        ...optionsBarChart.scales?.x,
      },
      y: {
        max: Math.max(...listValueLowest) * 1.2,
        position: "right",
      },
    },
    plugins: {
      ...optionsBarChart.plugins,
      datalabels: {
        anchor: "start",
        align: "start",
        display: true,
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
          value: {
            color: "black",
          },
        },
      },
    },
  };

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 grid-rows-3 lg:grid-rows-1 gap-5">
      <div className={`${css.chartCard} h-auto mb-[0vh] mt-[3vh] ml-0 lg:mt-0 lg:ml-[4vw] mx-3 lg:mx-0`}>
        <span>CONDITION GRAPH</span>
        <div className={css.chart}>
          <Bar
            options={optionsBarChart}
            data={{
              labels: listLabelsGraph,
              datasets: [
                {
                  label: "Total QTY",
                  data: listValueQTYGraph,
                  backgroundColor: "#0EA5E9",
                },
              ],
            }}
          />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-5">
        <div className={`${css.chartCard} h-auto lg:ml-0 lg:mr-0 mx-3 lg:mx-0`}>
          <span>Top 10 Highest Linen on Room</span>
          <div className={css.chart}>
            <Bar
              options={optionsHighest}
              data={{
                labels: listLabelHighest,
                datasets: [
                  {
                    label: "Total QTY",
                    data: listValueHighest,
                    backgroundColor: "#0EA5E9",
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-5">
        <div className={`${css.chartCard} h-auto lg:ml-0 lg:mr-[2vw] mx-3 lg:mx-0`}>
          <span>Top 10 Lowest Linen on Room</span>
          <div className={css.chart}>
            <Bar
              options={optionsLowest}
              data={{
                labels: listLabelLowest,
                datasets: [
                  {
                    label: "Total QTY",
                    data: listValueLowest,
                    backgroundColor: "#0EA5E9",
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraph;
