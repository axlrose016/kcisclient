"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "../ui/badge"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function FormMultiDropDown() {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  const handleSelect = (currentValue: string) => {
    setSelectedValues((prev) =>
      prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue]
    )
  }

  const handleRemove = (valueToRemove: string) => {
    setSelectedValues((prev) =>
      prev.filter((value) => value !== valueToRemove)
    )
  }

  const handleClear = () => {
    setSelectedValues([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          <div className="flex items-center gap-1 truncate">
            {selectedValues.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1 max-w-[230px] overflow-hidden">
                  {selectedValues.slice(0, 2).map((value) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="truncate max-w-[100px]"
                    >
                      {frameworks.find((framework) => framework.value === value)?.label}
                    </Badge>
                  ))}
                </div>
                {selectedValues.length > 2 && (
                  <Badge variant="secondary">+{selectedValues.length - 2}</Badge>
                )}
              </>
            ) : (
              "Select frameworks..."
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(framework.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedValues.length > 0 && (
            <div className="border-t p-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedValues.map((value) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="truncate max-w-[120px]"
                  >
                    {frameworks.find((framework) => framework.value === value)?.label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(value)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleRemove(value)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleClear}
              >
                Clear all
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

