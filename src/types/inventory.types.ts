import { SparePart } from "@prisma/client";

export interface InventoryState {
  parts: SparePart[];
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  modals: { addEdit: boolean };
  editingId: string | null;
  forms: {
    part: { name: string; quantity: string; averageCost: string; sellingPrice: string; lowStockAlert: string };
  };
}