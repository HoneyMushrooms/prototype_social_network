import React, { useState, useContext } from "react";
import styles from '../../styles/Edit.module.css';
import clipartIcon from '../../img/inputFile.png';
import { Context } from "../..";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastOptions from "../../utils/toast";

const Edit = ({ handleLinkClick }) => {
    
    const { store } = useContext(Context);
    const [file, setFile] = useState(null);
    const [values, setValues] = useState({
		name: store.user.name,
		surname: store.user.surname,
        city: store.user.city,
	});

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

	const handleChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const handleValidation = () => {
		const { name, surname, city } = values;
		if (name === "" || surname === "" || city === "") {
			toast.warn("Заполните все поля!", toastOptions);
			return false;
		} 
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleValidation()) {
			const { name, surname, city } = values;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', name);
            formData.append('surname', surname);
            formData.append('city', city);
            formData.append('logo', store.user.logo);
            try {
				await store.updateUser(formData);
                handleLinkClick('profile');
			} catch(err) {
                console.log('ошибка в updateUser')
			}
		}
	};

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h1>Обновление данных</h1>
                <hr/>
                <form noValidate className={styles.form_container} onSubmit={handleSubmit}>
                    <div className={styles.form_item}>
                        <input
                            value={values.name}
                            className={styles.form_input}
                            required
                            type="text"
                            name="name"
                            onChange={(e) => handleChange(e)}
                        />
                        <label className={styles.input_label}>Имя</label>
                    </div>
                    <div className={styles.form_item}>
                        <input
                            value={values.surname}
                            className={styles.form_input}
                            required
                            type="text"
                            name="surname"
                            onChange={(e) => handleChange(e)}
                        />
                        <label className={styles.input_label}>Фамилия</label>
                    </div>
                    <div className={styles.form_item}>
                        <input
                            value={values.city}
                            className={styles.form_input}
                            required
                            type="text"
                            name="city"
                            onChange={(e) => handleChange(e)}
                        />
                        <label className={styles.input_label}>Город</label>
                    </div>
                    <div className={styles.form_item}>
                        <input accept="image/*" type="file" id="myFileInput" onChange={handleFileChange}/>
                        <label htmlFor="myFileInput">
                            <img className={styles.icon} src={clipartIcon} alt="Choose file" />
                            <span className={styles.span_text}>{ file ? file.name  : 'Выберите новую аватарку' }</span>
                        </label>
                    </div>
                    <button>Обновить</button>
                </form>
            </div>
        </div>
    );
};

export default Edit;