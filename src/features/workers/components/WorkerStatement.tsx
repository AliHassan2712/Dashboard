import { ArrowUpCircle, ArrowDownCircle, Calendar, FileText } from "lucide-react";

export const WorkerStatementTable = ({ transactions }: { transactions: any[] }) => {
  const getTypeText = (type: string) => {
    switch (type) {
      case 'STAKE': return { label: "استحقاق تذكرة", color: "text-emerald-600", bg: "bg-emerald-50", icon: ArrowUpCircle };
      case 'BONUS': return { label: "مكافأة", color: "text-blue-600", bg: "bg-blue-50", icon: ArrowUpCircle };
      case 'ADVANCE': return { label: "سلفة مسبقة", color: "text-amber-600", bg: "bg-amber-50", icon: ArrowDownCircle };
      case 'PAYOUT': return { label: "دفع راتب", color: "text-rose-600", bg: "bg-rose-50", icon: ArrowDownCircle };
      default: return { label: "غير معروف", color: "text-gray-600", bg: "bg-gray-50", icon: FileText };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <table className="w-full text-right text-sm">
        <thead className="bg-gray-50 text-gray-500 font-bold border-b">
          <tr>
            <th className="p-4">التاريخ</th>
            <th className="p-4">نوع المعاملة</th>
            <th className="p-4">الوصف / البيان</th>
            <th className="p-4">القيمة (₪)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 font-bold">
          {transactions.map((tx) => {
            const config = getTypeText(tx.type);
            const Icon = config.icon;
            return (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-gray-400 flex items-center gap-2">
                   <Calendar className="w-4 h-4" />
                   {new Date(tx.date).toLocaleDateString('ar-EG')}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1.5 rounded-lg flex items-center gap-2 w-fit ${config.bg} ${config.color} text-[10px]`}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </span>
                </td>
                <td className="p-4 text-gray-800">{tx.description || "---"}</td>
                <td className={`p-4 font-black ${tx.type === 'STAKE' || tx.type === 'BONUS' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'ADVANCE' || tx.type === 'PAYOUT' ? '-' : '+'} {tx.amount.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};