import { useContext, useEffect, useState } from "react";
import css from './Master.module.css'
import { FaRegListAlt, FaHome, FaSortUp, FaSortDown, FaSave, FaTrash } from "react-icons/fa";
import AppContext from "../../../Context";
import { ConfirmationAlertEntity, MiniAlertEntity } from "../../layout/alert/AlertEntity";
import TableViewUtils from "../../../utility/TableViewUtils";
import { MdCardMembership, MdDescription, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdModeEdit, MdNotes, MdShoppingBag, MdWork } from "react-icons/md";
import { format } from "date-fns"
import Popup from "../../component/popup/Popup";
import { FormProductInterface, CategoryInterface, ProductInterface } from "../../../data/interface/ProductInterface";
import { ProductService } from "../../../data/service/ProductService";
import { RiRuler2Fill } from "react-icons/ri";
import { IoMdPricetag } from "react-icons/io";
import { SiShopee } from "react-icons/si";
import { FileService } from "../../../data/service/FileService";

const MasterProduct = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    const setContextLoading = context.setContextLoading;
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const contextShowConfirmationAlertFunc = context.contextShowConfirmationAlertFunc

    //State For First Open Page
    const [tableData, setTableData] = useState<ProductInterface[]>([])
    const [categoriesData, setCategoriesData] = useState<CategoryInterface[]>([])
    const [tableDataCache, setTableDataCache] = useState<ProductInterface[]>([])
    const [sortColumnChoosed, setSortColumnChoosed] = useState<keyof ProductInterface | null>(null)
    const [sortColumnType, setSortColumnType] = useState<"ascending" | "descending">("ascending")
    const [tableDataFilter, setTableDataFilter] = useState<{ [key: string]: string }>({})
    const [lengthDataPerPage, setLengthDataPerPage] = useState<number>(50)
    const [curentPage, setCurrentPage] = useState<number>(1)
    const [listPage, setListPage] = useState<any[]>([])

    //State For Popup Add and Edit
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [formData, setFormData] = useState<FormProductInterface>({})
    const [selectedData, setSelectedData] = useState<ProductInterface | null>(null)
    const [urlImageProduct, setUrlImageProduct] = useState<string | null>(null)
    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------// 

    const handlePopupAddNew = () => {
        setShowPopup(true)
        setSelectedData(null)
        setFormData({})
    }

    const handlePopupEdit = async (row_data: ProductInterface) => {
        setSelectedData(row_data)
        setFormData(row_data)
        setShowPopup(true)
        setContextLoading(true)
        try {
            const file_resp = await FileService.getFile('products', row_data.image_file);
            if (file_resp instanceof File) {
                const url = URL.createObjectURL(file_resp);
                setUrlImageProduct(url)
            }
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
            setUrlImageProduct(null)
        } finally {
            setContextLoading(false)
        }
    }

    const handleSaveAddNew = async () => {
        setContextLoading(true)
        try {
            const resp = await ProductService.createProduct(formData)
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
            const resp = await ProductService.updateProduct(selectedData, formData)
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
            alertQuestion: `Are you sure to delete ${selectedData?.product_name}?`,
            onClickYes: async () => {
                if (selectedData == null) { return }
                setContextLoading(true)
                try {
                    const resp = await ProductService.deleteProduct(selectedData)
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
            const resp_products = await ProductService.getProduct()
            setTableDataCache(resp_products.data)
            setTableData(resp_products.data);
            const resp_categories = await ProductService.getCategories()
            setCategoriesData(resp_categories.data);
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        } finally {
            setContextLoading(false)
        }
    }

    const handleSorting = (column: keyof ProductInterface | null) => {
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

    const filterTable = (column: keyof ProductInterface, columnnName?: string) => {
        return <div>
            <input style={{ fontSize: "12px", marginTop: "0.5dvh", width: "100%", maxWidth: "300px", padding: "0px 3px", borderRadius: "3px", color: "var(--primary-500)" }} type="text" value={tableDataFilter[column] ?? ""}
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

    const headerTable = (column: keyof ProductInterface, columnName?: string) => {
        return <>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "3px", whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => handleSorting(column)}>
                <div style={{ fontSize: "12px" }}>{columnName ?? column}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0", alignItems: "center", justifyItems: "center" }}>
                    <FaSortUp style={{ color: ((sortColumnChoosed == column && sortColumnType == "descending") ? "var(--primary-950)" : "var(--primary-100)"), margin: 0, padding: 0, height: '18px' }} />
                    <FaSortDown style={{ color: ((sortColumnChoosed == column && sortColumnType == "ascending") ? "var(--primary-950)" : "var(--primary-100)"), margin: "-18px", padding: 0, height: '18px' }} />
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
        // eslint-disable-next-line
    }, [tableDataFilter])

    //------------------------FUNCTIONS------------------------//

    return (
        <div className={css["page-container"]}>
            {/* Header */}
            <div className={css["header-container"]}>
                <div>
                    <div className={css["title"]}>
                        <div><FaRegListAlt className={css["icon"]} /></div>
                        <div className={css["text"]}>Master Product</div>
                    </div>
                    <div className={css["address"]}>
                        <div><FaHome /></div>
                        <div >/ Master</div>
                        <div >/ Products Active</div>
                    </div>
                </div>
                <div className={css["button-container"]}>
                    <button onClick={() => handlePopupAddNew()} className="primary-button">
                        Add New
                    </button>
                    <button onClick={() => { generateData(); setSortColumnChoosed(null); setSortColumnType('ascending') }} className="primary-button">
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
                                <th>{headerTable("product_name", "Product Name")}{filterTable("product_name", "Product Name")}</th>
                                <th>{headerTable("description", "Description")}{filterTable("description", "Description")}</th>
                                <th>{headerTable("category_name", "Category Name")}{filterTable("category_name", "Category Name")}</th>
                                <th>{headerTable("lowest_price", "Lowest Price")}{filterTable("lowest_price", "Lowest Price")}</th>
                                <th>{headerTable("highest_price", "Highest Price")}{filterTable("highest_price", "Highest Price")}</th>
                                <th>{headerTable("size", "Size")}{filterTable("size", "Size")}</th>
                                <th>{headerTable("notes", "Notes")}{filterTable("notes", "Notes")}</th>
                                <th>{headerTable("link_shopee", "Link Shopee")}{filterTable("link_shopee", "Link Shopee")}</th>
                                <th>{headerTable("link_tokopedia", "Link Tokopedia")}{filterTable("link_tokopedia", "Link Tokopedia")}</th>
                                <th>{headerTable("image_file", "Image File")}{filterTable("image_file", "Image File")}</th>
                                <th>{headerTable("updated_at", "Updated At")}{filterTable("updated_at", "Updated At")}</th>
                                <th>{headerTable("created_at", "Created At")}{filterTable("created_at", "Created At")}</th>
                                <th style={{ backgroundColor: "var(--primary-900)", width: "100px", maxWidth: "100px", minWidth: "100px", position: "sticky", right: 0, zIndex: 1 }}>Action</th>
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
                                        <td>{item.product_name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.category_name}</td>
                                        <td>{item.lowest_price}</td>
                                        <td>{item.highest_price}</td>
                                        <td>{item.size}</td>
                                        <td>{item.notes}</td>
                                        <td>{item.link_shopee}</td>
                                        <td>{item.link_tokopedia}</td>
                                        <td>{item.image_file}</td>
                                        <td>{format(item.created_at, "yyyy-MM-dd HH:mm:ss")}</td>
                                        <td>{format(item.updated_at, "yyyy-MM-dd HH:mm:ss")}</td>
                                        <td className="action-button" onClick={() => handlePopupEdit(item)} style={{ width: "100px", maxWidth: "100px", minWidth: "100px", position: "sticky", right: 0, zIndex: 1 }}>
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
                popupTitle={selectedData == null ? `Add New Product` : `Edit Product ${selectedData.product_name}`}
                popupContent={
                    <>
                        <div className={css['popup-container']} >
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                {urlImageProduct ? (
                                    <img src={urlImageProduct} alt="Product" style={{ maxWidth: '50%', maxHeight: '300px' }} />
                                ) : (
                                    <p style={{fontSize: "12px"}}>No image available</p>
                                )}
                                <input type="file" style={{fontSize: "12px", margin: "10px 0px"}}
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file == null) return
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                image_file_to_upload: file
                                            });
                                        })
                                        const url = URL.createObjectURL(file);
                                        setUrlImageProduct(url)
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="product_name"><MdCardMembership />Product Name</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="product_name" type="text" placeholder="Fill Product Name Here..."
                                    value={formData?.product_name ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                product_name: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="description"><MdDescription />Description</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="description" type="text" placeholder="Fill Description Here..."
                                    value={formData?.description ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                description: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="lowest_price"><IoMdPricetag />Lowest Price</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="lowest_price" type="number" placeholder="Fill Lowest Price Here..."
                                    value={formData?.lowest_price ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                lowest_price: parseInt(event.target.value)
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="highest_price"><IoMdPricetag />Highest Price</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="highest_price" type="number" placeholder="Fill Highest Price Here..."
                                    value={formData?.highest_price ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                highest_price: parseInt(event.target.value)
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="size"><RiRuler2Fill />Size</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="size" type="text" placeholder="Fill Size Here..."
                                    value={formData?.size ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                size: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="notes"><MdNotes />Notes</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="notes" type="text" placeholder="Fill Notes Here..."
                                    value={formData?.notes ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                notes: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="link_shopee"><SiShopee />Link Shopee</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="link_shopee" type="text" placeholder="Fill Link Shopee Here..."
                                    value={formData?.link_shopee ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                link_shopee: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="link_tokopedia"><MdShoppingBag />Link Tokopedia</label>
                            <div className={css['popup-input-container']}>
                                <input className={css['popup-input']} id="link_tokopedia" type="text" placeholder="Fill Link Tokopedia Here..."
                                    value={formData?.link_tokopedia ?? ""}
                                    onChange={(event) => {
                                        setFormData((prevState: (FormProductInterface | null)) => {
                                            return ({
                                                ...prevState,
                                                link_tokopedia: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="category_name"><MdWork />Category Name</label>
                            <select name="category_name" id="category_name" className={css['popup-input-container']}
                                value={formData?.category_name || ""}
                                onChange={(event) => {
                                    if (event.target.value === "") return
                                    const selectedCategory = categoriesData?.find(categories_data => categories_data.category_name === (event.target.value));
                                    if (selectedCategory) {
                                        setFormData((prevState: FormProductInterface) => {
                                            return ({
                                                ...prevState,
                                                id_category: selectedCategory.id,
                                                category_name: selectedCategory.category_name
                                            });
                                        });
                                    }
                                }}
                            >
                                <option value={""}>Choose Category</option>
                                {categoriesData?.map((row_category, idx) => (
                                    <option value={row_category.category_name} key={idx}>
                                        {row_category.category_name}
                                    </option>
                                ))}
                            </select>
                            {selectedData == null ?
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "10px", marginTop: "10px" }}>
                                    <button className={'primary-button'}
                                        onClick={() => { handleSaveAddNew() }}
                                    >
                                        <FaSave /> &nbsp; Save
                                    </button>
                                </div>
                                :
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "10px", marginTop: "10px" }}>
                                    <button className={'rose-button'}
                                        onClick={() => { handleDelete() }}
                                    >
                                        <FaTrash /> &nbsp; Delete
                                    </button>
                                    <button className={'primary-button'}
                                        onClick={() => { handleSaveEdit() }}
                                    >
                                        <FaSave /> &nbsp; Save
                                    </button>
                                </div>
                            }
                        </div>
                    </>

                }
            />
        </div>

    )
}

export default MasterProduct