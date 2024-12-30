import { User } from '@/types/user';

interface UsersListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUser?: User | null;
}

export const UsersList = ({ users, onSelectUser, selectedUser }: UsersListProps) => {
  return (
    <div className="w-80 border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Users</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-120px)]">
        {users.length === 0 ? (
          <div className="p-4 text-gray-500">No users found</div>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                selectedUser?.id === user.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}; 