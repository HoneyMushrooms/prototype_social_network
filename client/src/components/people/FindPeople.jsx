import { useState, useEffect } from 'react';
import styles from '../../styles/FindPeople.module.css';
import api from '../../utils/axios';
import toastOptions from '../../utils/toast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { findPeople } from '../../utils/router';

const FindPeople = ({ setFind }) => {

    const [fullName, setFullname] = useState('');

	const handleValidation = () => {
		const [name, surname] = fullName.split(' ');
		if (name === "" || surname === "") {
			toast.error("Введите значения!", toastOptions);
			return false;
		}
		return true;
	};

    const handleChange = (event) => {
        setFullname(event.target.value);
    };

    const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleValidation()) {
			const [name, surname] = fullName.split(' ');
			try {
                const { data } = await api.get(findPeople, { params: { name, surname }});
                setFind(data);
			} catch(err) {
                console.log('Ошибкa в поиске людей')
			}
		}
	};

    return (
        <form className={styles.form_find} noValidate onSubmit={(event) => handleSubmit(event)}>
            <div className={styles.form_item}>
                <input className={styles.form_input} required type='text' value={fullName} onChange={handleChange}/>
                <label className={styles.input_label}>Имя Фамилия</label>
            </div>
            <button>Найти людей</button>
        </form>
    )
}

export default FindPeople;