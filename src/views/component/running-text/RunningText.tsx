import { useEffect, useState } from "react";
import css from "./RunningText.module.css";
import Popup from "../popup/Popup";
import { format } from "date-fns";
import { LinenCheckOvertime, LinenNeedSolving } from "../../../data/entity/LinenNotification";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../Constant";
import { IoNotificationsCircle } from "react-icons/io5";

const RunningText = () => {
  const [showPopupScanLinensOvertime, setShowPopupScanLinensOvertime] = useState<boolean>(false);
  const [scannedLinensOvertime, setScannedLinensOvertime] = useState<LinenCheckOvertime[]>([]);
  const [scannedLinensNeedSolving, setScannedLinensNeedSolving] = useState<LinenNeedSolving[]>([]);
  const [showDataLinensOut, setShowDataLinensOut] = useState<boolean>(false);

  const [websocket, setWebsocket] = useState<Socket | null>(null)

  const handleShowPopup = async () => {
    setShowPopupScanLinensOvertime(true);
  };

  const onClickSolveLinen = (rfid: string) => {
    if (websocket == null) { return }
    websocket.emit("solve_rfid", rfid)
  }

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token == null) { return console.log('Token not found!'); }

    const socket = io(`${BASE_URL}/notification`, { auth: { token: token } });

    const onWebsocketConnect = () => {
      setWebsocket(socket)
      socket.emit("initial")
    }

    const onWebsocketDisconnect = () => {
      setWebsocket(null)
    }

    const onResponse = (response: string) => {
      console.log(response)
    }

    const onNotifNeedWashing = (msg: {
      id_linen: number;
      rfid: string;
      type: string;
      wash_status: string;
      last_wash_room: string;
      last_wash_start: string;
    }[]) => {
      const data: LinenCheckOvertime[] = []
      for (let i = 0; i < msg.length; i++) {
        data.push({
          id_linen: msg[i].id_linen,
          rfid: msg[i].rfid,
          status: msg[i].wash_status,
          last_wash_date: new Date(msg[i].last_wash_start),
          last_wash_room: msg[i].last_wash_room,
        })
      }
      setScannedLinensOvertime(data)
    }

    const onNotifNeedSolving = (msg: { id_linen: number, rfid: string, type: string, room: string }[]) => {
      const data: LinenNeedSolving[] = []
      for (let i = 0; i < msg.length; i++) {
        data.push({
          id_linen: msg[i].id_linen,
          rfid: msg[i].rfid,
          type: msg[i].type,
          room: msg[i].room,
        })
      }
      setScannedLinensNeedSolving(data)
    }

    socket.on('response', onResponse);
    socket.on('need_washing', onNotifNeedWashing);
    socket.on('need_solving', onNotifNeedSolving);
    socket.on('connect', onWebsocketConnect);
    socket.on('disconnect', onWebsocketDisconnect);

    return () => {
      socket.off('response', onResponse);
      socket.off('need_washing', onNotifNeedWashing);
      socket.off('need_solving', onNotifNeedSolving);
      socket.off('connect', onWebsocketConnect);
      socket.off('disconnect', onWebsocketDisconnect);
      socket.disconnect()
    };
  }, []);

  return (
    <>
      <div className={css["running-text-container"]} onClick={() => { handleShowPopup(); }}>
        <div className="relative">
          <div className={css["running-text"]}>
            Terdapat {scannedLinensOvertime.length} Linen Yang Tidak Dicuci Lebih Dari 3 Hari . Terdapat {scannedLinensNeedSolving.length} Linen Yang Keluar Dari Rumah Sakit. Klik Untuk Lihat Detail
          </div>
          <div className={(scannedLinensNeedSolving.length === 0 && scannedLinensOvertime.length === 0 ? css["icon-no-shake"] : css["icon"])} >
            <IoNotificationsCircle />
          </div>
        </div>
      </div>

      <Popup
        setShowPopup={setShowPopupScanLinensOvertime}
        showPopup={showPopupScanLinensOvertime}
        popupTitle={`${showDataLinensOut
          ? "Linen Yang Keluar Dari Rumah Sakit"
          : "Linen Yang Tidak Dicuci Lebih Dari 3 Hari"
          }`}
        popupContent={
          <div style={{ zIndex: 99 }}>
            <div
              style={{
                height: "100%",
                padding: "1vh 1vw",
                minWidth: "80dvw",
                overflow: "auto",
                position: "relative",
              }}
            >
              <table
                className="normalTable"
                style={{ textAlign: "center", marginTop: "2px" }}
              >
                {showDataLinensOut ? (
                  <>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>ID Linen</th>
                        <th>RFID</th>
                        <th>Last Room</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {scannedLinensNeedSolving != null &&
                      scannedLinensNeedSolving.length > 0 && (
                        <tbody>
                          {scannedLinensNeedSolving?.map((row, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{row.id_linen ?? ""}</td>
                                <td>{row.rfid ?? ""}</td>
                                <td>{row.room ?? ""}</td>
                                <td>{row.type ?? ""}</td>
                                <td>
                                  <button className={css["button-enabled"]} onClick={() => { onClickSolveLinen(row.rfid) }}>
                                    Solve
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      )}
                  </>
                ) : (
                  <>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>ID LINEN</th>
                        <th>RFID</th>
                        <th>Status</th>
                        <th>Room Last Wash</th>
                        <th>Date Last Wash</th>
                      </tr>
                    </thead>
                    {scannedLinensOvertime != null &&
                      scannedLinensOvertime.length > 0 && (
                        <tbody>
                          {scannedLinensOvertime?.map((row, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{row.id_linen ?? ""}</td>
                                <td>{row.rfid ?? ""}</td>
                                <td>{row.status ?? ""}</td>
                                <td>{row.last_wash_room ?? ""}</td>
                                <td>{format(row.last_wash_date, "yyyy-MM-dd") ?? ""}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      )}
                  </>
                )}
              </table>
            </div>
            <div className={css["container-button-popup"]}>
              <button
                className={css["button-enabled"]}
                onClick={() => setShowDataLinensOut(!showDataLinensOut)}
              >
                {showDataLinensOut
                  ? "Check Linens Overtime"
                  : "Check Linens Out"}
              </button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default RunningText;
