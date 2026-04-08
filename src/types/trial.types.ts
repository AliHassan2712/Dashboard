import { TrialStatus } from "@prisma/client";

export interface TrialItemData {
  id: string;
  notes: string | null;
  status: TrialStatus;
  givenAt: Date;
  qty: number;
  worker?: { name: string } | null;
  sparePart?: { name: string } | null;
  ticket?: { id: string; customerName: string } | null;
}

export interface TrialFormData {
  workerId: string;
  sparePartId: string;
  qty: string;
  notes: string;
}

export interface WorkerOption {
  id: string;
  name: string;
}

export interface PartOption {
  id: string;
  name: string;
  quantity: number;
}