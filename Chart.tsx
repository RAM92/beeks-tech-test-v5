import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

function getMaxMin(arr: Array<[number, number]>) {
  let min = null;
  let max = null;
  for (let i = 0; i < arr.length; i++) {
    const magnitude = arr[i][1];
    if (i === 0) {
      min = max = magnitude;
    } else if (magnitude > max) {
      max = magnitude;
    } else if (magnitude < min) {
      min = magnitude;
    }
  }

  return {
    max,
    min
  };
}

export const Chart = ({ data }) => {
  console.time("max/min");
  const buyExtremes = getMaxMin(data.buyData);
  const sellExtremes = getMaxMin(data.sellData);
  const sizeExtremes = getMaxMin(data.sizeData);
  console.timeEnd("max/min");

  const options = {
    chart: {
      animation: false
    },
    title: {
      text: "XBTUSD"
    },
    navigator: {
      enabled: false
    },
    legend: {
      enabled: true
    },
    series: [
      {
        name: "Buy",
        data: data.buyData,
        color: "green"
      },
      {
        name: "Sell",
        data: data.sellData,
        color: "red"
      },
      {
        name: "Size",
        data: data.sizeData,
        color: "blue"
      }
    ],
    xAxis: {
      type: "datetime"
    },
    yAxis: {
      plotLines: [
        {
          value: buyExtremes.min,
          width: 2,
          color: "green",
          dashStyle: "longdash"
        },
        {
          value: buyExtremes.max,
          width: 2,
          color: "green",
          dashStyle: "longdash"
        },
        {
          value: sellExtremes.min,
          width: 2,
          color: "red",
          dashStyle: "longdash"
        },
        {
          value: sellExtremes.max,
          width: 2,
          color: "red",
          dashStyle: "longdash"
        },
        {
          value: sizeExtremes.min,
          width: 2,
          color: "blue",
          dashStyle: "longdash"
        },
        {
          value: sizeExtremes.max,
          width: 2,
          color: "blue",
          dashStyle: "longdash"
        }
      ]
    },
    plotOptions: {
      series: {
        showInNavigator: true
      }
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
