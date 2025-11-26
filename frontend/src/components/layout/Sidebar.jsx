import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Todos', path: '/' },
    { name: 'Trash', path: '/trash' },
    { name: 'Holidays', path: '/holidays' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
