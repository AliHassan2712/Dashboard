import { Package, Search } from "lucide-react";

interface InventoryToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
}

export const InventoryToolbar = ({ searchQuery, setSearchQuery, onOpenAddModal }: InventoryToolbarProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm">
    <div>
      <h1 className="text-2xl font-black text-app-text-primary-light dark:text-app-text-primary-dark flex items-center gap-2">
        <Package className="w-6 h-6 text-brand-600 dark:text-brand-400" /> إدارة المخزون
      </h1>
      <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark text-sm mt-1">تتبع كميات قطع الغيار وأسعارها وتنبيهات النواقص</p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted-light dark:text-app-text-muted-dark" />
        <input 
          type="text" 
          placeholder="ابحث عن قطعة..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-app-border-light dark:border-app-border-dark focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-sm transition"
        />
      </div>
      <button 
        onClick={onOpenAddModal}
        className="bg-brand-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition whitespace-nowrap"
      >
        + إضافة صنف جديد
      </button>
    </div>
  </div>
);