export interface IUserData{
    name?: string,
    email?: string,
    photo?: string,
    role?: string,
    userAccess?: IUserAccess[]
  }
  
  export interface IUserAccess{
    role?: string,
    module?: string,
    module_path?: string,
    permission?: string
  }


export interface IUser {
    id: string;                      
    username: string;                
    email: string;                    
    password: string;                 
    role_id: string;                  
    created_date: string;            
    created_by: string;              
    last_modified_date: string | null; 
    last_modified_by: string | null;  
    push_status_id: number;           
    push_date: string;               
    deleted_date: string | null;      
    deleted_by: string | null;        
    is_deleted: boolean;              
    remarks: string | null;          
  }
  