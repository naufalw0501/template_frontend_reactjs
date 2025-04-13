import { GoDotFill } from "react-icons/go";
import { MdDashboard, MdOutlineMeetingRoom } from "react-icons/md";
import { RiInboxArchiveFill } from "react-icons/ri";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import { FaRegListAlt } from "react-icons/fa";
import { VscVmActive } from "react-icons/vsc";
import { TbListDetails } from "react-icons/tb";

const NavBarLinks : any = [
    {
        title : "Dashboard",
        link : "/dashboard",
        icon : <MdDashboard />,
        roles : ["Admin"],
        child : []
    },
    {
        title : "Room Check In",
        link : "/room_check_in",
        icon : <RiInboxArchiveFill />,
        roles : ["Admin", "Petugas Laundry"],
        child : []
    },
    {
        title : "Room Check Out",
        link : "/room_check_out",
        icon : <RiInboxUnarchiveFill />,
        roles : ["Admin", "Petugas Laundry"],
        child : []
    },
    {
        title : "Active Linen",
        link : "/active_linen",
        icon : <VscVmActive />,
        roles : ["Admin"],
        child : []
    },
    {
        title : "Room Linen",
        link : "/room_linen",
        icon : <MdOutlineMeetingRoom />,
        roles : ["Admin", "Petugas Ruangan"],
        child : []
    },
    {
        title : "Linen Detail",
        link : "/linen_detail",
        icon : <TbListDetails />,
        roles : ["Admin", "Petugas Ruangan"],
        child : []
    },
    {
        title : "Master",
        link : null,
        icon : <FaRegListAlt />,
        roles : ["Admin"],
        child : [
            {
                title : "User",
                link : "/master/user",
                icon : <GoDotFill />,
                roles : ["Admin"],
            },
            {
                title : "Room",
                link : "/master/room",
                icon : <GoDotFill />,
                roles : ["Admin"],
            },
            {
                title : "Linen Type",
                link : "/master/linen_type",
                icon : <GoDotFill />,
                roles : ["Admin"],
            },
        ]
    },
]

export default NavBarLinks