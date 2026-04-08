"use client";

import { useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import { SparePart } from "@prisma/client";
import { getInventory, addSparePart, updateSparePart, deleteSparePart } from "@/src/server/actions/inventory.actions"; 
import { Action, initialState } from "@/src/constants/inventory";
import { InventoryState } from "@/src/types";
import { SparePartFormValues } from "../validations/validations"; 

function reducer(state: InventoryState, action: Action): InventoryState {
  switch (action.type) {
    case "SET_PARTS": return { ...state, parts: action.payload, isLoading: false };
    case "SET_SEARCH": return { ...state, searchQuery: action.payload };
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "SET_SUBMITTING": return { ...state, isSubmitting: action.payload };
    case "OPEN_MODAL": 
      return {
        ...state,
        modals: { ...state.modals, [action.payload.type]: true },
        editingId: action.payload.editData ? action.payload.editData.id : null,
      };
    case "CLOSE_MODALS": return { ...state, modals: initialState.modals, editingId: null };
    default: return state;
  }
}

export function useInventory() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchInventory = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const res = await getInventory(); 
    if (res.success) dispatch({ type: "SET_PARTS", payload: (res.data as SparePart[]) || [] });
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleSavePart = async (data: SparePartFormValues) => {
    let res;
    if (state.editingId) {
      res = await updateSparePart(state.editingId, data);
    } else {
      res = await addSparePart(data); 
    }

    if (res.success) {
      toast.success(state.editingId ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
      fetchInventory();
      return true; 
    } else {
      toast.error(res.error || "حدث خطأ أثناء الحفظ");
      return false;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف القطعة (${name}) نهائياً؟`)) {
      const res = await deleteSparePart(id);
      if (res.success) { 
        toast.success("تم الحذف"); 
        fetchInventory(); 
      } else { 
        toast.error(res.error || "حدث خطأ أثناء الحذف"); 
      }
    }
  };

  const filteredParts = state.parts.filter(part => 
    part.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return { state, filteredParts, dispatch, actions: { handleSavePart, handleDelete } };
}