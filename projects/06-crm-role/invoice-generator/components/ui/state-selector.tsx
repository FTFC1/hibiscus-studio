"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { US_STATES, searchStates, type USState } from "@/lib/us-states"

interface StateSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function StateSelector({ 
  value, 
  onValueChange, 
  placeholder = "Search states...",
  className 
}: StateSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const selectedState = React.useMemo(() => {
    return US_STATES.find(state => state.name === value || state.abbreviation === value)
  }, [value])

  const filteredStates = React.useMemo(() => {
    return searchStates(searchQuery)
  }, [searchQuery])

  const handleSelect = (stateName: string) => {
    const state = US_STATES.find(s => s.name === stateName)
    if (state) {
      onValueChange?.(state.name)
      setOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-11 w-full justify-between text-left font-normal",
            !selectedState && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {selectedState ? (
              <>
                <span className="font-medium">{selectedState.name}</span>
                <span className="text-sm text-muted-foreground">({selectedState.abbreviation})</span>
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="w-full">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search by state name, abbreviation, or capital..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              No states found.
            </CommandEmpty>
            <CommandGroup>
              {filteredStates.map((state) => (
                <CommandItem
                  key={state.abbreviation}
                  value={state.name}
                  onSelect={() => handleSelect(state.name)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{state.name}</span>
                    <span className="text-sm text-muted-foreground">({state.abbreviation})</span>
                  </div>
                  {state.capital && (
                    <span className="text-xs text-muted-foreground">{state.capital}</span>
                  )}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedState?.name === state.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 