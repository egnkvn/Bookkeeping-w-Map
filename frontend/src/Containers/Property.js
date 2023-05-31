import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, VictoryLabel } from "react-router-dom";
import { VictoryPie, VictoryAnimation } from "victory";
import {
  Tabs,
  Button,
  Space,
  Input,
  Typography,
  message,
  DatePicker,
  Modal,
} from "antd";
import axios from "../axios.js";
import "../Css/Property.css";
import moment from "moment";

const { Title, Text } = Typography;

const Property = ({ username }) => {
  const [Date, setDate] = useState(moment());
  const [Total, setTotal] = useState(0);
  const [TotalIncome, setTotalIncome] = useState(0);
  const [TotalOutcome, setTotalOutcome] = useState(0);
  const [TotalMonth, setTotalMonth] = useState(0);
  const [Record, setRecord] = useState([]);
  const date = Date.format("YYYY-MM");

  const getData = async () => {
    const {
      data: { records },
    } = await axios.get("/api/GetUserInformation", {
      // get backend
      params: {
        username, // give backend
      },
    });
    setRecord(records);
  };
  const handleCalculate = () => {
    let tempTotal = 0;
    let tempIncome = 0;
    let tempOutcome = 0;
    let tempMonth = 0;
    for (let i = 0; i < Record.length; i++) {
      let Status = Record[i].status;
      let cost = Record[i].cost;
      if (Status === "支出") {
        tempTotal -= cost;
        if (Record[i].date_YM === Date.format("YYYY-MM")) {
          tempOutcome += cost;
          tempMonth -= cost;
        }
      } else if (Status === "收入") {
        tempTotal += cost;
        if (Record[i].date_YM === Date.format("YYYY-MM")) {
          tempIncome += cost;
          tempMonth += cost;
        }
      }
    }
    setTotal(tempTotal);
    setTotalIncome(tempIncome);
    setTotalOutcome(tempOutcome);
    setTotalMonth(tempMonth);
  };
  const handleColor = (cost) => {
    if (cost < 0) return "danger";
    else if (cost > 0) return "success";
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    handleCalculate();
  }, [Date, Record]);

  return (
    <>
      <div className="mainwrapper">
        <div style={{ marginBottom: "20px" }}>
          <DatePicker
            size="large"
            value={Date}
            picker="month"
            onChange={(Date) => {
              setDate(Date);
            }}
            allowClear={false}
          />
        </div>
        <Title level={2} type={handleColor(Total)}>
          ${Total}
        </Title>
        <Title level={2} style={{ marginTop: "1%", marginBottom: "5%" }}>
          淨資產
        </Title>
        <div className="subwrapper">
          <div className="monthwrapper">
            <div>
              <div>
                <Title level={4} type="danger" className="text">
                  -${TotalOutcome}
                </Title>
              </div>
              <Title level={4}>月支出</Title>
              <div style={{ height: "100px", width: "100px" }}>
                <VictoryPie
                  animate={true}
                  data={[
                    {
                      x: 1,
                      y: TotalOutcome / (TotalOutcome + TotalIncome + 0.01),
                    },
                    {
                      x: 2,
                      y: 1 - TotalOutcome / (TotalOutcome + TotalIncome + 0.01),
                    },
                  ]}
                  innerRadius={120}
                  cornerRadius={25}
                  labels={() => null}
                  width={400} // 設定圖表寬度
                  height={400}
                  style={{
                    data: {
                      fill: ({ datum }) => {
                        return datum.x === 1 ? "red" : "transparent";
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <div>
                <Title level={4} type="success">
                  ${TotalIncome}
                </Title>
              </div>
              <Title level={4}>月收入</Title>
              <div style={{ height: "100px", width: "100px" }}>
                <VictoryPie
                  animate={true}
                  data={[
                    {
                      x: 1,
                      y: TotalIncome / (TotalOutcome + TotalIncome + 0.01),
                    },
                    {
                      x: 2,
                      y: 1 - TotalIncome / (TotalOutcome + TotalIncome + 0.01),
                    },
                  ]}
                  innerRadius={120}
                  cornerRadius={25}
                  labels={() => null}
                  width={400} // 設定圖表寬度
                  height={400}
                  style={{
                    data: {
                      fill: ({ datum }) => {
                        return datum.x === 1 ? "green" : "transparent";
                      },
                    },
                  }}
                />
              </div>
            </div>
            {/* <div>
              <div>
                <Title level={4} type={handleColor(TotalMonth)}>
                  ${TotalMonth}
                </Title>
              </div>
              <Title level={4}>月收支</Title>
              <div style={{ height: "100px", width: "100px" }}>
                <VictoryPie
                  data={[
                    { x: 1, y: 1 },
                    {
                      x: 2,
                      y: 0,
                    },
                  ]}
                  innerRadius={120}
                  cornerRadius={25}
                  labels={() => null}
                  width={400} // 設定圖表寬度
                  height={400}
                  style={{
                    data: {
                      fill: ({ datum }) => {
                        if (handleColor(TotalMonth) === "danger") return "red";
                        if (handleColor(TotalMonth) === "success")
                          return "green";
                        return "transparent";
                      },
                    },
                  }}
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Property;
