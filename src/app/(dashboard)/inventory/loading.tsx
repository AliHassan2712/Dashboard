export default function InventoryLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      {/* عنوان الصفحة الوهمي */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نموذج الإضافة الوهمي */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 h-96">
          <div className="space-y-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* الجدول الوهمي */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 h-96 p-4">
           <div className="h-6 w-1/4 bg-gray-200 rounded mb-6"></div>
           <div className="space-y-3">
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="h-12 bg-gray-100 rounded"></div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}