import * as React from "react";
import { users } from "./api";
import UserList from "./UserList";

class UserListContainer extends React.Component {
  state = {
    error: null,
    loading: "loading...",
    users: [],
  };

  componentDidMount() {
    users().then(
      (result) => {
        this.setState({
          loading: null,
          error: null,
          users: result.users,
        });
      },
      (error) => {
        this.setState({ loading: null, error });
      }
    );
  }

  render() {
    return <UserList {...this.state} />;
  }
}

export default UserListContainer;
