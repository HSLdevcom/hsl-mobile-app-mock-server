import InMemoryCache from '../../lib/model';

export const userQuery = (_, { accessToken }) => {
  const token = InMemoryCache.tokens.find(s => s.accessToken === accessToken);
  if (token) {
    return InMemoryCache.users.find(u => u.id === token.user.id);
  }
  return false;
};

export const sessionQuery = (_, { accessToken, userId }) =>
  InMemoryCache.tokens.find(s => s.accessToken === accessToken && s.user.id === userId);
