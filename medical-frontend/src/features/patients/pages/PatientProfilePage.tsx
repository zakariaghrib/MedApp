import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '../services/patient.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, User, Phone, Mail, IdCard, ShieldCheck, 
  Droplet, Weight, Ruler, AlertCircle, Stethoscope, 
  Activity, Pill, CalendarDays, FileText, CalendarClock, ChevronRight
} from 'lucide-react';

export function PatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id!),
    enabled: !!id
  });

  const patient = response?.data || response;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-4 bg-slate-50/50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-4 bg-slate-50/50 min-h-screen flex flex-col items-center justify-center">
        <p className="text-slate-600 mb-4">Erreur lors du chargement du patient.</p>
        <Button onClick={() => navigate('/patients')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
        </Button>
      </div>
    );
  }

  const age = patient.dateOfBirth 
    ? Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / 3.15576e+10) 
    : 'N/A';

  // Parser les allergies si c'est une liste séparée par des virgules
  const allergiesList = patient.allergies 
    ? patient.allergies.split(',').map((a: string) => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Bouton de retour */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/patients')} className="text-slate-500 hover:text-slate-900 px-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux patients
        </Button>
      </div>

      {/* =========================================================
          SECTION 1 : IDENTITÉ ET CONTACT (EN-TÊTE)
          ========================================================= */}
      <Card className="border-slate-200 shadow-md bg-white overflow-hidden rounded-2xl">
        <div className="h-2 bg-linear-to-r from-blue-600 to-cyan-500 w-full"></div>
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row border-b border-slate-100">
            
            {/* Infos Principales */}
            <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50/80 p-4 rounded-2xl text-blue-600 shadow-inner">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{age} ans</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</span>
                    <span className="text-slate-400">•</span>
                    {patient.status === 'ACTIVE' ? (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none shadow-none text-xs">Actif</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Non Actif</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Coordonnées & Administratif */}
            <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Phone className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Téléphone</p>
                  <p className="text-sm font-medium text-slate-900">{patient.phone || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Mail className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-slate-900">{patient.email || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">CIN</p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1"><IdCard className="h-3 w-3 text-slate-400" /> {patient.cin}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Mutuelle</p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> {patient.mutuelle || '-'}</p>
                </div>
              </div>
            </div>

            {/* Constantes de base */}
            <div className="p-6 lg:w-1/3 flex justify-around items-center bg-slate-50/50">
              <div className="flex flex-col items-center">
                <div className="bg-red-50 text-red-500 p-3 rounded-full mb-2 shadow-sm border border-red-100"><Droplet className="h-5 w-5" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Groupe</span>
                <span className="text-base font-extrabold text-slate-800">{patient.bloodGroup || '-'}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 text-blue-500 p-3 rounded-full mb-2 shadow-sm border border-blue-100"><Weight className="h-5 w-5" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Poids</span>
                <span className="text-base font-extrabold text-slate-800">72 kg</span> {/* Mock */}
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-amber-50 text-amber-500 p-3 rounded-full mb-2 shadow-sm border border-amber-100"><Ruler className="h-5 w-5" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taille</span>
                <span className="text-base font-extrabold text-slate-800">178 cm</span> {/* Mock */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* =========================================================
            SECTION 2 : LE PROFIL CLINIQUE (Gauche, 2 colonnes)
            ========================================================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Profil Clinique</h2>
          </div>

          {/* Allergies - TRES VISIBLE */}
          <Card className="border-red-200 shadow-sm bg-red-50/30 overflow-hidden">
            <div className="bg-red-100/50 px-5 py-3 border-b border-red-100 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-red-900">Allergies Connues</h3>
            </div>
            <CardContent className="p-5">
              {allergiesList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allergiesList.map((allergie: string, idx: number) => (
                    <Badge key={idx} className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 text-sm px-3 py-1 shadow-sm">
                      {allergie}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">Aucune allergie renseignée pour ce patient.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Antécédents */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                  <Stethoscope className="h-4 w-4 text-blue-500" />
                  Antécédents Médicaux
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {patient.medicalHistory ? (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{patient.medicalHistory}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">Aucun antécédent renseigné.</p>
                )}
                
                <Separator className="my-4" />
                
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Maladies Chroniques</h4>
                {patient.chronicConditions ? (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{patient.chronicConditions}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">Aucune maladie chronique.</p>
                )}
              </CardContent>
            </Card>

            {/* Traitements en cours (MOCK) */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                  <Pill className="h-4 w-4 text-purple-500" />
                  Traitements en cours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-slate-100">
                  <li className="p-4 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-bold text-slate-800">Amlodipine 5mg</p>
                    <p className="text-xs text-slate-500 mt-1">1 comprimé par jour (Matin)</p>
                  </li>
                  <li className="p-4 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-bold text-slate-800">Paracétamol 1g</p>
                    <p className="text-xs text-slate-500 mt-1">Si douleur, max 3/jour</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* =========================================================
            SECTION 3 : L'HISTORIQUE ET LE SUIVI (Droite, 1 colonne)
            ========================================================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Suivi Patient</h2>
          </div>

          {/* Prochain RDV (MOCK) */}
          <Card className="border-teal-200 shadow-sm bg-teal-50/30 overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Prochain Rendez-vous</p>
                <p className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-teal-500" />
                  24 Septembre 2024
                </p>
                <p className="text-sm text-slate-600 mt-1">à 10h30 - Contrôle de routine</p>
              </div>
            </CardContent>
          </Card>

          {/* Historique des Consultations (MOCK) */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-slate-800">Dernières Consultations</CardTitle>
              <Button variant="link" className="text-blue-600 p-0 h-auto text-xs">Voir tout</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { date: '12 Août 2024', motif: 'Douleurs articulaires', status: 'Terminée' },
                  { date: '05 Mars 2024', motif: 'Renouvellement ordonnance', status: 'Terminée' },
                  { date: '10 Déc 2023', motif: 'Bilan annuel', status: 'Terminée' },
                ].map((cons, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{cons.date}</p>
                      <p className="text-xs text-slate-500 mt-1">{cons.motif}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents Récents (MOCK) */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <FileText className="h-4 w-4 text-slate-500" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { name: 'Ordonnance_12-08.pdf', type: 'Ordonnance' },
                  { name: 'Resultats_Sanguins.pdf', type: 'Bilan' },
                ].map((doc, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded text-red-500">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-slate-800 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>

    </div>
  );
}
