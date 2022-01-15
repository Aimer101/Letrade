const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
      };
    default:
      throw new Error();
  }
};

export default UserReducer;
