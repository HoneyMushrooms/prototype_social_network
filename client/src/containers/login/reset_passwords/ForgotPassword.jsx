import { useState } from "react";
import Logo from '../../../img/logo.png';
import styles from '../../../styles/Login.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from "validator";
import axios from 'axios';
import { fogotPassword } from '../../../utils/router.js';
import toastOptions from '../../../utils/toast.js';

function ForgotPassword() {

	const [email, setEmail] = useState("");

	const handleChange = (event) => setEmail(event.target.value);

	const handleValidation = () => {
		if(!validator.isEmail(email)) {
			toast.error("Некорректный адрес почты!", toastOptions);
			return false;
		} 
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleValidation()) {
			try {
				const { data } = await axios.post(fogotPassword, { email: email.trim() });			
				toast.success(data, toastOptions);
			} catch({ response: { data: { msg } } }) {
				toast.error(msg, toastOptions);
			}
		}
	};

	return (
		<div className={styles.main}>
			<form className={styles.form_login}  style={{minWidth: 400}} action="" noValidate onSubmit={(event) => handleSubmit(event)}>
			<div className={styles.header}>
				<img className={styles.logo} src={Logo} alt="logo" />
				<h1>Сброс пароля</h1>
			</div>
			<hr/>
				<div className={styles.form_item}>
					<input
						value={email}
						className={styles.form_input}
						required
						type="text"
						name="email"
						onChange={(e) => handleChange(e)}
					/>
					<label className={styles.input_label}>Введите почту к которой привязан аккаунт</label>
				</div>
				<div className={styles.footer}>
					<button className={styles.button}>Отправить</button>
				</div>
			</form>
			<ToastContainer/>
		</div>
	);
}

export default ForgotPassword;