import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Shared/Button';
import styles from './postulants.module.css';
import Modal from '../Shared/Modal';
import { Link, useHistory } from 'react-router-dom';
import Table from '../Shared/Table';
import { getPostulants } from '../../redux/postulants/thunks';

function Postulants() {
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [showError, setShowError] = useState('');
  const [infoToShow, setInfoToShow] = useState([]);
  const [idToPass, setIdToPass] = useState([]);
  const history = useHistory();
  const columnName = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Actions'];
  const dispatch = useDispatch();
  const postulants = useSelector((store) => store.postulants.list);
  const isLoading = useSelector((store) => store.postulants.isLoading);

  useEffect(() => {
    if (!postulants.length) {
      dispatch(getPostulants());
    }
  }, [postulants]);

  const deletePostulant = () => {
    const url = `${process.env.REACT_APP_API}/postulants/${idToDelete}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(() => {
        closeModal();
        history.go(0);
      })
      .catch((err) => {
        setShowError(err);
      })
      .finally(() => {
        history.go(0);
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const preventAndShow = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setIdToDelete(id);
    setShowModal(true);
  };

  const redirect = (id) => {
    history.push(`/postulants/form?_id=${id}`);
  };

  const setInformationToShow = (data) => {
    const idToPass = [];
    const dataToPass = [];
    data.map((row) => {
      idToPass.push(row._id);
      dataToPass.push([
        row.firstName ? row.firstName : '-',
        row.lastName ? row.lastName : '-',
        row.email ? row.email : '-',
        row.phone ? row.phone : '-',
        row.address ? row.address : '-'
      ]);
    });
    setInfoToShow(dataToPass);
    setIdToPass(idToPass);
  };

  return (
    <section className={styles.container}>
      <Modal
        showModal={showModal}
        title="Do you want to proceed and delete this Postulant?"
        onClose={closeModal}
        isLoading={isLoading}
        onConfirm={deletePostulant}
      />
      <h2 className={styles.title}>Postulants</h2>
      {isLoading ? (
        <p className={styles.loading}>On Loading ...</p>
      ) : (
        <Table
          columnsName={columnName}
          id={idToPass}
          tableInfo={infoToShow}
          deleteFunction={preventAndShow}
          redirectFunction={redirect}
        />
      )}
      <div className={styles.showError}>{showError.message}</div>
      <div className={styles.buttonContainer}>
        <Link to="/Postulants/Form" className={styles.button}>
          <Button name="addButton" entity="POSTULANT" />
        </Link>
      </div>
    </section>
  );
}

export default Postulants;
