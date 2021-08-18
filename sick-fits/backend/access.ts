// At it's simplest access control returns
// a yes or a no value depending on the users session

import { ListAccessArgs, Session } from './types';
import { Permission, permissionsList } from './schemas/fields';
export const isSignedIn = ({ session } : ListAccessArgs) => !!session;

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission, 
    ({ session } : ListAccessArgs) => !!session.data.role[permission]
  ])
);

// Permissions check if someone meets a criteria yes or no
export const permissions = {
  ...generatedPermissions,
  can: (permission: Permission, {session}: ListAccessArgs) => {
    return () => {
      return session.data.role[permission];
    }
  }
}
