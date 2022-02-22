import React from "react";

import PerfilInformation from "./PerfilInformation/PerfilInformation";
import PerfilActivity from "./perfilActivity/PerfilActivity";

import "./Perfil.css";

function Perfil () {
    // console.log('PERFIL_USER', user);
    return (
        <div className="perfil">
            <div>
                {/* INFORMACION DEL PERFIL */}
                <PerfilInformation />
                {/* ACTIVIDAD DEL PERFIL (POSTEOS Y GUARDADOS) */}
                <PerfilActivity />
            </div>
        </div>
    );
}

export default Perfil;