import React, { useState, useRef, useCallback, useEffect } from "react";
import { Modal, Table } from "antd";
import { Marker } from "react-map-gl";
import { makeStyles } from "@mui/styles";
import pinimg from "./pinimg.png";
import Geocode from "react-geocode";
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";
const SIZE = 50;
const useStyles = makeStyles((theme) => ({
  wrapIcon: {
    verticalAlign: "middle",
    display: "inline-flex",
  },
  customizeToolbar: {
    minHeight: 40,
    width: "100%",
  },
}));

const override = css`
  display: flex;
  border-color: #971d1d;
`;
function Pins(props) {
  const [coordinate, setCoordinate] = useState([]);
  Geocode.setApiKey("AIzaSyD-kWfXIkHl38Wn8KUXNTDcHwSMKroHvgk");
  Geocode.setLanguage("zh-TW");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();
  const Getcoordinate = (address) => {
    if (address.startsWith("Location,")) {
      console.log("sdfghjk")
      const tempcoordinate = address.split(",");
      setCoordinate([Number(tempcoordinate[1]), Number(tempcoordinate[2])])
    } else {
      Geocode.fromAddress(address).then(
        (response) => {
          console.log(response.results);
          const { lat, lng } = response.results[0].geometry.location;
          let tempcoordinate = [];
          tempcoordinate.push(lat);
          tempcoordinate.push(lng);
          setCoordinate(tempcoordinate);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  };
  const { info } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: "時間",
      dataIndex: "date",
    },
    {
      title: "類別",
      dataIndex: "type",
    },
    {
      title: "金額(元)",
      dataIndex: "cost",
    },
    {
      title: "備註",
      dataIndex: "content",
    },
  ];

  const Model = () => {
    return (
      <>
        <Modal visible={open} onOk={handleClose} onCancel={handleClose}>
          <Table dataSource={info} columns={columns} />
        </Modal>
      </>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      await new Promise((r) => setTimeout(r, 2000));
      setLoading((loading) => !loading);
    };

    Getcoordinate(info[0].address);
    loadData();
  }, []);

  return loading ? (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <RingLoader color="#971d1d" css={override} size={100} />
    </div>
  ) : coordinate[1] === undefined || coordinate[0] === undefined ? (
    <></>
  ) : (
    <>
      <Marker longitude={coordinate[1]} latitude={coordinate[0]}>
        <img
          onClick={() => handleOpen()}
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
      {open ? Model() : ""}
    </>
  );
}
export default React.memo(Pins);
