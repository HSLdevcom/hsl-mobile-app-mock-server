import InMemoryCache from '../../lib/model';

export default {
  session: user => InMemoryCache.tokens.find(s => s.user && s.user.id === user.id),
};
