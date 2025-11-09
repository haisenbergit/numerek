import { atom, useAtom } from "jotai";

/**
 * Atom representing the open/closed state of the "Create Workspace" modal.
 *
 * `true` means the modal is open, `false` means it is closed.
 * This atom is used to share modal visibility state across components.
 */
const modalState = atom(false);
/**
 * Custom hook to access and control the "Create Workspace" modal state.
 *
 * Returns a tuple: [isOpen, setIsOpen], where:
 * - isOpen: boolean indicating if the modal is open
 * - setIsOpen: function to update the modal's open/closed state
 *
 * Usage:
 *   const [isOpen, setIsOpen] = useCreateWorkspaceModal();
 */

export const useCreateWorkspaceModal = () => {
  return useAtom(modalState);
};
