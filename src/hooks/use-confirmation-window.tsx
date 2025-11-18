import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const useConfirmationWindow = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [confirmationResolver, setConfirmationResolver] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirmation = () =>
    new Promise((resolve) => {
      setConfirmationResolver({ resolve });
    });

  const handleClose = () => {
    setConfirmationResolver(null);
  };

  const handleCancel = () => {
    confirmationResolver?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    confirmationResolver?.resolve(true);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={confirmationResolver !== null} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirmation];
};
