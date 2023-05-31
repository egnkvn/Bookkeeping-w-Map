import React, { useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";
import MyCalendar from "./Containers/MyCalendar";
import Add from "./Containers/Add";
import Signin from "./Containers/Sign_in";
import Graph from "./Containers/PieChart";
import Property from "./Containers/Property";
import { Button, Layout, Menu, Typography } from "antd";
import {
  BarChartOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  InsertRowAboveOutlined,
  DollarOutlined,
  UnorderedListOutlined,
  ScheduleOutlined,
  ImportOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./Css/Menu.css";
import Map from "./Containers/Map/Map";
import "./App.css";
import { colors } from "@mui/material";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title, Text } = Typography;

let LOCALSTORAGE_KEY = "";
let LOCALSTORAGE_KEY2 = "false";
function App() {
  const savedUsername = localStorage.getItem(LOCALSTORAGE_KEY);
  const savedLogin = localStorage.getItem(LOCALSTORAGE_KEY2);
  const [login, setLogin] = useState(savedLogin);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(savedUsername);
  const [confirmpassword, setConfirmpassword] = useState("");
  const [sideropen, setSideropen] = useState(false);
  let navigate = useNavigate();
  const setvalue = () => {
    localStorage.setItem(LOCALSTORAGE_KEY, username);
    localStorage.setItem(LOCALSTORAGE_KEY2, login);
  };
  useEffect(() => {
    if (login === "true") {
      setvalue();
    }
  }, [login]);
  const handleLogout = () => {
    localStorage.setItem(LOCALSTORAGE_KEY, "");
    localStorage.setItem(LOCALSTORAGE_KEY2, "false");
    setUsername("");
    setLogin((login) => {
      return (login = "false");
    });
    navigate("/signin");
  };

  useEffect(() => {
    console.log(sideropen);
  }, [sideropen]);
  return login === "true" ? (
    <div>
      <Layout>
        <div className="header">
          <MenuOutlined
            onClick={() => setSideropen(true)}
            style={{ fontSize: "250%", color: "white", margin: "2px" }}
          />
          <Title style={{ fontSize: "200%", color: "white", margin: "20px" }}>
            {username}
          </Title>
        </div>

        {sideropen && (
          <Sider
            className="sider"
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              zIndex: 9999,
            }}
          >
            <Menu theme="dark" mode="inline">
              <Menu.Item
                key="1"
                style={{
                  height: "100px",
                  fontSize: "40px",
                  margin: "0px",
                  background: "#971d1d",
                }}
                onClick={() => setSideropen(false)}
              >
                <NavLink to="/add" />+
              </Menu.Item>
              <Menu.Item
                key="2"
                style={{ height: "60px", fontSize: "20px", marginTop: "0px" }}
                icon={<InsertRowAboveOutlined style={{ fontSize: "110%" }} />}
                onClick={() => setSideropen(false)}
              >
                <NavLink to="/calendar" />
                日曆
              </Menu.Item>
              <Menu.Item
                key="3"
                style={{ height: "60px", fontSize: "20px" }}
                icon={<BarChartOutlined style={{ fontSize: "110%" }} />}
                onClick={() => setSideropen(false)}
              >
                <NavLink to="/graph" />
                圖表
              </Menu.Item>
              <Menu.Item
                key="4"
                style={{ height: "60px", fontSize: "20px" }}
                icon={<DollarOutlined style={{ fontSize: "110%" }} />}
                onClick={() => setSideropen(false)}
              >
                <NavLink to="/property" />
                資產
              </Menu.Item>
              <Menu.Item
                key="5"
                style={{ height: "60px", fontSize: "20px" }}
                icon={<EnvironmentOutlined style={{ fontSize: "110%" }} />}
                onClick={() => setSideropen(false)}
              >
                <NavLink to="/map" />
                地圖
              </Menu.Item>
              <Menu.Item
                key="6"
                style={{ height: "60px", fontSize: "20px" }}
                icon={<UnorderedListOutlined style={{ fontSize: "110%" }} />}
                onClick={() => setSideropen(false)}
              >
                關閉選單
              </Menu.Item>
              <SubMenu
                key="sub1"
                title="登出"
                style={{ height: "60px", fontSize: "20px" }}
                icon={<ImportOutlined style={{ fontSize: "110%" }} />}
              >
                <Menu.Item key="登出" onClick={() => handleLogout()}>
                  確認
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
        )}
        <Layout>
          <Content
            style={{
              margin: "24px 16px 0",
              paddingTop: "25px",
              overflow: "initial",
              textAlign: "center",
            }}
          >
            <Routes>
              <Route
                exact
                path="/calendar"
                element={<MyCalendar username={username} />}
              />
              <Route exact path="/add" element={<Add username={username} />} />
              <Route
                exact
                path="/graph"
                element={<Graph username={username} />}
              />
              <Route
                exact
                path="/property"
                element={<Property username={username} />}
              />
              <Route exact path="/map" element={<Map username={username} />} />
              <Route path="/" element={<Navigate to="/calendar" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  ) : (
    <div>
      <Routes>
        <Route
          exact
          path="/signin"
          element={
            <Signin
              login2={login}
              Login={setLogin}
              password={password}
              username={username}
              confirmpassword={confirmpassword}
              setPassword={setPassword}
              setConfirmpassword={setConfirmpassword}
              setUsername={setUsername}
            />
          }
        />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}

export default App;
