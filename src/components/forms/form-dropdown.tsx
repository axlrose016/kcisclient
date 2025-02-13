"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LibraryOption } from "../interfaces/library-interface";

interface FormDropDownProps {
  options: LibraryOption[];
  selectedOption: any | null; // Use number since ID is usually numeric
  label?: string;
  id?: string;
  onChange: (id: number) => void; // Function that receives the selected ID
  menuPortalTarget?: string;
  name?: string
}

export function FormDropDown({ options, selectedOption, label, onChange, id, name, menuPortalTarget,  }: FormDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<any>(selectedOption);
  const [selectedId, setSelectedId] = React.useState<number | null>(selectedOption);

  React.useEffect(() => {
    setSelected(selectedOption);
    // setSelectedId(selectedOption);
  }, [selectedOption]);

  // const handleSelect = (option: any) => {
  //   setSelected(option);
  //   setOpen(false);
  //   onChange(option); // Pass the entire option object back
  // };
  const handleSelect = (id: number) => {
    setSelectedId(id);
    setOpen(false);
    onChange(id); // Call onChange with the selected ID
  };

  const handleBlur = (id: number) => {
    setSelectedId(id);
    setOpen(false);
    onChange(id); // Call onChange with the selected ID
  };

  return (
    <div className="w-full p-0 z-[9999]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onClick={(e) => e.stopPropagation()}
            name={name}
          >
            {selectedId !== null
              ? options.find((option) => option.id === selectedId)?.name
              : label}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-[9999]">
          <Command>
            <CommandInput placeholder={label} />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.id} value={option.name} id={id}  onSelect={() => handleSelect(option.id)}>
                    {option.name}
                    <Check className={cn("ml-auto", selectedId === option.id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
