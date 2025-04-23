import { GoDotFill } from "react-icons/go"; 
import { FaRegListAlt } from "react-icons/fa"; 

const NavBarLinks : any = [ 
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
        ]
    },
]

export default NavBarLinks