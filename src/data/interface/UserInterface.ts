interface UserInterface {
    id?: number;
    username?: string;
    role?: string; 
}

interface UserAuthInterface { 
    username: string;
    role: string; 
}

interface FormUserInterface {
    id?: number;
    id_role?: number;
    username?: string;
    role?: string;
}

interface RoleInterface {
    id: number;
    role: string;
}

export { UserInterface, FormUserInterface, UserAuthInterface, RoleInterface } 