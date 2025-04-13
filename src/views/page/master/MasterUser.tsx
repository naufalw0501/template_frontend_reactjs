import { useContext, useEffect, useRef, useState } from "react";
import css from './Master.module.css'
import { HiDotsVertical } from "react-icons/hi";
import Popup from "../../component/popup/Popup";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import AppContext from "../../../Context";
import { ConfirmationAlertEntity, MiniAlertEntity } from "../../layout/alert/AlertEntity";
import { UserService } from "../../../data/service/UserService";
import TablePaginationUtils from "../../../utility/TablePagination";
import { LiaWindowMaximize } from "react-icons/lia";
import { PiBarcodeBold } from "react-icons/pi";
import { AddUserEntity, RoleEntity, UserEntity } from "../../../data/entity/UserEntity";


const MasterUser = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    // const contextUserEntity = context.contextUserEntity;
    const setContextLoading = context.setContextLoading;
    const contextShowConfirmationAlertFunc = context.contextShowConfirmationAlertFunc
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const [tableListUser, setTableListUser] = useState<UserEntity[] | null>(null)
    const [ListRoles, setListRoles] = useState<RoleEntity[] | null>(null)
    const [paginationTableListUser, setPaginationTableListUser] = useState({
        start: 0,
        end: 15
    })
    const [showTooltip, setShowTooltip] = useState<{ [key: number]: boolean }>({});
    const [showPopupAddNewUser, setShowPopupAddNewUser] = useState<boolean>(false);
    const [showPopupEditUser, setShowPopupEditUser] = useState<boolean>(false);
    const [selectedAddNewUser, setSelectedAddNewUser] = useState<AddUserEntity | null>(null)
    const [selectedEditUser, setSelectedEditUser] = useState<AddUserEntity | null>(null)
    const [selectedDefaultEditUser, setSelectedDefaultEditUser] = useState<UserEntity | null>(null)
    const [filterSearch, setFilterSearch] = useState<string>()
    const [inputFilterSearch, setInputFilterSearch] = useState<string>()
    const tooltipRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------//


    const handlePopupAddNew = async () => {
        setShowPopupAddNewUser(true)
        setSelectedAddNewUser(null)
    }

    const handleSaveAddNew = async () => {
        if (selectedAddNewUser == null) return
        setContextLoading(true)
        try {
            const resp = await UserService.createUser(selectedAddNewUser)
            await generateData()
            setShowPopupAddNewUser(false)
            setSelectedAddNewUser(null)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString(), level: 3 }))
        }
    }

    const handlePopupUpdate = async (data: UserEntity) => {
        setSelectedEditUser(data)
        setSelectedDefaultEditUser(data)
        setShowPopupEditUser(true)
    }

    const handleSaveUpdate = async () => {
        if (selectedDefaultEditUser == null || selectedEditUser == null) return
        setContextLoading(true)
        try {
            const resp = await UserService.updateUser(
                selectedDefaultEditUser,
                { id_role: selectedEditUser.id_role, username: selectedEditUser.username })
            await generateData()
            setShowPopupEditUser(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const handleDelete = async (data: UserEntity) => {
        if (data == null) return
        contextShowConfirmationAlertFunc(new ConfirmationAlertEntity({
            alertQuestion: `Are you sure you want delete ${data.username}?`,
            onClickYes: async () => {
                setContextLoading(true)
                try {
                    const resp = await UserService.deleteUser(data);
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
                    await generateData()
                    setShowPopupEditUser(false)
                    setContextLoading(false)
                } catch (error: any) {
                    setContextLoading(false)
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
                }
            },
        }));

    }

    const generateData = async () => {
        setContextLoading(true)
        try {
            // const resp = await UserService.getUser();
            // setTableListUser(resp.data)
            // const respRoles = await UserService.getRoles();
            // setListRoles(respRoles.data)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const filtering = (val: UserEntity) => {
        if (!filterSearch || filterSearch.trim() === "") {
            return true;
        }
        const searchTerm = filterSearch.toLowerCase();
        return (
            val.username?.toLowerCase().includes(searchTerm) ||
            val.role?.toLowerCase().includes(searchTerm)
        );
    };

    const toggleTooltip = (index: number) => {
        setShowTooltip({
            [index]: !showTooltip[index]
        });
    };

    const handleOutsideClick = (event: MouseEvent) => {
        const isOutside = Object.values(tooltipRefs.current).every(
            (ref) => ref && !ref.contains(event.target as Node)
        );
        if (isOutside) {
            setShowTooltip({});
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        generateData()
        // eslint-disable-next-line
    }, []);

    //------------------------FUNCTIONS------------------------//

    return (
        <div style={{backgroundColor: "var(--gray-200)", height: "100dvh"}}> 

        </div>
    )
}

export default MasterUser