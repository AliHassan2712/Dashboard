"use client";

import { useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import { SparePart } from "@prisma/client";
import { getInventory, addSparePart, updateSparePart, deleteSparePart } from "../actions";
import { Action, initialState } from "@/src/constants/inventory";
import { InventoryState } from "@/src/types";


function reducer(state: InventoryState, action: Action): InventoryState {
  switch (action.type) {
    case "SET_PARTS": return { ...state, parts: action.payload, isLoading: false };
    case "SET_SEARCH": return { ...state, searchQuery: action.payload };
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "SET_SUBMITTING": return { ...state, isSubmitting: action.payload };
    case "OPEN_MODAL": {
      if (action.payload.editData) {
        return {
          ...state,
          modals: { ...state.modals, [action.payload.type]: true },
          editingId: action.payload.editData.id,
          forms: { part: { 
            name: action.payload.editData.name, 
            quantity: String(action.payload.editData.quantity), 
            averageCost: String(action.payload.editData.averageCost || 0),
            sellingPrice: String(action.payload.editData.sellingPrice),
            lowStockAlert: String(action.payload.editData.lowStockAlert)
          }}
        };
      }
      return {
        ...state,
        modals: { ...state.modals, [action.payload.type]: true },
        editingId: null,
        forms: initialState.forms 
      };
    }
    case "CLOSE_MODALS": return { ...state, modals: initialState.modals, editingId: null };
    case "UPDATE_FORM": return { ...state, forms: { part: { ...state.forms.part, [action.field]: action.value } } };
    default: return state;
  }
}

export function useInventory() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchInventory = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const res = await getInventory(); 
    if (res.success) dispatch({ type: "SET_PARTS", payload: res.data as SparePart[] || [] });
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleSavePart = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    
    const payload = {
      name: state.forms.part.name,
      quantity: Number(state.forms.part.quantity),
      averageCost: Number(state.forms.part.averageCost),
      sellingPrice: Number(state.forms.part.sellingPrice),
      lowStockAlert: Number(state.forms.part.lowStockAlert)
    };

    let res;
    if (state.editingId) {
      res = await updateSparePart(state.editingId, payload);
    } else {
      res = await addSparePart(payload); 
    }

    if (res.success) {
      toast.success(state.editingId ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
      dispatch({ type: "CLOSE_MODALS" });
      fetchInventory();
    } else {
      toast.error(res.error || "حدث خطأ أثناء الحفظ");
    }
    dispatch({ type: "SET_SUBMITTING", payload: false });
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