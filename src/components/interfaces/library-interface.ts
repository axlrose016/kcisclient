export interface LibraryOption{
  id: number,
  name: string
}

export interface LibraryOptions{
  options: LibraryOption[],
  selectedOption: string,
  label?:string
}

export interface IRoles{
  role_description: string,
}

export interface IModules{
  module_description: string,
}

export interface IPermissions{
  permission_description: string
}

export interface IUserData{
  name?: string,
  email?: string,
  photo?: string,
  userAccess?: IUserAccess[]
}

export interface IUserAccess{
  role?: string,
  module?: string,
  permission?: string
}