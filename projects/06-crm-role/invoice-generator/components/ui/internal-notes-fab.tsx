"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { FileText } from "lucide-react"

interface InternalNotesFABProps {
  notes: string
  onNotesChange: (notes: string) => void
}

export function InternalNotesFAB({ notes, onNotesChange }: InternalNotesFABProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalNotes, setInternalNotes] = React.useState(notes)

  React.useEffect(() => {
    setInternalNotes(notes)
  }, [notes])

  const handleSave = () => {
    onNotesChange(internalNotes)
    setIsOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-16 h-16 shadow-lg bg-slate-800 hover:bg-slate-900 text-white"
            >
              <FileText className="w-6 h-6" />
              <span className="sr-only">Open Internal Notes</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Internal Notes</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add any internal notes, status updates, or team communications..."
                className="min-h-[150px] text-base resize-none"
                rows={6}
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsOpen(false)} variant="ghost">
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Notes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
} 