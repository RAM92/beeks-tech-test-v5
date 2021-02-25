import React, { Component, useEffect, useState } from "react";
import { render } from "react-dom";
import { Chart } from "./Chart";
import { BitmexClient } from "./bitmexApi";
import "./style.css";

function App() {
  const [showChart, setShowChart] = useState(false);

  const [chartData, setChartData] = useState({
    sellData: [],
    buyData: [],
    sizeData: []
  });

  useEffect(function() {
    const client = new BitmexClient(setChartData);
  }, []);

  return (
    <div>
      <img
        src={
          "https://beeksgroup.com/wp-content/themes/beeks-wp/dist/images/logo.svg"
        }
        alt="Beeks logo"
      />
      <br />
      <button onClick={() => setShowChart(!showChart)}>Toggle Chart</button>
      {showChart && <Chart data={chartData} />}
    </div>
  );
}

render(<App />, document.getElementById("root"));
