import React, { useState } from 'react';

const RBACInterface = () => {
  const [activeTab, setActiveTab] = useState('permissions'); // 'roles' or 'permissions'
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Moderator',
      layer: '#1',
      members: 3,
      permissions: [
        'Add Member',
        'Mute/Unmute Users',
        'Change Channel Setting'
      ]
    },
    {
      id: 2,
      name: 'Manager',
      layer: '#1',
      members: 2,
      permissions: [
        'Add Member',
        'Remove Member',
        'Mute/Unmute Users',
        'Create Channel',
        'Delete Channel'
      ]
    }
  ]);

  const [permissions, setPermissions] = useState([
    {
      id: 1,
      name: '#Add Member',
      type: 'allow',
      actions: [
        {
          name: 'Add Member that is not in channel',
          allowChannel: true,
          allowUser: true,
          denied: false,
          direction: 'down',
          dashed: false
        },
        {
          name: 'Remove Member that is in channel',
          allowChannel: true,
          allowUser: true,
          denied: false,
          direction: 'down',
          dashed: false
        }
      ]
    },
    {
      id: 2,
      name: 'Revoke to...',
      type: 'revoke',
      actions: [
        {
          name: 'Add Member that is in the banned list',
          allowChannel: true,
          allowUser: true,
          denied: false,
          direction: 'up',
          dashed: false
        },
        {
          name: 'Move the landing channel',
          allowChannel: true,
          allowUser: false,
          denied: false,
          direction: 'up',
          dashed: true
        }
      ]
    }
  ]);

  const [filters, setFilters] = useState({
    layer: 'Layer 1',
    addMember: true
  });

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const removeFilter = (filter) => {
    if (filter === 'layer') {
      setFilters({...filters, layer: null});
    } else if (filter === 'addMember') {
      setFilters({...filters, addMember: false});
    }
  };

  // Toggle dashed state
  const toggleDashed = (permissionId, actionIndex, value) => {
    const newPermissions = [...permissions];
    const permissionIndex = newPermissions.findIndex(p => p.id === permissionId);
    
    if (permissionIndex !== -1) {
      newPermissions[permissionIndex].actions[actionIndex].dashed = value;
      setPermissions(newPermissions);
    }
  };

  // Toggle direction (up/down)
  const toggleDirection = (permissionId, actionIndex) => {
    const newPermissions = [...permissions];
    const permissionIndex = newPermissions.findIndex(p => p.id === permissionId);
    
    if (permissionIndex !== -1) {
      const currentDirection = newPermissions[permissionIndex].actions[actionIndex].direction;
      newPermissions[permissionIndex].actions[actionIndex].direction = currentDirection === 'up' ? 'down' : 'up';
      
      // If we switch direction, we also need to move between "allow" and "revoke" sections
      if (newPermissions[permissionIndex].type === 'allow' && currentDirection === 'down') {
        // Move from allow to revoke
        const action = {...newPermissions[permissionIndex].actions[actionIndex]};
        // Remove from allow section
        newPermissions[permissionIndex].actions.splice(actionIndex, 1);
        // Add to revoke section
        const revokeIndex = newPermissions.findIndex(p => p.type === 'revoke');
        if (revokeIndex !== -1) {
          newPermissions[revokeIndex].actions.push(action);
        }
      } else if (newPermissions[permissionIndex].type === 'revoke' && currentDirection === 'up') {
        // Move from revoke to allow
        const action = {...newPermissions[permissionIndex].actions[actionIndex]};
        // Remove from revoke section
        newPermissions[permissionIndex].actions.splice(actionIndex, 1);
        // Add to allow section
        const allowIndex = newPermissions.findIndex(p => p.type === 'allow');
        if (allowIndex !== -1) {
          newPermissions[allowIndex].actions.push(action);
        }
      }
      
      setPermissions(newPermissions);
    }
  };

  // Permissions tab content
  const renderPermissionsTab = () => {
    return (
      <div className="w-full bg-gray-200 p-4 rounded-lg">
        {/* Search and Add New */}
        <div className="flex justify-between mb-4">
          <div className="relative w-full mr-2">
            <input 
              type="text" 
              placeholder="Search Permissions" 
              className="w-full bg-black text-white py-2 px-4 rounded-lg"
            />
            <div className="absolute top-2 right-2 text-white">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
            <span className="mr-1 text-xl">+</span> Add New
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex mb-4">
          <div className="flex items-center mr-6">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <span>Permissions - 1</span>
          </div>
          <div className="flex items-center mr-6">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="10" x2="16" y2="10" />
              <line x1="8" y1="14" x2="16" y2="14" />
              <line x1="8" y1="18" x2="12" y2="18" />
            </svg>
            <span>Accessibility</span>
          </div>
          <div className="flex items-center mr-6">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>Allow/Revoke/move</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.67C7 17.6 9.24 15 12 15s5 2.6 5 5.67c0 .28-.22.5-.5.5H7.5c-.28 0-.5-.22-.5-.5z" />
            </svg>
            <span>For Channel/For User</span>
          </div>
        </div>

        {/* Permission items */}
        <div className="bg-blue-100 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-4">
            <input type="checkbox" className="mr-2 h-4 w-4" />
            <h3 className="font-bold">#Add Member</h3>
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            <div className="ml-4 flex items-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
              <span className="font-bold">Allow to...</span>
            </div>
            <div className="ml-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          </div>

          {permissions.find(p => p.type === 'allow')?.actions.map((action, idx) => (
            <div key={idx} className="flex items-center justify-between mb-2 ml-8">
              <span className={action.dashed ? "line-through" : ""}>
                {action.name}
              </span>
              <div className="flex items-center">
                <button 
                  className="mx-2 w-5 h-5 flex items-center justify-center"
                  onClick={() => toggleDashed(1, idx, false)}
                >
                  ✓
                </button>
                <button 
                  className="text-red-500 mx-2 w-5 h-5 flex items-center justify-center"
                  onClick={() => toggleDashed(1, idx, true)}
                >
                  ✕
                </button>
                <button 
                  className="mx-2 w-5 h-5 flex items-center justify-center"
                  onClick={() => toggleDirection(1, idx)}
                >
                  {action.direction === 'down' ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 14l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 10l7-7 7 7" />
                    </svg>
                  )}
                </button>
                <div className={`text-center rounded mx-2 px-2 py-1 ${action.allowChannel ? 'bg-gray-300 text-black' : 'bg-gray-500 text-gray-300'}`}>
                  CH
                </div>
                <div className={`text-center rounded mx-2 px-2 py-1 ${action.allowUser ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}`}>
                  U
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-400 my-4"></div>

        <div className="bg-blue-100 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <input type="checkbox" className="mr-2 h-4 w-4" />
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
              <span className="font-bold">Revoke to...</span>
            </div>
            <div className="ml-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          </div>

          {permissions.find(p => p.type === 'revoke')?.actions.map((action, idx) => (
            <div key={idx} className="flex items-center justify-between mb-2 ml-8">
              <span className={action.dashed ? "line-through" : ""}>
                {action.name}
              </span>
              <div className="flex items-center">
                <button 
                  className="mx-2 w-5 h-5 flex items-center justify-center"
                  onClick={() => toggleDashed(2, idx, false)}
                >
                  ✓
                </button>
                <button 
                  className="text-red-500 mx-2 w-5 h-5 flex items-center justify-center"
                  onClick={() => toggleDashed(2, idx, true)}
                >
                  ✕
                </button>
                <button 
                  className="mx-2 w-5 h-5 flex items-center justify-center"
                  onClick={() => toggleDirection(2, idx)}
                >
                  {action.direction === 'down' ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 14l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 10l7-7 7 7" />
                    </svg>
                  )}
                </button>
                <div className={`text-center rounded mx-2 px-2 py-1 ${action.allowChannel ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}`}>
                  CH
                </div>
                <div className={`text-center rounded mx-2 px-2 py-1 ${action.allowUser ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}`}>
                  U
                </div>
                {idx === permissions.find(p => p.type === 'revoke')?.actions.length - 1 && (
                  <div className="ml-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="6" r="1" />
                      <circle cx="12" cy="18" r="1" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer button */}
        <div className="mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
            Bulk Edit Selected Permission
          </button>
        </div>
      </div>
    );
  };

  // Roles tab content
  const renderRolesTab = () => {
    return (
      <div className="w-full bg-gray-200 p-4 rounded-lg">
        {/* Search and Create Role */}
        <div className="flex justify-between mb-4">
          <div className="relative w-full mr-2">
            <input 
              type="text" 
              placeholder="Search Roles" 
              className="w-full bg-black text-white py-2 px-4 rounded-lg"
            />
            <div className="absolute top-2 right-2 text-white">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Create Role
          </button>
        </div>

        {/* Filters */}
        <div className="flex mb-4">
          <div className="mr-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
          </div>
          {filters.layer && (
            <div className="bg-blue-500 text-white rounded-md px-2 py-1 flex items-center mr-2">
              {filters.layer}
              <button onClick={() => removeFilter('layer')} className="ml-1 text-xs">×</button>
            </div>
          )}
          {filters.addMember && (
            <div className="bg-blue-500 text-white rounded-md px-2 py-1 flex items-center">
              Add Member
              <button onClick={() => removeFilter('addMember')} className="ml-1 text-xs">×</button>
            </div>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex mb-4">
          <div className="flex items-center mr-6">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <span>Roles - 2</span>
          </div>
          <div className="flex items-center mr-6">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
            <span>Layer</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.67C7 17.6 9.24 15 12 15s5 2.6 5 5.67c0 .28-.22.5-.5.5H7.5c-.28 0-.5-.22-.5-.5z" />
            </svg>
            <span>Members</span>
          </div>
        </div>

        {/* Role cards */}
        {roles.map(role => (
          <div key={role.id} className="bg-blue-100 rounded-lg p-4 mb-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4" />
                <div className="mr-2">
                  {role.id === 1 ? (
                    <div className="w-8 h-8 bg-green-700 rounded"></div>
                  ) : (
                    <div className="w-8 h-8 bg-yellow-200 rounded"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold">{role.name}</h3>
                    {role.id === 1 ? null : (
                      <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    )}
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <ul className="list-disc ml-5 text-sm">
                    {role.permissions.map((permission, idx) => (
                      <li key={idx} className={permission === 'Add Member' ? 'text-blue-500' : ''}>
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mx-4 flex flex-col items-center">
                  <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                  </svg>
                  <span>{role.layer}</span>
                </div>
                <div className="mx-4 flex flex-col items-center">
                  <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.67C7 17.6 9.24 15 12 15s5 2.6 5 5.67c0 .28-.22.5-.5.5H7.5c-.28 0-.5-.22-.5-.5z" />
                  </svg>
                  <span>{role.members}</span>
                </div>
                <div className="mx-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="8" y1="10" x2="16" y2="10" />
                    <line x1="8" y1="14" x2="16" y2="14" />
                    <line x1="8" y1="18" x2="12" y2="18" />
                  </svg>
                </div>
                <div className="ml-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="6" r="1" />
                    <circle cx="12" cy="18" r="1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Footer button */}
        <div className="mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
            Bulk Edit Selected Roles
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Role-Based Access Control</h1>
      
      {/* Tabs */}
      <div className="mb-4">
        <div className="bg-blue-500 inline-block rounded-lg p-1">
          <button 
            className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'roles' ? 'bg-blue-700 text-white' : 'text-white'}`}
            onClick={() => toggleTab('roles')}
          >
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            Roles
          </button>
          <button 
            className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'permissions' ? 'bg-blue-700 text-white' : 'text-white'}`}
            onClick={() => toggleTab('permissions')}
          >
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 1v22M1 12h22" />
            </svg>
            Permissions
          </button>
        </div>
      </div>
      
      {/* Content */}
      {activeTab === 'roles' ? renderRolesTab() : renderPermissionsTab()}
    </div>
  );
};

export default RBACInterface;
