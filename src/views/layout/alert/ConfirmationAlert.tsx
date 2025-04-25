import popup from "./ConfirmationAlert.module.css";
import Backdrop from "../../component/backdrop/Backdrop";
import { IoIosCloseCircle } from "react-icons/io";

export default function ConfirmationAlert(props: {
    showConfirmationAlert: boolean;
    setShowConfirmationAlert: (val: boolean) => void;
    alertQuestion?: string;
    onClickYes: (() => void);
}) {
    const { showConfirmationAlert, setShowConfirmationAlert, alertQuestion, onClickYes } = props;
    return (
        <>
            {showConfirmationAlert && <Backdrop zIndex={21} close={() => {setShowConfirmationAlert(false) }} />}
            <div className={popup.modalmobile} style={{zIndex: 22}} id={showConfirmationAlert ? undefined : popup.hide}>
                <div className={popup.closeButton} onClick={() => { setShowConfirmationAlert(false)  }}><IoIosCloseCircle /></div>
                <h2 style={{ textAlign: "center", margin: "0", }}>
                    CONFIRMATION
                </h2>
                <div style={{ textAlign: "center", fontSize: "20px", marginTop: "3dvh" }}>
                    {alertQuestion}
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", height: "100%", marginTop: "3dvh" }}>
                    <button className={popup.cancelButton} onClick={() => { setShowConfirmationAlert(false)  }}>Cancel</button>
                    <button className={popup.yesButton} onClick={() => { onClickYes(); setShowConfirmationAlert(false) }}>Yes</button>
                </div>
            </div>
        </>
    );
}
