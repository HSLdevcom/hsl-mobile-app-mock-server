/**
* OAuth in memory implementation
*/

const InMemoryCache = {
  clients: [
    {
      clientId: 'oauthClient',
      clientSecret: 'secret',
      redirectUris: ['http://localhost:4000', 'http://localhost:4000/me'],
      grants: ['password', 'profile', 'authorization_code'],
    },
  ],
  tokens: [],
  authorizationCodes: [],
  users: [
    {
      id: '123',
      username: 'jack',
      fullName: 'Jack DiCaprio',
      password: 'p',
    },
    {
      id: '321',
      username: 'rose',
      fullName: 'Rose Jacker',
      password: 'p',
    },
  ],
};

/**
 * Dump the cache.
 */

InMemoryCache.dump = () => {
  console.log('clients', InMemoryCache.clients);
  console.log('tokens', InMemoryCache.tokens);
  console.log('users', InMemoryCache.users);
  console.log('authorizationCodes: ', InMemoryCache.authorizationCodes);
};

/*
 * Get access token.
 */

InMemoryCache.getAccessToken = (bearerToken) => {
  const tokens = InMemoryCache.tokens.filter(token => token.accessToken === bearerToken);
  return tokens.length
    ? tokens[0]
    : false;
};

InMemoryCache.getTokenFromRequestHeader = (request) => {
  const token = request.get('Authorization');
  const matches = token.match(/Bearer\s(\S+)/);

  if (!matches) {
    return false;
  }

  return matches[1];
};

/**
 * Get refresh token.
 */

InMemoryCache.getRefreshToken = (bearerToken) => {
  const tokens = InMemoryCache.tokens.filter(token => token.refreshToken === bearerToken);

  return tokens.length
    ? tokens[0]
    : false;
};

/**
 * Get client.
 */

InMemoryCache.getClient = (clientId, clientSecret) => {
  const clients = InMemoryCache.clients.filter((client) => {
    if (clientSecret && clientSecret !== 'undefined') {
      return client.clientId === clientId && client.clientSecret === clientSecret;
    }
    return client.clientId === clientId;
  });
  return clients.length
    ? clients[0]
    : false;
};

/**
 * Save token.
 */

InMemoryCache.saveToken = (token, client, user) => {
  const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, scope } = token;
  InMemoryCache.tokens.push({
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    scope,
    client: { id: client.clientId },
    user: { id: user.id },
  });
  return Promise.resolve({
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    scope,
    client: { id: client.clientId },
    user: { id: user.id },
  });
};

/**
 * Save authorizationCode.
 */
InMemoryCache.saveAuthorizationCode = (code, client, user) => {
  const { authorizationCode, expiresAt, redirectUri, scope } = code;
  InMemoryCache.authorizationCodes.push({
    authorizationCode,
    expiresAt,
    redirectUri,
    scope,
    client: { id: client.clientId },
    user: { id: user.id },
  });
  return Promise.resolve({
    authorizationCode,
    expiresAt,
    redirectUri,
    scope,
    client: { id: client.clientId },
    user: { id: user.id },
  });
};

/*
 * Get user by username and password.
 */

InMemoryCache.getUser = (username, password) => {
  const users = InMemoryCache.users.filter(
    user => user.username === username && user.password === password,
  );

  return users.length
    ? users[0]
    : false;
};

/*
 * Get user by token.
 */

InMemoryCache.getUserByToken = (accessToken, userId) => {
  const userToken = InMemoryCache.tokens.filter(
    token => token.accessToken === accessToken && token.user.id === userId,
  );
  if (userToken && userToken.length === 1) {
    const user = InMemoryCache.users.filter(
      u => u.id === userId,
    );
    if (user && user.length === 1) {
      return {
        result: {
          id: user[0].id,
          username: user[0].username,
          fullName: user[0].fullName,
        },
      };
    }
    return { result: false };
  }
  return { result: false };
};

/*
 * Edit user.
 */

InMemoryCache.editUser = (id, userData) => {
  const users = InMemoryCache.users.map((u) => {
    if (u.id === id) {
      return userData;
    }
    return u;
  });
  InMemoryCache.users = users;
  return userData;
};

export default InMemoryCache;
