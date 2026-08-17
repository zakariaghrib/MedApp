import { PatientsList } from "../components/PatientsList";

export function PatientsPage() {
  return (
    <div className="h-full flex-1 flex-col p-2 sm:p-4 md:p-8 flex">
      <PatientsList />
    </div>
  );
}
