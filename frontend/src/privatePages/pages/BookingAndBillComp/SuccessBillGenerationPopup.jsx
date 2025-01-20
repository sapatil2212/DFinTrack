import React from "react";
import { CheckCircle, FileText, FileIcon, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function SuccessBillGenerationPopup({
  isOpen,
  onClose,
  onExportPDF,
  onExportCSV,
  onViewBill, // New callback for viewing the bill
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] bg-white text-black"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-6 w-6" />
            Bill Generated Successfully
          </DialogTitle>
          <DialogDescription>
            Your bill has been generated successfully. You can now export it in
            different formats or view the details.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 mt-4">
          <Button
            onClick={onExportPDF}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
          <Button
            onClick={onExportCSV}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export as CSV
          </Button>
          <Button
            onClick={onViewBill} // Trigger view bill action
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Bill
          </Button>
        </div>
        <DialogFooter className="sm:justify-start mt-6">
          <Button variant="outline" onClick={onClose} className="text-black">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SuccessBillGenerationPopup;
