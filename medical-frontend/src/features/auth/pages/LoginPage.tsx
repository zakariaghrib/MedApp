import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Colonne Gauche (Formulaire) */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 xl:px-24 relative overflow-hidden">
        {/* Motif de fond discret type grille */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
        <div className="mx-auto w-full max-w-sm relative z-10">
          <LoginForm />
        </div>
      </div>
      {/* Colonne Droite (Visuel) */}
      <div className="relative hidden w-0 flex-1 lg:block bg-sky-900">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          src="/login-bg.jpg"
          alt="Illustration médicale abstraite"
        />
        {/* Overlay pour assombrir un peu l'image et faire ressortir le texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-900/20 to-transparent" />
        
        {/* Contenu textuel sur l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-16 text-white z-10">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Gérez vos patients. <br />
            <span className="text-sky-300">Tout au Même Endroit.</span>
          </h2>
          <p className="text-lg lg:text-xl text-sky-100 max-w-xl">
            Une interface intuitive, rapide et sécurisée pour centraliser vos dossiers médicaux et simplifier le quotidien de votre cabinet.
          </p>
        </div>
      </div>
    </div>
  );
}