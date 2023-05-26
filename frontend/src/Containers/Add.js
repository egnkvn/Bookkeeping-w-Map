import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import pinimg from "../Component/pinimg.png";
import MapGL, {
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  LinearInterpolator,
  Marker,
} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Geocode from "react-geocode";
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it
/* eslint import/no-webpack-loader-syntax: off */
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import "../Css/Add.css";
import axios from "../axios.js";
import moment from "moment";
mapboxgl.workerClass = MapboxWorker;

const { TabPane } = Tabs;
const { Search } = Input;
const { Title } = Typography;

const Add = ({ username }) => {
  const SIZE = 50;
  Geocode.setApiKey("AIzaSyD-kWfXIkHl38Wn8KUXNTDcHwSMKroHvgk");
  Geocode.setLanguage("zh-TW");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();
  const [Textfield, setTextfield] = useState(0);
  const [Content, setContent] = useState("");
  const [Type, setType] = useState("");
  const [AddType, setAddtype] = useState("");
  const [Status, setStatus] = useState("支出");
  const [Date, setDate] = useState(moment());
  const [address, setAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [coordinate, setCoordinate] = useState([]);
  let navigate = useNavigate();

  // console.log(Date);
  const handleTab = (key) => {
    setTextfield(0);
    setStatus(key);
  };

  const handleCost = async (cost) => {
    const date_Y = Date.format("YYYY");
    const date_YM = Date.format("YYYY-MM");
    const date = Date.format("YYYY-MM-DD");
    var r = /^[0-9]*[1-9][0-9]*$/;
    if (cost === "") {
      message.error({
        content: "Please enter the number",
      });
    } else if (r.test(cost)) {
      console.log({
        username: username,
        date_Y: date_Y,
        date_YM: date_YM,
        date: date,
        record: {
          status: Status,
          type: Type,
          content: Content,
          cost: cost,
          address,
        },
      });
      const {
        data: { Message },
      } = await axios.post("/api/AddRecord", {
        username: username,
        date_Y: date_Y,
        date_YM: date_YM,
        date: date,
        record: {
          status: Status,
          type: Type,
          content: Content,
          cost: cost,
          address,
        },
      });
      message.success({
        content: Message,
      });
      navigate("/calendar");
    } else {
      message.error({
        content: "Please enter the number",
      });
    }
  };
  const handleTextfield = (event) => {
    setTextfield(1);
    // console.log(event.target.innerText);
    setType(event.target.innerText);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (AddType !== "") {
      setTextfield(1);
      setIsModalVisible(false);
      setType(AddType);
      message.success({
        content: "Add success",
      });
    } else {
      message.error({
        content: "Input value is empty",
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [viewport, setViewport] = useState({
    latitude: 25.017754858333614,
    longitude: 121.53968590135806,
    zoom: 12,
  });

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiZW5naW5la2V2aW4iLCJhIjoiY2t5ZXVqYXU1MGJjMDJvcG1tNmY3enEwcSJ9.6zVa7flOmlUMpCSKOmwvkA";

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      //   console.log(position.coords.latitude, position.coords.longitude);
    });
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinate([latitude, longitude]);
          setAddress("Location," + latitude + "," + longitude);
          setViewport({
            latitude: latitude,
            longitude: longitude,
            zoom: 12,
          });
          setMapVisible(true);
        },
        (error) => {
          message.error({ content: "Error getting current location" });
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleGetUserLocation = () => {
    if (address.startsWith("Location,")) {
      const tempcoordinate = address.split(",");
      setCoordinate([Number(tempcoordinate[1]), Number(tempcoordinate[2])]);
      setViewport({
        latitude: Number(tempcoordinate[1]),
        longitude: Number(tempcoordinate[2]),
        zoom: 12,
      });
      setMapVisible(true);
    } else {
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          let tempcoordinate = [];
          tempcoordinate.push(lat);
          tempcoordinate.push(lng);
          setCoordinate(tempcoordinate);
          setViewport({
            latitude: lat,
            longitude: lng,
            zoom: 12,
          });
          setMapVisible(true);
        },
        (error) => {
          setMapVisible(false);
          message.error({ content: "您的地址不存在或是不夠明確" });
          console.error(error);
        }
      );
    }
  };

  const outcome = [
    "飲食",
    "交通",
    "日常用品",
    "服飾",
    "電話網路",
    "水電瓦斯",
    "娛樂",
    "教育",
    "保險",
    "稅金",
  ];
  const income = ["工資", "獎金", "股票", "彩券"];

  return (
    <Tabs defaultActiveKey="支出" centered onTabClick={(key) => handleTab(key)}>
      <TabPane tab="支出" key="支出">
        <Space size={[20, 20]} wrap align="center" className="addspace">
          {new Array(10).fill(null).map((_, index) => (
            <Button
              className="addbtn"
              shape="round"
              key={index}
              style={{ height: "75px", width: "75px", padding: "4px 4px" }}
              onClick={(event) => handleTextfield(event)}
            >
              {outcome[index]}
            </Button>
          ))}
          <Button
            shape="round"
            key={"NEW"}
            style={{
              height: "75px",
              width: "75px",
              padding: "4px 4px",
              fontSize: "25px",
            }}
            onClick={showModal}
          >
            +
          </Button>
          <Modal
            title="新增項目"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Input
              value={AddType}
              size="large"
              placeholder="請輸入新項目"
              onChange={(e) => {
                setAddtype(e.target.value);
              }}
            />
          </Modal>
        </Space>
        <div style={{ margin: "3%" }}>
          {Textfield ? (
            <>
              <Title level={2}>
                <DatePicker
                  size="large"
                  defaultValue={Date}
                  onChange={(date) => setDate(date)}
                  allowClear={false}
                />
              </Title>
              <Title level={2}>{Date.format("YYYY-MM-DD")}</Title>
              <Title level={2} style={{ marginBottom: "10px" }}>
                {Type}
              </Title>
              <Input
                placeholder="備註"
                allowClear
                size="large"
                style={{ width: "50%", marginTop: "20px" }}
                value={Content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Title level={2}>
                <Input
                  placeholder="地址"
                  allowClear
                  size="large"
                  style={{ width: "50%", marginTop: "20px" }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Title>
              <div className="locationWrapper">
                <Button onClick={handleGetLocation}>使用當前位置</Button>
                <div style={{ width: "20px" }}></div>
                <Button onClick={handleGetUserLocation}>查詢地址</Button>
              </div>
              {mapVisible ? (
                <div className="mapWrapper">
                  <MapGL
                    ref={mapRef}
                    {...viewport}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    width="100%"
                    height="100%"
                    onViewportChange={handleViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    transitionInterpolator={new LinearInterpolator()}
                  >
                    <Marker longitude={coordinate[1]} latitude={coordinate[0]}>
                      <img
                        src={pinimg}
                        height="40"
                        width="40"
                        alt=""
                        style={{
                          cursor: "pointer",
                          fill: "#d00",
                          stroke: "none",
                          transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
                        }}
                      ></img>
                    </Marker>
                    <NavigationControl style={{ right: "10px", top: "10px" }} />
                    <ScaleControl
                      maxWidth={100}
                      unit="metric"
                      style={{ right: "10px", bottom: "25px" }}
                    />
                    <GeolocateControl
                      style={{ right: "10px", top: "120px" }}
                      positionOptions={{ enableHighAccuracy: true }}
                      trackUserLocation={false}
                    />
                  </MapGL>
                </div>
              ) : (
                <></>
              )}
              <Search
                placeholder="$"
                allowClear
                enterButton="確認"
                size="medium"
                style={{ width: "50%", marginTop: "20px" }}
                onSearch={handleCost}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </TabPane>
      <TabPane tab="收入" key="收入">
        <Space size={[20, 20]} wrap align="center" className="addspace">
          {new Array(4).fill(null).map((_, index) => (
            <Button
              shape="round"
              key={index}
              style={{ height: "75px", width: "75px", padding: "4px 4px" }}
              onClick={(event) => handleTextfield(event)}
            >
              {income[index]}
            </Button>
          ))}
          <Button
            shape="round"
            key={"NEW"}
            style={{
              height: "75px",
              width: "75px",
              padding: "4px 4px",
              fontSize: "25px",
            }}
            onClick={showModal}
          >
            +
          </Button>
          <Modal
            title="新增項目"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Input
              value={AddType}
              size="large"
              placeholder="請輸入新項目"
              onChange={(e) => {
                setAddtype(e.target.value);
              }}
            />
          </Modal>
        </Space>
        <div style={{ margin: "5%" }}>
          {Textfield ? (
            <>
              <Title level={2}>
                <DatePicker
                  size="large"
                  defaultValue={Date}
                  onChange={(date) => setDate(date)}
                  allowClear={false}
                />
              </Title>
              <Title level={2}>{Date.format("YYYY-MM-DD")}</Title>
              <Title level={2}>{Type}</Title>
              <Input
                placeholder="備註"
                allowClear
                size="large"
                style={{ width: "60%", marginTop: "20px" }}
                value={Content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Search
                placeholder="請輸入金額"
                allowClear
                enterButton="確認"
                size="large"
                style={{ width: "50%", marginTop: "20px" }}
                onSearch={handleCost}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </TabPane>
    </Tabs>
  );
};

export default Add;
