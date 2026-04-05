import { Calendar, ArrowUpCircle, ArrowDownCircle } from "lucide-react";



export const TransactionTable = ({ transactions }: { transactions: any[] }) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center gap-2 font-bold text-gray-700">
            <Calendar className="w-5 h-5 text-indigo-500" /> كشف حساب الحركات المالية
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="p-4 font-medium">التاريخ</th>
                        <th className="p-4 font-medium">النوع</th>
                        <th className="p-4 font-medium">التفاصيل / ملاحظات</th>
                        <th className="p-4 font-medium">المبلغ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-10 text-center text-gray-400 font-medium">لا توجد حركات مالية مسجلة بعد لهذا العامل.</td>
                        </tr>
                    ) : (
                        transactions.map((tx: any) => (
                            <tr key={tx.id} className="hover:bg-gray-50/30 transition">
                                <td className="p-4 text-gray-500 font-mono text-xs">
                                    {new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </td>
                                <td className="p-4">
                                    {tx.type === "STAKE" || tx.type === "BONUS" ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                            <ArrowUpCircle className="w-4 h-4" /> استحقاق/مكافأة
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                                            <ArrowDownCircle className="w-4 h-4" /> سحبيات/دفعات
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-600 font-medium">
                                    {tx.description || "---"}
                                </td>
                                <td className={`p-4 font-black text-lg ${tx.type === "STAKE" || tx.type === "BONUS" ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {tx.type === "STAKE" || tx.type === "BONUS" ? "+" : "-"}
                                    {tx.amount.toFixed(2)} ₪
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);