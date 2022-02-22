import React, { useEffect, useState } from 'react';

import { Avatar } from "@material-ui/core";
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';

import './UserSearchBox.css';
import { useNavigate } from 'react-router-dom';

export default function UserSearchBox() {
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  const getUsers = async () => {
    const res = await fetch('/getUsers', {
      method: 'GET',
      headers: {token: localStorage.token}
    });

    if (!res.ok){
      return []
    }

    setOptions(await res.json());
  }

  useEffect(() => {
    getUsers();
  }, []);

  const itemComponent = ({ item }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar src={item.profile_pic} style={{ width: 40, height: 40, marginRight: 10 }} />
      <span className='fw7'>{item.username}</span>
    </div>
  );

  return (
    <DropdownList
      filter='contains'
      data={options}
      textField='username'
      onChange={value => navigate(`/${value.username}`)}
      placeholder='Busca'
      itemComponent={itemComponent}
    />
  );
}