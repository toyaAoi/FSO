import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const UsersTable = ({ users }) => {
  return (
    <>
      <h1 className="title">Users</h1>

      <table className="table">
        <thead className="table-header">
          <tr className="table-row">
            <th>&nbsp;</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username} className="table-row">
              <td className="table-data">
                <Link to={user.id}>{user.name}</Link>
              </td>
              <td className="table-data">{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

UsersTable.propTypes = {
  users: PropTypes.array,
};

export default UsersTable;

