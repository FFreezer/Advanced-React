// At it's simplest access control returns
// a yes or a no value depending on the users session

import { ListAccessArgs, Session } from './types';

export const isSignedIn = ({ session } : ListAccessArgs) => !!session;



 