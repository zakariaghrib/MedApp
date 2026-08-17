import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PatientForm } from '../components/PatientForm';
import { Stethoscope, Edit, FileText, Calendar, Activity, Droplet, Weight, Ruler, User, Phone, ChevronRight, ArrowLeft } from 'lucide-react';

// Fausses données (Mock Data) pour la vue Dashboard unique
const mockPatient = {
  id: "P-10495",
  firstName: "Jean",
  lastName: "Dupont",
  age: 45,
  gender: "Masculin",
  cin: "AB123456",
  phone: "06 12 34 56 78",
  bloodGroup: "O+",
  weight: "75 kg",
  height: "180 cm",
  allergies: ["Pénicilline", "Arachide", "Pollen"],
  medicalHistory: [
    "Appendicectomie (2010)",
    "Hypertension artérielle (2021)"
  ],
  currentTreatments: [
    "Amlodipine 5mg - 1 cp/jour",
    "Paracétamol 1g - Si douleur"
  ],
  history: [
    { id: 1, date: "15 Oct 2023", time: "10:30", motif: "Contrôle annuel de tension" },
    { id: 2, date: "02 Fév 2023", time: "14:15", motif: "Syndrome grippal sévère" },
    { id: 3, date: "10 Nov 2022", time: "09:00", motif: "Première consultation générale" }
  ],
  documents: [
    { id: 1, name: "Ordonnance_15-10-2023.pdf", date: "15 Oct 2023" },
    { id: 2, name: "Bilan_Sanguin_Global.pdf", date: "12 Oct 2023" }
  ]
};

export function PatientProfilePage() {
  const navigate = useNavigate();
  const patient = mockPatient;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-4 bg-slate-50/50 min-h-screen">
      
      {/* Bouton de retour */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/patients')} className="text-slate-500 hover:text-slate-900 px-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>

      {/* 1. EN-TÊTE : Carte de Résumé (Pleine largeur) */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="h-1.5 bg-blue-600 w-full"></div>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Identité */}
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 hidden sm:block">
                <User className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-600 text-sm">
                  <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{patient.age} ans</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                  <span>•</span>
                  <span>CIN: <span className="font-medium text-slate-800">{patient.cin}</span></span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.phone}</span>
                </div>
              </div>
            </div>

            {/* Constantes */}
            <div className="flex-1 flex justify-start lg:justify-center gap-3 sm:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center h-10 w-10 mx-auto bg-red-50 text-red-500 rounded-full mb-1">
                  <Droplet className="h-5 w-5" />
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Groupe</div>
                <div className="font-bold text-slate-800">{patient.bloodGroup}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-10 w-10 mx-auto bg-blue-50 text-blue-500 rounded-full mb-1">
                  <Weight className="h-5 w-5" />
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Poids</div>
                <div className="font-bold text-slate-800">{patient.weight}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-10 w-10 mx-auto bg-emerald-50 text-emerald-500 rounded-full mb-1">
                  <Ruler className="h-5 w-5" />
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Taille</div>
                <div className="font-bold text-slate-800">{patient.height}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Dialog>
                <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white shadow-sm bg-blue-600 hover:bg-blue-700 h-9 px-4 py-2 rounded-md">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Modifier le patient</DialogTitle>
                    <DialogDescription>
                      Mettez à jour les informations du patient {patient.firstName} {patient.lastName}.
                    </DialogDescription>
                  </DialogHeader>
                  <PatientForm patient={patient as any} />
                </DialogContent>
              </Dialog>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-sm">
                <Stethoscope className="mr-2 h-4 w-4" />
                Nouvelle Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. CORPS DE LA PAGE : Grille à 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE (1/3) : Profil Clinique */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center text-slate-800">
                <Activity className="mr-2 h-5 w-5 text-blue-500" />
                Informations Cliniques
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              
              {/* Allergies */}
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-medium px-2.5 py-1">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Antécédents */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Antécédents / Maladies</h3>
                <ul className="space-y-2">
                  {patient.medicalHistory.map((item, index) => (
                    <li key={index} className="flex items-start text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 mr-2.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traitements */}
              <div className="p-5">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Traitements en cours</h3>
                <ul className="space-y-3">
                  {patient.currentTreatments.map((treatment, index) => (
                    <li key={index} className="flex items-center text-sm font-medium text-slate-800 bg-white border border-slate-200 p-2.5 rounded-md shadow-sm">
                      <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                      {treatment}
                    </li>
                  ))}
                </ul>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* COLONNE DROITE (2/3) : Activité & Historique */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dernières Consultations */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center text-slate-800">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Dernières Consultations
                </CardTitle>
                <CardDescription className="mt-1">Historique récent des visites du patient</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hidden sm:flex">
                Voir tout l'historique
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {patient.history.map((consult) => (
                  <div key={consult.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-start gap-4 mb-3 sm:mb-0">
                      <div className="bg-blue-50 text-blue-700 rounded-lg p-2 text-center min-w-[70px] border border-blue-100">
                        <span className="block text-lg font-bold leading-none">{consult.date.split(' ')[0]}</span>
                        <span className="block text-[10px] font-semibold uppercase mt-1">{consult.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold text-slate-900 text-base">{consult.motif}</span>
                        <span className="text-sm text-slate-500 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" /> {consult.date} à {consult.time}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-700 hover:bg-blue-50 border border-transparent group-hover:border-blue-100">
                      Voir les détails <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Derniers Documents */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center text-slate-800">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                Derniers Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patient.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer bg-white group">
                    <div className="bg-slate-100 group-hover:bg-blue-50 p-2.5 rounded-md mr-3 transition-colors">
                      <FileText className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-sm text-slate-800 truncate" title={doc.name}>{doc.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{doc.date}</p>
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
