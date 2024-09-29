import { useState } from 'react';
import UserIdContext from './UserIdContext';

const UserIdProvider = ({ children }) => {

    const [userId, setUserId] = useState(null);

    return (
        <UserIdContext.Provider value={
            { userId,
             setUserId
            }}>
            {children}
        </UserIdContext.Provider>
    );
}

export default UserIdProvider;