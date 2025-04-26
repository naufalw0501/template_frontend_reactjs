// import logo from './logo.svg';
import { useEffect, useState, Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContext from "./Context";
import Cookies from "js-cookie";
import { ConfirmationAlertEntity, MiniAlertConfirmationEntity, MiniAlertEntity, } from "./views/layout/alert/AlertEntity";
import { UserAuthInterface } from "./data/interface/UserInterface";
import MiniAlert from "./views/layout/alert/MiniAlert";
import { AuthService } from "./data/service/AuthService";
import Navbar from "./views/layout/navbar/Navbar";
import ConfirmationAlert from "./views/layout/alert/ConfirmationAlert";
import MiniAlertConfirmation from "./views/layout/alert/MiniAlertConfirmation";
import Loading from "./views/layout/alert/Loading";

const Home = lazy(() => import("./views/page/home/Home")); 
const MasterUser = lazy(() => import("./views/page/master/MasterUser")); 
const MasterProduct = lazy(() => import("./views/page/master/MasterProduct")); 
const NotFound = lazy(() => import("./views/page/not_found/NotFound"));

function App() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [stateShowMiniAlert, setStateShowMiniAlert] = useState<boolean>(false);
  const [miniAlertEntity, setMiniAlertEntity] = useState<MiniAlertEntity | null>(null);
  const [miniAlertConfirmationEntity, setMiniAlertConfirmationEntity] = useState<MiniAlertConfirmationEntity | null>(null);
  const [stateShowConfirmationAlert, setStateShowConfirmationAlert] = useState<boolean>(false);
  const [stateShowMiniAlertConfirmation, setStateShowMiniAlertConfirmation] = useState<boolean>(false);
  const [stateShowLoading, setStateShowLoading] = useState<boolean>(false);
  const [confirmationAlertEntity, setConfirmationAlertEntity] = useState<ConfirmationAlertEntity | null>(null);
  const [contextUserEntity, setContextUserEntity] = useState<UserAuthInterface | null>(null);

  //Context
  const contextAccessToken: string = Cookies.get("token") ?? "";
  const contextShowMiniAlertFunc = (val: MiniAlertEntity) => {
    setStateShowMiniAlert(true);
    setMiniAlertEntity(val);
  };
  const contextShowConfirmationAlertFunc = (val: ConfirmationAlertEntity) => {
    setStateShowConfirmationAlert(true);
    setConfirmationAlertEntity(val);
  };
  const contextShowMiniAlertConfirmationFunc = (val: MiniAlertConfirmationEntity) => {
    setStateShowMiniAlertConfirmation(true);
    setMiniAlertConfirmationEntity(val);
  };
  const setContextLoading = (val: boolean) => {
    setStateShowLoading(val);
  };

  // REFRESH USER DATA IF COOKIES STILL EXIST
  useEffect(() => {
    console.log("Try refresh...");
    const refresh = async () => {
      try {
        const refreshUser = await AuthService.refreshLogin();
        if (refreshUser != null) {
          setContextUserEntity(refreshUser);
          contextShowMiniAlertFunc(
            new MiniAlertEntity({
              title: "Login Success",
              messages: `Welcome Back ${refreshUser.username}`,
              level: 1,
              duration: 5000,
            })
          );
          console.log("Refresh token success");
        }
      } catch (error: any) {
        AuthService.logout();
      }
    };
    refresh();
  }, []);

  return (
    <div className="App">
      <AppContext.Provider
        value={{
          contextAccessToken,
          contextUserEntity,
          setContextUserEntity,
          setContextLoading,
          contextShowMiniAlertFunc,
          contextShowConfirmationAlertFunc,
          contextShowMiniAlertConfirmationFunc,
        }}
      >
        <BrowserRouter>
          <Navbar showNavbar={showNavbar} setShowNavbar={setShowNavbar} />
          <Suspense
            fallback={
              <div className="loading-text">
                <span>L</span>
                <span>o</span>
                <span>a</span>
                <span>d</span>
                <span>i</span>
                <span>n</span>
                <span>g</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/master/user" element={<MasterUser />} /> 
              <Route path="/master/product" element={<MasterProduct />} /> 
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>

        <MiniAlert
          messages={miniAlertEntity?.messages}
          duration={miniAlertEntity?.duration}
          level={miniAlertEntity?.level}
          title={miniAlertEntity?.title}
          setShowMiniAlert={setStateShowMiniAlert}
          showMiniAlert={stateShowMiniAlert}
        />

        <ConfirmationAlert
          setShowConfirmationAlert={setStateShowConfirmationAlert}
          showConfirmationAlert={stateShowConfirmationAlert}
          alertQuestion={confirmationAlertEntity?.alertQuestion}
          onClickYes={confirmationAlertEntity?.onClickYes || (() => { })}
        />

        <MiniAlertConfirmation
          setShowMiniAlertConfirmation={setStateShowMiniAlertConfirmation}
          showMiniAlertConfirmation={stateShowMiniAlertConfirmation}
          alertQuestion={miniAlertConfirmationEntity?.alertQuestion}
          onClickYes={miniAlertConfirmationEntity?.onClickYes || (() => { })}
        />

        <Loading showLoading={stateShowLoading} />
      </AppContext.Provider>
    </div>
  );
}

export default App;
