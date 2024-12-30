import { User } from '@/types/user';

interface UsersListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUser?: User | null;
}

export const UsersList = ({ users, selectedUser, onSelectUser }: UsersListProps) => {
  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Users</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 ${
                selectedUser?.id === user.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}; 