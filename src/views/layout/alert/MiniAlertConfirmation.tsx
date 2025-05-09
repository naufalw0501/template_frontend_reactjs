import css from "./MiniAlertConfirmation.module.css"; 

export default function MiniAlertConfirmation(props: {
    alertQuestion?: string;
    showMiniAlertConfirmation?: boolean;
    setShowMiniAlertConfirmation: (val: boolean) => void;
    onClickYes: (() => void);
}) {
    const { alertQuestion, showMiniAlertConfirmation, setShowMiniAlertConfirmation, onClickYes } = props;
    return (
        <>
            <div className={css.container} id={showMiniAlertConfirmation ? undefined : css.hide}>
                <div className={css.containerText}>
                    <div className={css.description}>{alertQuestion ?? ""}</div>
                    <div style={{display: "flex", flexDirection: "row", gap: "10px", marginTop: "10px"}}>
                        <div className="rose-button" onClick={() => { setShowMiniAlertConfirmation(false) }}>Cancel</div>
                        <div className="primary-button" onClick={() => { onClickYes() ; setShowMiniAlertConfirmation(false) }}>Yes</div>
                    </div>
                </div>
            </div>
        </>
    );
}
