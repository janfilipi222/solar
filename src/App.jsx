import { useEffect, useState, useMemo } from "react";
import "./App.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";


const lines1 = [
  "soc1",
  "voltage1",
  "current1",
  "power1",
  "temp1",
  "bat_temp1",
  "pmeter1",
  "status1"
];


const lines2 = [
  "soc2",
  "voltage2",
  "current2",
  "power2",
  "temp2",
  "bat_temp2",
  "pmeter2",
  "status2"
];

const colors1 = {
  soc1: "#ae00ff",
  voltage1: "#008533",
  power1: "#ff7300",
  current1: "#ff0000",
  temp1: "#0400ff",
  bat_temp1: "#0000ff",
  pmeter1: "#000000",
  status1: "#ff00ff"
};

const colors2 = {
  soc2: "#00be7f",
  voltage2: "#853c00",
  power2: "#001aff",
  current2: "#2bff00",
  temp2: "#1daa01",
  bat_temp2: "#ff4800",
  pmeter2: "#00df4a",
  status2: "#00ad4e"
};



export default function App() {
  const [data, setData] = useState([]);

  const [visibleLines, setVisibleLines] = useState({
    soc1: false,
    voltage1: false,
    current1: false,
    power1: false,
    temp1: false,
    bat_temp1: false,
    pmeter1: false,
    status1: false,
    soc2: false,
    voltage2: false,
    current2: false,
    power2: false,
    temp2: false,
    bat_temp2: false,
    pmeter2: false,
    status2: false
  });

  const [period, setPeriod] = useState("24h");

  function setLineVisible(lineName, visible) {
    setVisibleLines({
      ...visibleLines,
      [lineName]: visible
    });
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatXAxis(timestamp, period) {
    const date = new Date(timestamp);

    if (period === "24h" || period === "12h") {
      return date.toLocaleTimeString("cs-CZ", {
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    return date.toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "numeric"
    }) + " " +
    date.toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  const graphData = useMemo(() => {
    const now = Date.now();

    let filtered = data;
    let filter = 0;

    if (period === "12h") {
      filter = now - 12 * 60 * 60 * 1000;
    } else
    if (period === "24h") {
      filter = now - 24 * 60 * 60 * 1000;
    } else    
      if (period === "3d") {
      filter = now - 3 * 24 * 60 * 60 * 1000;
    } else
    if (period === "1w") {
      filter = now - 7 * 24 * 60 * 60 * 1000;
    } else
    if (period === "2w") {
      filter = now - 14 * 24 * 60 * 60 * 1000;
    } else
    if (period === "1m") {
      filter = now - 30 * 24 * 60 * 60 * 1000;
    } else
    if (period === "3m") {
      filter = now - 90 * 24 * 60 * 60 * 1000;
    }

    filtered = data.filter(item => item.time1 >= filter);


    let returnData = filtered.map(item => ({
      ...item,
      time1: formatXAxis(item.time1, period)
    }));

    return returnData;
  }, [data, period]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxRHFRktot0jN-hjF72-MLDOPnGcM_XMeqAKGEfvxaalzt3LR_bly5Uo9DNTBu8CoiYLQ/exec?type=read&index=3")
      .then(response => response.json())
      .then(json => {
        const converted = json.map(item => ({
          time1: new Date(item.time1).getTime(),
          soc1: Number(item.soc1),
          voltage1: Number(item.voltage1),
          power1: Number(item.power1),
          current1: Number(item.current1),
          temp1: Number(item.temp1),
          bat_temp1: Number(item.bat_temp1),
          pmeter1: Number(item.pmeter1),
          status1: Number(item.status1),
          soc2: Number(item.soc2),
          voltage2: Number(item.voltage2),
          power2: Number(item.power2),
          current2: Number(item.current2),
          temp2: Number(item.temp2),
          bat_temp2: Number(item.bat_temp2),
          pmeter2: Number(item.pmeter2),
          status2: Number(item.status2)
        }));
        setData(converted);  
        
      })
      .catch(error => {
        setData("Chyba: " + error.message);
      });
  }, []);


  return (
    <div className="App">

      <header className="topbar">
        <h1>Solar Panel Info</h1>
      </header>

      <div className="content">

        <div className="controls">

          <div className="checkboxes">
            <span>GW1(1315):</span> 
            {lines1.map(line => (
              <label key={line} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={visibleLines[line]}
                  onChange={(e) => setLineVisible(line, e.target.checked)}
                />
                {line}
              </label>
            ))}
          </div>

          <div className="checkboxes">
            <span>GW2(1357):</span> 
            {lines2.map(line => (
              <label key={line} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={visibleLines[line]}
                  onChange={(e) => setLineVisible(line, e.target.checked)}
                />
                {line}
              </label>
            ))}
          </div>

          <div>
            <span>Period:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="period-select"
            >
              <option value="12h">Last 12 hours</option>
              <option value="24h">Last 24 hours</option>
              <option value="3d">Last 3 days</option>
              <option value="1w">Last 1 week</option>
              <option value="2w">Last 2 weeks</option>
              <option value="1m">Last 1 month</option>
              <option value="3m">Last 3 months</option>
              <option value="all">Full</option>
            </select>

          </div>

        </div>


        <div className="graph-container">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={graphData}
              margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time1" 
              />
              <YAxis />
              <Tooltip />

              {lines1.map((line) =>
                visibleLines[line] ? (
                  <Line
                    key={line}
                    type="monotone"
                    dataKey={line}
                    stroke={colors1[line]}
                    strowidth={3}
                  />
                ) : null
              )}

              {lines2.map((line) =>
                visibleLines[line] ? (
                  <Line
                    key={line}
                    type="monotone"
                    dataKey={line}
                    stroke={colors2[line]}
                    strowidth={3}
                  />
                ) : null
              )}


            </LineChart>
          </ResponsiveContainer>

        </div>


      </div>



      
    </div>
  );
}

