import { Dispatch } from "react";
import { Package, Search } from "lucide-react";
import { InventoryState } from "@/src/types";
import { Action } from "@/src/constants/inventory";

interface InventoryToolbarProps {
  state: InventoryState;
  dispatch: Dispatch<Action>;
}

export const InventoryToolbar = ({ state, dispatch }: InventoryToolbarProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div>
      <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
        <Package className="w-6 h-6 text-indigo-600" /> إدارة المخزون
      </h1>
      <p className="text-gray-500 text-sm mt-1">تتبع كميات قطع الغيار وأسعارها وتنبيهات النواقص</p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="ابحث عن قطعة..." 
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-sm transition"
        />
      </div>
      <button 
        onClick={() => dispatch({ type: "OPEN_MODAL", payload: { type: "addEdit" } })}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition whitespace-nowrap"
      >
        + إضافة صنف جديد
      </button>
    </div>
  </div>
);