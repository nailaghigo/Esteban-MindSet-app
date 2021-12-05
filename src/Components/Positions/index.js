import { useEffect, useState } from 'react';
import styles from './list.module.css';
import Modal from './Modal';
import Button from '../Shared/Button';
import { Link, useHistory } from 'react-router-dom';

function Positions() {
  const [showModal, setShowModal] = useState(false);
  const [positions, savePositions] = useState([]);
  const [idToDelete, setIdToDelete] = useState('');
  const [errorValue, setError] = useState('');
  const history = useHistory();

  // const goToForm = () => {
  //   window.location.href = `/positions/form`;
  // };

  const deletePosition = (id) => {
    const url = `${process.env.REACT_APP_API}/positions/${id}`;
    fetch(url, {
      method: 'DELETE'
    }).then(() => {
      fetch(`${process.env.REACT_APP_API}/positions`)
        .then((response) => response.json())
        .then((response) => {
          savePositions(response.data);
        })
        .catch((errorValue) => {
          setError(errorValue.toString());
        });
    });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/positions`)
      .then((response) => response.json())
      .then((response) => {
        savePositions(response.data);
      })
      .catch((errorValue) => {
        setError(errorValue.toString());
      });
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const preventAndShow = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setIdToDelete(id);
    setShowModal(true);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Positions</h2>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <td>Client</td>
            <td>Job Description</td>
            <td>Vacancy</td>
            <td>Professional profile</td>
            <td>Is Open</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {positions.map((position) => {
            return (
              <tr
                onClick={() => history.push(`/positions/form?_id=${position._id}`)}
                key={position._id}
              >
                <td>{position.client?.name || '-'}</td>
                <td>{position.jobDescription}</td>
                <td>{position.vacancy}</td>
                <td>{position.professionalProfile?.name || '-'}</td>
                <td>{position.isOpen.toString()}</td>
                <td>
                  <Button
                    name="deleteButton"
                    onClick={(e) => {
                      preventAndShow(e, position._id);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal id={idToDelete} function={deletePosition} show={showModal} closeModal={closeModal} />
      <Link to="/Positions/Form" className={styles.button}>
        <Button name="addButton" entity="POSITION" />
      </Link>
      <div className={styles.error}>{errorValue}</div>
    </section>
  );
}

export default Positions;
