import * as React from "react";
import root from "./root";
import { users } from "./api";
import UserList from "./UserList";

const onClickCancel = (e) => {
  e.preventDefault();
  root.render(<p>Cancelled</p>, document.getElementById("root"));
};

class UserListContainer extends React.Component {
  state = {
    error: null,
    loading: "loading...",
    users: [],
  };

  componentDidMount() {
    this.job = users();

    this.job.then(
      (result) => {
        this.setState({
          loading: null,
          error: null,
          users: result.users,
        });
      },

      (error) => {
        this.setState({ loading: null, error: error.message });
      }
    );
  }

  componentWillUnmount() {
    this.job.cancel();
  }

  render() {
    return <UserList onClickCancel={onClickCancel} {...this.state} />;
  }
}

export default UserListContainer;
