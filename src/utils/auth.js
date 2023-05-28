module.exports = {
  findTokenAuthInHeader(header) {
    // console.log('findTokenAuthInHeader | header: ', header);

    return header.includes('Token');
  },

  findUserByTokenAuth(user, tokenAuth) {
    // console.log('findUserByTokenAuth | user.token: ', user.token);
    // console.log('findUserByTokenAuth | tokenAuth: ', tokenAuth);

    return user.token === tokenAuth;
  },

  filterItemsFromUser(item, userId) {
    // console.log('findItemFromUser | item, userId: ', item, userId);

    return item.user.id === userId;
  },
};
