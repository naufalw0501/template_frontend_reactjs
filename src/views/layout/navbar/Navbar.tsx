import {
    FaBars
} from 'react-icons/fa';
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import NavBarLinks from './NavbarLinks';
import React, { useContext, useEffect, useState } from 'react';
import { TiArrowSortedDown } from "react-icons/ti";
import { HiOutlineLogout } from "react-icons/hi";
import AppContext from '../../../Context';
import { AuthService } from '../../../data/service/AuthService';
import { MiniAlertEntity } from '../alert/AlertEntity';
import { GiHamburgerMenu } from "react-icons/gi";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

function Navbar(props: { [key: string]: any }) {
    //--------STATES VIEW--------//
    const { showNavbar, setShowNavbar } = props;
    const [childOpen, setChildOpen] = useState<boolean[]>([]);
    const location = useLocation();
    const context = useContext(AppContext);
    const contextUserEntity = context.contextUserEntity;
    const setContextUserEntity = context.setContextUserEntity;
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;

    //--------STATES VIEW--------//
    //---------FUNCTIONS---------//

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            contextShowMiniAlertFunc(new MiniAlertEntity({
                title: "Logout Success",
                messages: `Have A Nice Day ${contextUserEntity?.username}`,
                level: 1,
                duration: 3000
            }));
            setContextUserEntity(null);
        } catch (error: any) {
        }
    };

    useEffect(() => {
        let arr: boolean[] = [];
        for (let i = 0; i < NavBarLinks.length; i++) {
            arr.push(false);
        }
        setChildOpen(arr);
    }, []);

    // Filter links berdasarkan role_name
    const filteredNavBarLinks = NavBarLinks.filter((link: any) =>
        link.roles.includes(contextUserEntity?.role_name)
    );

    return (
        <>
            <div style={{ display: (location.pathname === "/") ? "none" : "flex" }}>
                <div className="mobile-nav">
                    <button
                        className="mobile-nav-btn"
                        onClick={() => setShowNavbar(!showNavbar)}
                    >
                        <FaBars size={24} />
                    </button>
                </div>
                <nav className={!showNavbar ? 'navbar' : ''}>
                    <button
                        type="button"
                        className="nav-btn"
                        onClick={() => setShowNavbar(!showNavbar)}
                    >
                        {!showNavbar
                            ? <> <GiHamburgerMenu size={20} className='display-icon-mobile' /> <MdKeyboardDoubleArrowLeft size={30} className='display-icon-dekstop' /> </> :  <MdKeyboardDoubleArrowRight size={30}  /> }
                    </button>
                    <div>
                        <NavLink className="logo" to="#" >
                            <img style={{ backgroundColor: "white", padding: "5px 10px" }} width={"100%"} src={require("../../asset/image/logo_new.png")} alt="logo" />
                        </NavLink>
                        <div style={{ marginTop: "1dvh", color: "var(--primary-50)", fontWeight: "500" }}>
                            {contextUserEntity?.username ?? ""} {`(${contextUserEntity?.role_name ?? ""})`}
                        </div>

                        <div className="links nav-top">
                            {filteredNavBarLinks.map((val: any, index: number) => (
                                <React.Fragment key={index}>
                                    {val.child.length > 0 ? (
                                        <>
                                            <div className="nav-link"
                                                onClick={() => {
                                                    setChildOpen((prev) => {
                                                        const newChildOpen = prev.map((_, i) => i === index ? !prev[i] : false);
                                                        return newChildOpen;
                                                    });
                                                }}>
                                                {val.icon}
                                                <span>{val.title}</span>
                                                <span style={{ transform: childOpen[index] === true ? "rotate(0deg)" : "rotate(-90deg)" }}>
                                                    <TiArrowSortedDown />
                                                </span>
                                            </div>
                                            {childOpen[index] === true &&
                                                val.child
                                                    .filter((child: any) => child.roles.includes(contextUserEntity?.role_name))
                                                    .map((val_child: any, index_child: number) => (
                                                        <NavLink
                                                            to={val_child.link}
                                                            className="nav-link-child"
                                                            key={index_child}>
                                                            {val_child.icon}
                                                            <span>{val_child.title}</span>
                                                            <span>&nbsp;</span>
                                                        </NavLink>
                                                    ))}
                                        </>
                                    ) : (
                                        <NavLink
                                            to={val.link}
                                            className="nav-link"
                                            style={{ color: "white" }}
                                            key={index}>
                                            {val.icon} <span>{val.title}</span> <span>&nbsp;</span>
                                        </NavLink>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="nav-logout"
                            onClick={handleLogout}>
                            <HiOutlineLogout />
                            <span>Logout</span>
                            <span>&nbsp;</span>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}

export default Navbar;
