
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Upload } from 'lucide-react';
import { parseICSFile } from '@/utils/calendarUtils';
import { toast } from 'sonner';
import { Event } from '@/data/mockData';

interface ImportCalendarProps {
  onImport: (events: Event[]) => void;
}

const ImportCalendar: React.FC<ImportCalendarProps> = ({ onImport }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    
    reader.readAsText(file);
  };
  
  const handleImport = () => {
    if (!fileContent) return;
    
    try {
      const importedEvents = parseICSFile(fileContent);
      onImport(importedEvents);
      toast.success(`Successfully imported ${importedEvents.length} events`);
      setIsDialogOpen(false);
      // Reset after import
      setFileContent(null);
      setFileName('');
    } catch (error) {
      console.error('Error importing calendar:', error);
      toast.error('Failed to import calendar. Please check the file format.');
    }
  };

  const handleSelectFileClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        <span>Import Calendar</span>
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          // Reset when dialog is closed
          setFileContent(null);
          setFileName('');
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Calendar</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-8">
              <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
              
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium">
                  Upload an .ics calendar file
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop or click to browse
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".ics"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <Button 
                variant="outline" 
                type="button" 
                size="sm"
                onClick={handleSelectFileClick}
                className="mt-4"
              >
                Select File
              </Button>
              
              {fileName && (
                <p className="mt-2 text-sm">{fileName}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsDialogOpen(false)} 
              variant="outline"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!fileContent}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportCalendar;
