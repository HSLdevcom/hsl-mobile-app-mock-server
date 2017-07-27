import * as Query from './resolvers/Query';
import Session from './resolvers/Session';
import InMemoryCache from '../lib/model';

export default {
  Query,
  Session,
  Mutation: {
    editFullName: (_, data) => {
      const user = Query.userQuery(_, data);
      if (user) {
        const editedUser = Object.assign({}, user, { fullName: data.fullName });
        return InMemoryCache.editUser(editedUser.id, editedUser);
      }
      return false;
    },
  },
};
