import * as React from "react";
import { users } from "./api";
import UserList from "./UserList";

class UserListContainer extends React.Component {
  state = {
    error: null,
    users: [],
  };

  componentDidMount() {
    users().then(
      (result) => {
        this.setState({ error: null, users: result.users });
      },
      (error) => {
        this.setState({ loading: null, error });
      }
    );
  }

  render() {
    return <UserList {...this.state} />;
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      loading: state.users.length === 0 ? props.loading : null,
    };
  }
}

UserListContainer.defaultProps = {
  loading: "loading...",
};

export default UserListContainer;
