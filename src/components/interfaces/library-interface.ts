export interface LibraryOption{
  id: any,
  name: string
}

export interface LibraryOptions{
  options: LibraryOption[],
  selectedOption: string,
  label?:string,
  onChange?: (selectedValue: string) => void;
}

export interface IRoles{
  id: string,
  role_description: string,
  created_date: string,            
  created_by: string,              
  last_modified_date: string | null, 
  last_modified_by: string | null,  
  push_status_id: number,     
  push_date: string,              
  deleted_date: string | null,      
  deleted_by: string | null,        
  is_deleted: boolean,             
  remarks: string | null,    
}

export interface IModules{
  id:string,
  module_description: string,
  module_path: string,
  created_date: string,            
  created_by: string,              
  last_modified_date: string | null, 
  last_modified_by: string | null,  
  push_status_id: number,     
  push_date: string,              
  deleted_date: string | null,      
  deleted_by: string | null,        
  is_deleted: boolean,             
  remarks: string | null,    
}

export interface IPermissions{
  id: string,
  permission_description: string;
  created_date: string,            
  created_by: string,              
  last_modified_date: string | null, 
  last_modified_by: string | null,  
  push_status_id: number,     
  push_date: string,              
  deleted_date: string | null,      
  deleted_by: string | null,        
  is_deleted: boolean,             
  remarks: string | null,     
}

