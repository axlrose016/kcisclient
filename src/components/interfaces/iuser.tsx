//IUserData and IUserrDataAccess is ginagamit para ifilter yung routes.
//ginagamit din ito para sa middleware para hindi maaccess yung mga protected routes.
export interface IUserData{
  token?: string,
  name?: string,
  email?: string,
  photo?: string,
  role?: string,
  userAccess?: IUserDataAccess[]
}
  
export interface IUserDataAccess{
  role?: string,
  module?: string,
  module_path?: string,
  permission?: string
}

export interface IUserAccess{
  id: string,
  user_id: string,
  module_id: string,
  permission_id: string,
  created_date: string;            
  created_by: string;              
  last_modified_date: string | null; 
  last_modified_by: string | null;  
  push_status_id: number;           
  push_date: string | null;               
  deleted_date: string | null;      
  deleted_by: string | null;        
  is_deleted: boolean;              
  remarks: string | null;  
}


export interface IUser {
  id: string;                      
  username: string;                
  email: string;                    
  password: any;      
  salt: any;           
  role_id: string;                  
  created_date: string;            
  created_by: string;              
  last_modified_date: string | null; 
  last_modified_by: string | null;  
  push_status_id: number;           
  push_date: string | null;               
  deleted_date: string | null;      
  deleted_by: string | null;        
  is_deleted: boolean;              
  remarks: string | null;          
}
  