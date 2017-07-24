import InMemoryCache from '../../lib/model';

export default {
  user: session => InMemoryCache.users.find(u => u.id === session.user.id),
  client: session => InMemoryCache.clients.find(c => c.clientId === session.client.id),
};
