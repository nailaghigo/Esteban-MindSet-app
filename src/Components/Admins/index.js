import { useEffect, useState } from 'react';
import styles from './admins.module.css';
import Modal from './modal/modal';
import Button from '../Shared/Button';
import { Link, useHistory } from 'react-router-dom';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [adminToDelete, setAdminToDelete] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const getAdmins = () => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API}/admins`)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getAdmins();
  }, []);

  const updateAdmin = (id) => {
    history.push(`/admins/form?_id=${id}`);
  };

  const deleteAdmin = (admin) => {
    setAdminToDelete(admin);
  };

  const handleDelete = () => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API}/admins/${adminToDelete._id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.status !== 204) {
          throw 'There was an error while deleting this admin.';
        }
        setAdminToDelete(false);
        getAdmins();
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className={styles.container}>
      <h2>Admins</h2>
      {isLoading ? (
        <p className={styles.loading}>On Loading ...</p>
      ) : (
        <div>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Name</th>
                <th>User Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => {
                return (
                  <tr onClick={() => updateAdmin(admin._id)} key={index}>
                    <td className={styles.tableRow}>{admin.name}</td>
                    <td className={styles.tableRow}>{admin.username}</td>
                    <td className={styles.tableRow}>
                      <Button
                        name="deleteButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAdmin(admin);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {adminToDelete && (
        <Modal>
          Are you sure you want to delete user: {adminToDelete.username}?
          <Button name="modalDeleteButton" disable={isLoading} onClick={handleDelete}></Button>
          <Button name="modalCancelButton" onClick={() => setAdminToDelete(false)}></Button>
        </Modal>
      )}
      {error && (
        <Modal>
          {error}
          <Button name="modalCancelButton" onClick={() => setError(false)}></Button>
        </Modal>
      )}
      <Link to="/admins/form">
        <Button name="addButton" entity="ADMIN" />
      </Link>
    </section>
  );
};

export default Admins;
