"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWorkerDetails } from "@/src/features/workers/actions";
import { ExportButton } from "@/src/components/shared/ExportButton";
import { Wallet, TrendingUp, TrendingDown, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { WorkerStatementTable } from "@/src/features/workers/components/WorkerStatement";

export default function WorkerStatementPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await getWorkerDetails(params.id as string);
      if (res.success) setData(res.data);
      setIsLoading(false);
    };
    load();
  }, [params.id]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-20">
      
      {/* الترويسة والرجوع */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/workers" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-indigo-600 transition">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">كشف حساب: {data.name}</h1>
            <p className="text-sm text-gray-500 font-bold">عرض كافة السلف، الاستحقاقات والرواتب</p>
          </div>
        </div>
        <ExportButton 
          data={data.transactions.map((t: any) => ({
            "التاريخ": new Date(t.date).toLocaleDateString('ar-EG'),
            "البيان": t.description,
            "النوع": t.type,
            "المبلغ (₪)": t.amount
          }))}
          fileName={`كشف_حساب_${data.name}`}
        />
      </div>

      {/* ملخص الرصيد */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 font-bold mb-1">الرصيد المتبقي (الصافي)</p>
            <h2 className={`text-5xl font-black ${data.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₪ {data.balance.toFixed(2)}
            </h2>
          </div>
          <Wallet className="w-24 h-24 absolute -right-4 -bottom-4 opacity-10" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-center gap-2">
            <TrendingUp className="text-emerald-500 w-6 h-6" />
            <p className="text-xs font-bold text-gray-500">مجموع الاستحقاقات</p>
            <p className="text-xl font-black text-gray-900">₪ {data.transactions.filter((t:any) => t.type === 'STAKE' || t.type === 'BONUS').reduce((acc:number, t:any) => acc + t.amount, 0).toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-center gap-2">
            <TrendingDown className="text-rose-500 w-6 h-6" />
            <p className="text-xs font-bold text-gray-500">مجموع المدفوع والسلف</p>
            <p className="text-xl font-black text-gray-900">₪ {data.transactions.filter((t:any) => t.type === 'ADVANCE' || t.type === 'PAYOUT').reduce((acc:number, t:any) => acc + t.amount, 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* جدول الحركات */}
      <WorkerStatementTable transactions={data.transactions} />

    </div>
  );
}