import { BriefcaseMedical } from "lucide-react";
import accessBackground from "../assets/access_background.svg";

const Access = () => {
    return (
        <main className="flex flex-col md:flex-row min-h-screen w-full">
            {/** Left side container */}
            <div className="relative flex-1 flex items-center justify-center bg-access-green p-8">
                {/** Background svg */}
                <div 
                    className="absolute top-0 left-0 w-full h-1/2 bg-no-repeat bg-top bg-cover opacity-20 pointer-events-none"
                    style={{ backgroundImage: `url(${accessBackground})` }}
                />
                
                {/** Mirrored background svg */}
                <div 
                    className="absolute bottom-0 left-0 w-full h-1/2 bg-no-repeat bg-bottom bg-cover opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `url(${accessBackground})`,
                        transform: 'scaleY(-1)'
                    }}
                />

                {/** Content container */}
                <div className="flex flex-col items-center text-white mx-28 mb-16">
                    {/** Icon container */}
                    <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gray-50/25 mb-8">
                        <BriefcaseMedical size={72}/>
                    </div>
                    {/** Title */}
                    <h1 className="text-4xl text-center mb-4 font-bold">
                        Sistema de Abasto de Medicamentos
                    </h1>
                    {/** Description text */}
                    <p className="text-sm text-center leading-relaxed">
                        Plataforma institucional para el reporte y consulta de disponibilidad de insumos en el sistema de salud nacional.
                    </p>
                </div>
                {/** Bottom bar */}
                <div className="hidden md:flex absolute bottom-10 left-0 w-full h-10 bg-mist-900/50 justify-center gap-10">
                    <div className="hidden md:block w-40 h-10 rounded-sm bg-gray-500/30"/>
                    <div className="hidden md:block w-40 h-10 rounded-sm bg-gray-500/30"/>
                </div>
            </div>
            {/** Right side container */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
                <div className="text-gray-800">
                    <h1 className="text-4xl font-bold mb-4">Right Side</h1>
                    <p className="text-lg text-gray-600">This one takes the other 50%.</p>
                </div>
            </div>
        </main>
    );
};

export default Access;