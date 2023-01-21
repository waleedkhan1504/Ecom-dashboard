import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';

const Nav=()=>{
    const auth=localStorage.getItem('user');

    const navigate=useNavigate();

    const logout=()=>{
        localStorage.clear();
        navigate('/signup');
    }
    
    return(
        <div>
            <img src='C:\Users\laptop master\Downloads\logo1.jpg' alt="logo" className="logo"/>
            { auth?
            <ul className="nav-ul">
        <li><Link to="/">proudcts</Link></li>
        <li><Link to="/add">Add proudct</Link></li>
        <li><Link to="/update">Update proudct</Link></li>
        <li><Link to="/profile">profile</Link></li>
        <li><Link onClick={logout} to="/signup">logout({JSON.parse(auth).name})</Link></li>
        </ul>
     :
           <ul className='nav-ul'>
<li><Link to="/signup">signup</Link></li>
<li><Link to="/login">Login</Link></li>
</ul>
 }
        </div>
    );
    }
export default Nav;