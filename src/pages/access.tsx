// import { BriefcaseMedical } from 'lucide-react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import accessBackground from '@/assets/access_background.svg';
// import GoogleOnboardingDialog from '@/components/Global/GoogleOnboardingDialog';
// import Navbar from '@/components/Global/navbar';
// import { Login } from '@/components/Login/login';
// import SignUp from '@/components/Signup/signup';
// import { useAuth } from '@/contexts/useAuth';
// import { toast } from 'sonner';

// const Access = () => {
//   const { signIn, signInWithGoogle } = useAuth();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   const handleLogin = async (email: string, password: string) => {
//     try {
//       setIsLoading(true);
//       const loggedUser = await signIn(email, password);
//       if (loggedUser.role === 'admin') {
//         navigate('/admin');
//       } else if (loggedUser.role === 'health') {
//         navigate('/dashboard');
//       } else {
//         navigate('/reportar');
//       }
//     } catch {
//       toast.error('Error al iniciar sesión. Correo o contraseña incorrectos.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsGoogleLoading(true);
//       const profile = await signInWithGoogle();
//       if (!profile.age || !profile.suburb) {
//         setShowOnboarding(true);
//       } else {
//         navigate('/inicio');
//       }
//     } catch (err: unknown) {
//       if (
//         err instanceof Error &&
//         (err as { code?: string }).code === 'auth/popup-closed-by-user'
//       ) {
//         return;
//       }
//       toast.error('Error al iniciar sesión con Google.');
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   return (
//     <main className="flex flex-col min-h-screen w-full pt-18">
//       <div className="top-0 z-50 bg-white shadow-md">
//         <Navbar variant="default" activePath="" />
//       </div>

//       <div className="flex flex-col md:flex-row flex-1">
//         <div className="relative flex-1 flex items-center justify-center bg-access-green p-8">
//           <div
//             className="absolute top-0 left-0 w-full h-1/2 bg-no-repeat bg-top bg-cover opacity-20 pointer-events-none"
//             style={{ backgroundImage: `url(${accessBackground})` }}
//           />
//           <div
//             className="absolute bottom-0 left-0 w-full h-1/2 bg-no-repeat bg-bottom bg-cover opacity-20 pointer-events-none"
//             style={{
//               backgroundImage: `url(${accessBackground})`,
//               transform: 'scaleY(-1)',
//             }}
//           />
//           <div className="flex flex-col items-center text-white mx-28 mb-16">
//             <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gray-50/25 mb-8">
//               <BriefcaseMedical size={72} />
//             </div>
//             <h1 className="text-4xl text-center mb-4 font-bold">
//               Sistema de Abasto de Medicamentos
//             </h1>
//             <p className="text-sm text-center leading-relaxed">
//               Plataforma institucional para el reporte y consulta de
//               disponibilidad de insumos en el sistema de salud nacional.
//             </p>
//           </div>
//           <div className="hidden md:flex absolute bottom-10 left-0 w-full h-10 bg-mist-900/50 justify-center gap-10">
//             <div className="hidden md:block w-40 h-10 rounded-sm bg-gray-500/30" />
//             <div className="hidden md:block w-40 h-10 rounded-sm bg-gray-500/30" />
//           </div>
//         </div>

//         <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
//           <div className="flex flex-col items-center text-gray-800">
//             {/** Login Form */}
//             <Login
//               onSubmit={handleLogin}
//               isLoading={isLoading}
//               onGoogleSignIn={handleGoogleSignIn}
//               isGoogleLoading={isGoogleLoading}
//             />

//             {/** Forms separator */}
//             <div className="flex flex-col w-full my-6">
//               <div className="flex items-center w-full my-6">
//                 <div className="grow h-0.5 bg-gray-200"></div>
//                 <span className="mx-4">o</span>
//                 <div className="grow h-0.5 bg-gray-200"></div>
//               </div>
//               <p className="text-xl font-bold">¿No tienes cuenta? Registrate</p>
//               <p className="text-sm font-thin">
//                 Registra tu cuenta de usuario para el sistema.
//               </p>
//             </div>
//             <SignUp />
//           </div>
//         </div>
//       </div>

//       <GoogleOnboardingDialog
//         open={showOnboarding}
//         onComplete={() => setShowOnboarding(false)}
//       />
//     </main>
//   );
// };

// export default Access;

import { BriefcaseMedical } from 'lucide-react'; // Added Google icon placeholder if needed, or use your Button component's built-in
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import accessBackground from '@/assets/access_background.svg';
import GoogleOnboardingDialog from '@/components/Global/GoogleOnboardingDialog';
import Navbar from '@/components/Global/navbar';
import { Login } from '@/components/Login/login';
import SignUp from '@/components/Signup/signup';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button'; // Assuming ShadCN button location
import { toast } from 'sonner';

const Access = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle state between Login and SignUp
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedUser = await signIn(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedUser.role === 'health') {
        navigate('/dashboard');
      } else {
        navigate('/reportar');
      }
    } catch {
      toast.error('Error al iniciar sesión. Correo o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const profile = await signInWithGoogle();
      if (!profile.age || !profile.suburb) {
        setShowOnboarding(true);
      } else {
        navigate('/inicio');
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err as { code?: string }).code === 'auth/popup-closed-by-user'
      ) {
        return;
      }
      toast.error('Error al iniciar sesión con Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen w-full pt-18">
      <div className="top-0 z-50 bg-white shadow-md">
        <Navbar variant="default" activePath="" />
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Side: Brand Panel */}
        <div className="relative flex-1 flex items-center justify-center bg-access-green p-8">
          <div
            className="absolute top-0 left-0 w-full h-1/2 bg-no-repeat bg-top bg-cover opacity-20 pointer-events-none"
            style={{ backgroundImage: `url(${accessBackground})` }}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-1/2 bg-no-repeat bg-bottom bg-cover opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url(${accessBackground})`,
              transform: 'scaleY(-1)',
            }}
          />
          <div className="flex flex-col items-center text-white mx-28 mb-16">
            <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gray-50/25 mb-8">
              <BriefcaseMedical size={72} />
            </div>
            <h1 className="text-4xl text-center mb-4 font-bold">
              Sistema de Abasto de Medicamentos
            </h1>
            <p className="text-sm text-center leading-relaxed">
              Plataforma institucional para el reporte y consulta de
              disponibilidad de insumos en el sistema de salud nacional.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 overflow-hidden">
          {/* Key attribute forces re-render and retriggers ShadCN's tailwind-animate */}
          <div 
            key={isLogin ? 'login' : 'signup'} 
            className="flex flex-col items-center text-gray-800 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out"
          >
            {/* 2. Conditional Forms */}
            {isLogin ? (
              <Login
                onSubmit={handleLogin}
                isLoading={isLoading}
                onGoogleSignIn={handleGoogleSignIn}
                isGoogleLoading={isGoogleLoading}
              />
            ) : (
              <SignUp />
            )}

            {/* 3. Dynamic Bottom Switcher Component */}
            <div className="flex flex-col items-center w-full mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-2">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
              </p>
              <Button 
                variant="link" 
                className="font-bold text-access-green"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <GoogleOnboardingDialog
        open={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </main>
  );
};

export default Access;
