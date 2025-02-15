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
  role_description: string,
}

export interface IModules{
  module_description: string,
}

export interface IPermissions{
  permission_description: string
}

