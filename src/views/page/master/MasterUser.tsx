import { useContext, useEffect, useState } from "react";
import css from './Master.module.css'
import { FaRegListAlt, FaHome, FaSortUp, FaSortDown, FaSave, FaTrash } from "react-icons/fa";
import AppContext from "../../../Context";
import { ConfirmationAlertEntity, MiniAlertEntity } from "../../layout/alert/AlertEntity";
import TableViewUtils from "../../../utility/TableViewUtils";
import { MdCardMembership, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdModeEdit } from "react-icons/md";

import Popup from "../../component/popup/Popup";
import { FormUserInterface, UserInterface } from "../../../data/interface/UserInterface";
import { UserService } from "../../../data/service/UserService";


const MasterUser = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    const setContextLoading = context.setContextLoading;
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const contextShowConfirmationAlertFunc = context.contextShowConfirmationAlertFunc

    //State For First Open Page
    const [tableData, setTableData] = useState<UserInterface[]>([])
    const [tableDataCache, setTableDataCache] = useState<UserInterface[]>([])
    const [sortColumnChoosed, setSortColumnChoosed] = useState<keyof UserInterface | null>(null)
    const [sortColumnType, setSortColumnType] = useState<"ascending" | "descending">("ascending")
    const [tableDataFilter, setTableDataFilter] = useState<{ [key: string]: string }>({})
    const [lengthDataPerPage, setLengthDataPerPage] = useState<number>(50)
    const [curentPage, setCurrentPage] = useState<number>(1)
    const [listPage, setListPage] = useState<any[]>([])

    //State For Popup Add and Edit
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [formData, setFormData] = useState<FormUserInterface>({})
    const [selectedData, setSelectedData] = useState<UserInterface | null>(null)
    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------// 

    const handlePopupAddNew = () => {
        setShowPopup(true)
        setSelectedData(null)
        setFormData({})
    }

    const handlePopupEdit = (row_data: UserInterface) => {
        setShowPopup(true)
        setSelectedData(row_data)
        setFormData(row_data)
    }

    const handleSaveAddNew = async () => {
        setContextLoading(true)
        try {
            const resp = await UserService.createUser(formData)
            await generateData()
            setShowPopup(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        } finally {
            setContextLoading(false)
        }
    }

    const handleSaveEdit = async () => {
        if (selectedData == null) { return }
        setContextLoading(true)
        try {
            const resp = await UserService.updateUser(selectedData, formData)
            await generateData()
            setShowPopup(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        } finally {
            setContextLoading(false)
        }
    }

    const handleDelete = async () => {
        contextShowConfirmationAlertFunc(new ConfirmationAlertEntity({
            alertQuestion: `Are you sure to delete ${selectedData?.username}?`,
            onClickYes: async () => {
                if (selectedData == null) { return }
                setContextLoading(true)
                try {
                    const resp = await UserService.deleteUser(selectedData)
                    await generateData()
                    setShowPopup(false)
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
                } catch (error: any) {
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
                } finally {
                    setContextLoading(false)
                }
            },
        }));

    }

    const generateData = async () => {
        setContextLoading(true)
        try {
            const resp = await UserService.getUser()
            setTableDataCache(resp.data)
            setTableData(resp.data);
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        } finally {
            setContextLoading(false)
        }
    }

    const handleSorting = (column: keyof UserInterface | null) => {
        setSortColumnChoosed(column)
        if (sortColumnType === "ascending") {
            setSortColumnType("descending")
        } else {
            setSortColumnType("ascending")
        }
    }

    const handleFilter = async () => {
        setContextLoading(true)
        try {
            if (tableDataCache.length > 0) {
                const resp = tableDataCache
                let table_filtered = resp.filter((row) =>
                    TableViewUtils.FilterTable(row, tableDataFilter)
                )
                setTableData(table_filtered)
            }
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.message, level: 3 }))
        } finally {
            setContextLoading(false)
        }
    }

    const filterTable = (column: keyof UserInterface, columnnName?: string) => {
        return <div>
            <input style={{ fontSize: "12px", marginTop: "0.5dvh", maxWidth: "80px", padding: "0px 3px", borderRadius: "3px" }} type="text" value={tableDataFilter[column] ?? ""}
                placeholder={`${columnnName ?? column} ...`}
                onChange={(event) => {
                    setTableDataFilter((prev) => {
                        const newData = { ...prev }
                        newData[column] = event.target.value
                        return newData
                    })
                }}
            />
        </div>
    }

    const headerTable = (column: keyof UserInterface, columnName?: string) => {
        return <>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "3px", whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => handleSorting(column)}>
                <div style={{ fontSize: "12px" }}>{columnName ?? column}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0", alignItems: "center", justifyItems: "center" }}>
                    <FaSortUp style={{ color: ((sortColumnChoosed == column && sortColumnType == "descending") ? "var(--amber-950)" : "var(--amber-100)"), margin: 0, padding: 0, height: '18px' }} />
                    <FaSortDown style={{ color: ((sortColumnChoosed == column && sortColumnType == "ascending") ? "var(--amber-950)" : "var(--amber-100)"), margin: "-18px", padding: 0, height: '18px' }} />
                </div>
            </div>
        </>
    }

    useEffect(() => {
        let arr_page: number[] = []
        let arr_page_push: any[] = []
        let total_page: number = tableData.length % lengthDataPerPage === 0 ? (Math.floor(tableData.length / lengthDataPerPage)) : (Math.floor(tableData.length / lengthDataPerPage)) + 1
        for (let i = 0; i < total_page; i++) {
            if (i === 0 || i === total_page - 1 || i === curentPage || i === curentPage - 1 || i === curentPage - 2) {
                arr_page.push(i + 1)
            } else {
            }
        }
        for (let i = 0; i < arr_page.length; i++) {
            arr_page_push.push(arr_page[i])
            if (arr_page[i + 1] - arr_page[i] !== 1 && i !== arr_page.length - 1) {
                arr_page_push.push("...")
            }
        }
        setListPage(arr_page_push)
    }, [curentPage, lengthDataPerPage, tableDataFilter, tableData])

    useEffect(() => {
        generateData()
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        handleFilter()
    }, [tableDataFilter])

    //------------------------FUNCTIONS------------------------//

    return (
        <div className={css["page-container"]}>
            {/* Header */}
            <div className={css["header-container"]}>
                <div>
                    <div className={css["title"]}>
                        <div><FaRegListAlt className={css["icon"]} /></div>
                        <div className={css["text"]}>Master User</div>
                    </div>
                    <div className={css["address"]}>
                        <div><FaHome /></div>
                        <div >/ Master</div>
                        <div >/ Users Active</div>
                    </div>
                </div>
                <div className={css["button-container"]}>
                    <button onClick={() => handlePopupAddNew()} className="amber-button">
                        Add New
                    </button>
                    <button onClick={() => { generateData(); setSortColumnChoosed(null); setSortColumnType('ascending') }} className="amber-button">
                        Refresh
                    </button>
                </div>
            </div>
            <div style={{ backgroundColor: "var(--gray-400)", width: "100%", height: "4px", marginTop: "10px" }}></div>

            {/* Table Container (Grow) */}
            <div className={css["table-container"]}>
                <div className={css["sub-container"]}>
                    <table className="normalTable" >
                        <thead>
                            <tr >
                                <th>No</th>
                                <th>{headerTable("username", "Username")}{filterTable("username", "Username")}</th>
                                <th>{headerTable("role", "Role")}{filterTable("role", "Role")}</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData
                                .sort((a, b) => {
                                    if (!sortColumnChoosed) return 0;
                                    return sortColumnType === "ascending"
                                        ? TableViewUtils.SortingTable(a, b, sortColumnChoosed)
                                        : TableViewUtils.SortingTable(b, a, sortColumnChoosed);
                                })
                                .slice((curentPage - 1) * lengthDataPerPage, curentPage * lengthDataPerPage)
                                .map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1 + ((curentPage - 1) * lengthDataPerPage)}</td>
                                        <td>{item.username}</td>
                                        <td>{item.role}</td>
                                        <td className="action-button" onClick={() => handlePopupEdit(item)}>
                                            <span className="icon"><MdModeEdit /></span>
                                            <span className="label">&nbsp; Edit</span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className={css["pagination-container"]} style={{ fontSize: "12px" }}>
                <div className={css["sub-container"]} >
                    <div style={{ marginLeft: "5px", }}>
                        <select value={lengthDataPerPage} onChange={(event) => { setLengthDataPerPage(parseInt(event.target.value)); setCurrentPage(1) }} style={{ backgroundColor: "var(--gray-200)" }}>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                        </select>
                        &nbsp; of {tableData.length}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "5px", marginRight: "10px" }}>
                        <div className="page-pagination" onClick={() => {
                            if (curentPage !== 1) {
                                setCurrentPage(prev => prev - 1);
                            }
                        }}><MdKeyboardDoubleArrowLeft size={18} /></div>
                        {listPage.map((page_number, index) => (
                            <div key={index} className={page_number === curentPage ? "page-pagination-choosed" : "page-pagination"} onClick={() => {
                                if (page_number !== "...") setCurrentPage(page_number);
                            }}>
                                {page_number}
                            </div>
                        ))}
                        <div className="page-pagination" onClick={() => {
                            const maxPage = Math.ceil(tableData.length / lengthDataPerPage);
                            if (curentPage < maxPage) {
                                setCurrentPage(prev => prev + 1);
                            }
                        }}><MdKeyboardDoubleArrowRight size={18} /></div>
                    </div>
                </div>
            </div>

            <Popup
                setShowPopup={setShowPopup}
                showPopup={showPopup}
                popupTitle={selectedData == null ? `Add New User` : `Edit User ${selectedData.username}`}
                popupContent={
                    selectedData == null ?
                        <>
                            <div className={css['popup-container']}>
                                <label className={css['popup-label']} htmlFor="username"><MdCardMembership />Username</label>
                                <div className={css['popup-input-container']}>
                                    <input className={css['popup-input']} id="username" type="text" placeholder="Fill Username Here..."
                                        value={formData?.username ?? ""}
                                        onChange={(event) => {
                                            setFormData((prevState: (FormUserInterface | null)) => {
                                                return ({
                                                    ...prevState,
                                                    username: event.target.value
                                                });
                                            });
                                        }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "10px" }}>
                                    <button className={'amber-button'}
                                        onClick={() => { handleSaveAddNew() }}
                                    >
                                        <FaSave /> &nbsp; Save
                                    </button>
                                </div>
                            </div>
                        </> :
                        <>
                            <div className={css['popup-container']}>
                                <label className={css['popup-label']} htmlFor="username"><MdCardMembership />Username</label>
                                <div className={css['popup-input-container']}>
                                    <input className={css['popup-input']} id="username" type="text" placeholder="Fill Username Here..."
                                        value={formData?.username ?? ""}
                                        onChange={(event) => {
                                            setFormData((prevState: (FormUserInterface | null)) => {
                                                return ({
                                                    ...prevState,
                                                    username: event.target.value
                                                });
                                            });
                                        }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "10px" }}>
                                    <button className={'rose-button'}
                                        onClick={() => { handleDelete() }}
                                    >
                                        <FaTrash /> &nbsp; Delete
                                    </button>
                                    <button className={'amber-button'}
                                        onClick={() => { handleSaveEdit() }}
                                    >
                                        <FaSave /> &nbsp; Save
                                    </button>
                                </div>
                            </div>
                        </>
                }
            />
        </div>

    )
}

export default MasterUser