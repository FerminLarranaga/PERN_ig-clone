import React from "react";

import PerfilPosts from "./perfilPosts/PerfilPosts";

import DashboardIcon from '@material-ui/icons/Dashboard';

import "./PerfilActivity.css";

function PerfilActivity() {
    return (
        <div>
            <div className="perfilUi fw4">
                <div className="pt3 unit">
                    <DashboardIcon fontSize="small" className="mr1"/>
                    Publicaciones
                </div>
                
            </div>
            <PerfilPosts />
        </div>
    );
}

export default PerfilActivity;