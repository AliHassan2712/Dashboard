import { SparePart } from "@prisma/client";
import { InventoryState } from "@/src/types";

export const initialState: InventoryState = {
  parts: [],
  searchQuery: "",
  isLoading: true,
  isSubmitting: false,
  modals: { addEdit: false },
  editingId: null,
};

export type Action =
  | { type: "SET_PARTS"; payload: SparePart[] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "OPEN_MODAL"; payload: { type: keyof InventoryState["modals"], editData?: SparePart | null } }
  | { type: "CLOSE_MODALS" }
