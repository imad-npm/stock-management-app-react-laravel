import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, ShoppingCartIcon, CurrencyDollarIcon, ChartBarIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useGetProfileQuery, useLogoutMutation } from 'services/authApiSlice';
import Dropdown from 'components/ui/Dropdown';
import ChevronDownIcon from 'components/ui/icons/ChevronDownIcon';
import {  selectToken } from 'store/authSlice';
import { useSelector } from 'react-redux';

const navigation = [
  { name: 'Products', href: '/products', icon: ShoppingCartIcon, roles: ['user', 'admin'] },
  { name: 'Transactions', href: '/transactions', icon: CurrencyDollarIcon, roles: ['user', 'admin'] },
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon, roles: ['user', 'admin'] },
  { name: 'Users', href: '/users', icon: UserGroupIcon, roles: ['admin'] },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    // The `skip` option prevents it from running if there's no token.
   const token = useSelector(selectToken);
const { data: userData, error, isLoading } = useGetProfileQuery(undefined, { skip: !token });
const user=userData.data
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
      // TODO: Display error message to user
    }
  };

  

  return (
<nav className="bg-gray-800 mb-7 shadow-md">
  <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-between h-16">
      {/* Mobile menu button */}
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <span className="sr-only">Open main menu</span>
          {/* You can replace with hamburger icon */}
          <HomeIcon className="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Logo and nav links */}
      <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex-shrink-0 flex items-center">
          <NavLink to="/" className="text-white text-2xl font-bold">Inventory</NavLink>
        </div>
        <div className="hidden sm:block sm:ml-6">
          <div className="flex space-x-4">
            {user && navigation.map((item) => (
              item.roles.includes(user.role) && (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'px-3 py-2 rounded-md text-sm font-medium flex items-center'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </NavLink>
              )
            ))}
          </div>
        </div>
      </div>

      {/* User profile / login */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        {user ? (
          <Dropdown.Root>
            <Dropdown.Trigger>
              <span className="font-medium text-sm sm:text-base text-white">{user.name}</span>
              <ChevronDownIcon className="h-5 w-5 text-white" />
            </Dropdown.Trigger>
            <Dropdown.Content className="w-44">
                     <Dropdown.Item onClick={() => navigate('/profile')}>
                <UserCircleIcon className="h-5 w-5 mr-2 inline" />
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} danger>
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 inline" />
                Logout
              </Dropdown.Item>
         
            </Dropdown.Content>
          </Dropdown.Root>
        ) : (
          <div className="flex items-center space-x-4">
            <NavLink to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</NavLink>
            <NavLink to="/register" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Register</NavLink>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Mobile menu */}
  <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
    <div className="px-2 pt-2 pb-3 space-y-1">
      {user && navigation.map((item) => (
        item.roles.includes(user.role) && (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              classNames(
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block px-3 py-2 rounded-md text-base font-medium flex items-center'
              )
            }
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.name}
          </NavLink>
        )
      ))}

      {user ? (
        <button
          onClick={handleLogout}
          className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" aria-hidden="true" />
          Logout
        </button>
      ) : (
        <>
          <NavLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Login</NavLink>
          <NavLink to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Register</NavLink>
        </>
      )}
    </div>
  </div>
</nav>

  );
}
