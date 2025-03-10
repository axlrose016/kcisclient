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

export interface ILibModality {
  id:number,
  modality_name:string,
  is_active:boolean,
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

export interface ILibModalitySubCategory {
  id:number,
  modality_id: number,
  modality_sub_category_name: string,
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

export interface ILibSex{
  id:number,
  sex_description: string,
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

export interface ILibCivilStatus{
  id:number,
  civil_status_description: string,
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

export interface ILibExtensionName{
  id:number,
  extension_name: string,
  is_active: boolean,
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

export interface ILibSectors{
  id:number,
  sector_name: string,
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

export interface ILibIdCard{
  id: number,
  id_card_name: string,
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

export interface ILibEducationalAttainment{
  id:number,
  educational_attainment_description:string,
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

export interface ILibRelationshipToBeneficiary{
  id:number,
  relationship_name:string,
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

export interface ILibTypeOfDisability{
  id:number,
  disability_name:string,
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

export interface ILibCFWType{
  id:number,
  cfw_type_name: string,
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

export interface ILibYearLevel{
  id:number,
  year_level_name:string,
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

export interface ILibCourses{
  id:number,
  course_code:string,
  course_name:string,
  course_description:string,
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

export interface ILibDeploymentArea{
  id:number,
  deployment_name:string,
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
export interface ILibTypeOfWork{
  id:number,
  work_name:string,
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
export interface ILibFilesToUpload{
  id:number,
  file_name:string,
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
