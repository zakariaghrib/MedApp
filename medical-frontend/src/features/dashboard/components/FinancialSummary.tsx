import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export function FinancialSummary() {
  return (
    <Card className="border-slate-200/60 shadow-sm shrink-0">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          Finances (Ce mois)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col gap-5">
          {/* Main Revenue */}
          <div>
            <div className="flex items-end justify-between mb-1">
              <h4 className="text-sm font-medium text-slate-500">Chiffre d'Affaires</h4>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">14 250 DH</p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-slate-100"></div>

          {/* Pending Invoices */}
          <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3 border border-amber-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">En attente de paiement</p>
                <p className="text-xs text-slate-500">4 factures non réglées</p>
              </div>
            </div>
            <span className="text-sm font-bold text-amber-700">1 800 DH</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
