interface UserInterface {
    id?: number;
    username?: string;
    role_name?: string; 
}

interface UserAuthInterface { 
    username: string;
    role_name: string; 
}

interface FormUserInterface {
    id?: number;
    id_role?: number;
    username?: string;
    role_name?: string;
}

interface RoleInterface {
    id: number;
    role_name: string;
}

export { UserInterface, FormUserInterface, UserAuthInterface, RoleInterface } 