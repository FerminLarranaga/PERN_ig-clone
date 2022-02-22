import React from "react";
import instagramTitle from '../../assets/instagramTitle.png';

import AddPost from "./addPost/AddPost";
import UserSearchBox from "./userSearchBox/UserSearchBox";
import MenuUser from "./menuUser/MenuUser";

import "./Header.css";

function Header() {
    return (
        <header className="header">
            <div className="header__container">
                {/* LOGO DE INSTAGRAM */}
                <img
                    className="headerlogo"
                    alt="Instagram"
                    src={instagramTitle}
                    width="130"
                    height="30"
                />
                <UserSearchBox />
                {/* OPCIONES DEL HEADER (MENU, ADDPOST) */}
                <div className="header__options">
                    <AddPost />
                    <MenuUser />
                </div>
            </div>
        </header>
    );
}

export default Header;