import React from "react";
import { X, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ExistingBillPopup = ({ isOpen, onClose, onViewExistingBill }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Existing Bill Found</DialogTitle>
          <DialogDescription>
            A bill has already been generated for this booking.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onViewExistingBill}
            className="sm:justify-end border"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Existing Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingBillPopup;
