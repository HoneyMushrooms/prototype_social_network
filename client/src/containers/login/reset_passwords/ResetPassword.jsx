import { useState } from "react";
import Logo from '../../../img/logo.png';
import styles from '../../../styles/Login.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { resetPassword } from '../../../utils/router.js';
import toastOptions from '../../../utils/toast.js';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const nav = useNavigate();
    const { link } = useParams();
	const [passwords, setPasswords] = useState({
        password: "",
        repeat_password: "", 
    });

    const handleChange = (event) => {
        setPasswords({ ...passwords, [event.target.name]: event.target.value });
    };

	const handleValidation = () => {
        const { password, repeat_password } = passwords;
        if (password === "" || repeat_password === "") {
            toast.warn("Заполните все поля!", toastOptions);
            return false;
        } else if(password.length < 3) {
            toast.warn("Длинна пароля не меньше 3-х символов!", toastOptions);
            return false;
        } else if(password !== repeat_password) {
            toast.error("Пароли не совпадают", toastOptions);
            return false;
        }
        return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleValidation()) {
			try {
                const { password  } = passwords;
			    const res = await axios.post(resetPassword, { password, link });
                nav('/login', { state: { msg: res.data } });			
			}  catch({ response: { data } }) {
				if(data.msg) toast.error(data.msg, toastOptions);
				else toast.error(data, toastOptions);
			}
		}
	};

	return (
		<div className={styles.main}>
			<form className={styles.form_login}  style={{minWidth: 400}} action="" noValidate onSubmit={(event) => handleSubmit(event)}>
			<div className={styles.header}>
				<img className={styles.logo} src={Logo} alt="logo" />
				<h1>Создание нового пароля</h1>
			</div>
			<hr/>
            <div className={styles.form_item}>
                    <input
                        value={passwords.password}
                        className={styles.form_input}
                        required
                        type="password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <label className={styles.input_label}>Пароль</label>
                </div>
                <div className={styles.form_item}>
                    <input
                        value={passwords.repeat_password}
                        className={styles.form_input}
                        required
                        type="password"
                        name="repeat_password"
                        onChange={(e) => handleChange(e)}
                    />
                    <label className={styles.input_label}>Повторный пароль</label>
                </div>
				<div className={styles.footer}>
					<button className={styles.button}>Сохранить пароль</button>
				</div>
			</form>
			<ToastContainer/>
		</div>
	);
}

export default ResetPassword;