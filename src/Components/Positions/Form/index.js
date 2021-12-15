import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useQuery from '../../../Hooks/useQuery';
import styles from './form.module.css';
import Input from '../../Shared/Input';
import Button from '../../Shared/Button';
import Modal from '../../Shared/Modal';
import Select from '../../Shared/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getPositionById, createPosition, updatePosition } from '../../../redux/positions/thunks';
import { cleanError, cleanSelectedItem } from '../../../redux/positions/actions';

function Form() {
  const [professionalProfileIdValue, setProfessionalProfileIdValue] = useState('');
  const [clientIdValue, setClientIdValue] = useState('');
  const [vacancyValue, setVacancyValue] = useState('');
  const [jobDescriptionValue, setJobDescriptionValue] = useState('');
  const [isOpenValue, setIsOpenValue] = useState('');
  const [clientsValue, setClientsValue] = useState([]);
  const [professionalProfilesValue, setProfessionalProfilesValue] = useState([]);
  const [selectClient, setSelectClient] = useState([]);
  const [selectProfessionalProfile, setSelectProfessionalProfile] = useState([]);
  const [errorValue, setError] = useState('');

  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedPosition = useSelector((store) => store.positions.selectedItem);
  const isLoading = useSelector((store) => store.positions.isFetching);
  const error = useSelector((store) => store.positions.error);

  const onChangeProfessionalProfileId = (event) => {
    setProfessionalProfileIdValue(event.target.value);
  };

  const onChangeClientId = (event) => {
    setClientIdValue(event.target.value);
  };

  const onChangeVacancy = (event) => {
    setVacancyValue(event.target.value);
  };

  const onChangeJobDescription = (event) => {
    setJobDescriptionValue(event.target.value);
  };

  const onChangeIsOpen = (event) => {
    setIsOpenValue(event.target.value);
  };

  useEffect(() => {
    const positionId = query.get('_id');
    if (positionId) {
      dispatch(getPositionById(positionId));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(selectedPosition).length) {
      setClientIdValue(selectedPosition.client?._id);
      setJobDescriptionValue(selectedPosition.jobDescription);
      setVacancyValue(selectedPosition.vacancy);
      setProfessionalProfileIdValue(selectedPosition.professionalProfile?._id);
      setIsOpenValue(selectedPosition.isOpen);
    }
  }, [selectedPosition]);

  useEffect(() => {
    return () => {
      dispatch(cleanSelectedItem());
    };
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/profiles`)
      .then((response) => response.json())
      .then((res) => {
        setSelectProfessionalProfile(
          res.data.map((professionalProfile) => ({
            value: professionalProfile._id,
            label: professionalProfile.name
          }))
        );
        setProfessionalProfilesValue(res.data);
      })
      .catch((errorValue) => {
        setError(errorValue.toString());
      });

    fetch(`${process.env.REACT_APP_API}/clients`)
      .then((response) => response.json())
      .then((res) => {
        setSelectClient(
          res.data.map((client) => ({
            value: client._id,
            label: client.name
          }))
        );
        setClientsValue(res.data);
      })
      .catch((errorValue) => {
        setError(errorValue.toString());
      });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const positionId = query.get('_id');

    if (positionId) {
      dispatch(
        updatePosition(positionId, {
          client: clientIdValue,
          jobDescription: jobDescriptionValue,
          vacancy: vacancyValue,
          professionalProfile: professionalProfileIdValue,
          isOpen: isOpenValue
        })
      ).then((response) => {
        if (response) {
          history.push('/positions');
        }
      });
    } else {
      dispatch(
        createPosition({
          client: clientIdValue,
          jobDescription: jobDescriptionValue,
          vacancy: vacancyValue,
          professionalProfile: professionalProfileIdValue,
          isOpen: isOpenValue
        })
      ).then((response) => {
        if (response) {
          history.push('/positions');
        }
      });
    }
  };

  return (
    <div>
      <Modal
        show={!!error}
        title="Error"
        message={error}
        cancel={{
          text: 'Close',
          callback: () => dispatch(cleanError())
        }}
      />
      <form onSubmit={onSubmit} className={styles.container}>
        <h2 className={styles.title}>Position</h2>
        <Select
          title="Client Name"
          id="clientId"
          name="clientId"
          value={clientIdValue}
          onChange={onChangeClientId}
          arrayToMap={selectClient}
          required
        />
        <Input
          title="Job Description"
          id="jobDescription"
          name="jobDescription"
          type="text"
          value={jobDescriptionValue}
          onChange={onChangeJobDescription}
          disabled={isLoading}
          required
        />
        <Input
          title="Vacancy"
          id="vacancy"
          name="vacancy"
          type="number"
          value={vacancyValue}
          onChange={onChangeVacancy}
          disabled={isLoading}
          required
        />
        <Select
          title="Professional Profile"
          id="professionalProfileId"
          name="professionalProfileId"
          value={professionalProfileIdValue}
          onChange={onChangeProfessionalProfileId}
          arrayToMap={selectProfessionalProfile}
          required
        />
        <Select
          title="Is Open"
          id="isOpen"
          name="isOpen"
          value={isOpenValue}
          onChange={onChangeIsOpen}
          arrayToMap={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ]}
          required
        />
        <div className={styles.buttonContainer}>
          <Button label="SAVE" disabled={isLoading} type="submit"></Button>
        </div>
      </form>
    </div>
  );
}

export default Form;
