import { useEffect, useState } from 'react';
import Modal from './Modal';
import styles from './profiles.module.css';

function Profiles() {
  const [showModal, setShowModal] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  console.log(profiles);
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API}/profiles`)
      .then((response) => {
        if (response.status !== 200) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then((response) => setProfiles(response.data))
      .catch((error) => setError(error.toString()))
      .finally(() => setLoading(false));
  }, []);

  const redirectToForm = (profile) => {
    profile
      ? (window.location.href = `${window.location.pathname}/form?id=${profile}`)
      : (window.location.href = `${window.location.pathname}/form`);
  };

  const handleDelete = (event, profile) => {
    event.stopPropagation();
    setSelectedItem(profile._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(undefined);
  };

  const deleteProfile = () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_API}/profiles/${selectedItem}`;
    fetch(url, { method: 'DELETE' })
      .then((response) => {
        if (response.status !== 204) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return fetch(`${process.env.REACT_APP_API}/profiles`)
          .then((response) => {
            if (response.status !== 200) {
              return response.json().then(({ message }) => {
                throw new Error(message);
              });
            }
            return response.json();
          })
          .then((response) => {
            setProfiles(response.data);
            closeModal();
          });
      })
      .catch((error) => setError(error.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <section className={styles.container}>
      <Modal
        showModal={showModal}
        title="Do you want to proceed and delete this profile?"
        onClose={closeModal}
        isLoading={isLoading}
        onConfirm={deleteProfile}
      />
      <h2>Profiles</h2>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              return (
                <tr key={profile._id} onClick={() => redirectToForm(profile._id)}>
                  <td>{profile.name}</td>
                  <td>
                    <button type="delete" onClick={(event) => handleDelete(event, profile)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.error}>{error}</div>
      <button
        type="add"
        className={styles.button}
        disabled={isLoading}
        onClick={() => redirectToForm()}
      >
        Add Profile
      </button>
    </section>
  );
}

export default Profiles;
