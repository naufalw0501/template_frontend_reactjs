interface UserInterface {
    id?: number;
    username?: string;
    role?: string; 
}

interface AddUserInterface {
    id?: number;
    id_role?: number;
    username?: string;
    role?: string;
}

interface RoleInterface {
    id: number;
    role: string;
}

export { UserInterface, AddUserInterface, RoleInterface } 