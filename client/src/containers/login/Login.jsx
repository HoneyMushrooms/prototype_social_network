import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../img/logo.png';
import styles from '../../styles/Login.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from "validator";
import toastOptions from '../../utils/toast.js';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import generateFingerprint from "../../utils/fingerprint";

function LoginPage() {

	const { store } = useContext(Context);
	const navigate = useNavigate();
	const { state } = useLocation();

	const [isAuthChecked, setIsAuthChecked] = useState(false);
	const [values, setValues] = useState({
		email: "",
		password: "",
	});

	useEffect(() => {
 		if(state?.msg) setTimeout(() => toast.success(state.msg, toastOptions));
	}, []);

	useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth(generateFingerprint());
        }
		setIsAuthChecked(true);
    }, []);
	
	if(store.isAuth) navigate('/main');
	
    if (!isAuthChecked) {
		return null; 
	}
	
	const handleChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const handleValidation = () => {
		const { email, password } = values;
		if (email === "" || password === "") {
			toast.warn("Заполните все поля!", toastOptions);
			return false;
		} else if(!validator.isEmail(email)) {
			toast.error("Некорректный адрес почты!", toastOptions);
			return false;
		} 
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleValidation()) {
			const { email, password } = values;
			try {
				await store.login(email, password, generateFingerprint());
				navigate('/main');
			} catch(err) {
				const error = err.response?.data;
				if(typeof error === 'string') {
					toast.error(error, toastOptions);
				} else {
					toast.error(error?.msg, toastOptions);
				}
			}
		}
	};

	return (
		<div className={styles.main}>
			<form className={styles.form_login} action="" noValidate onSubmit={(event) => handleSubmit(event)}>
			<div className={styles.header}>
				<img className={styles.logo} src={Logo} alt="logo" />
				<h1>Вход в CherryConnect</h1>
			</div>
			<hr/>
				<div className={styles.form_item}>
					<input
						value={values.email}
						className={styles.form_input}
						required
						type="text"
						name="email"
						onChange={(e) => handleChange(e)}
					/>
					<label className={styles.input_label}>Почта</label>
				</div>
				<div className={styles.form_item}>
					<input
						value={values.password}
						className={styles.form_input}
						required
						type="password"
						name="password"
						onChange={(e) => handleChange(e)}
					/>
					<label className={styles.input_label}>Пароль</label>
				</div>
				<div className={styles.footer}>
					<button className={styles.button}>Войти</button>
					<span>&#160;&#160;&#160;Нету профиля? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>.</span>
					<span>&#160;&#160;&#160;&#160;&#160;&#160;&#160;Забыли пароль? <Link to="/fogot-password" className={styles.link}>Восстановить</Link>.</span>
					{/* без комментариев)) */}
				</div>
			</form>
		
			<ToastContainer/>
		</div>
	);
}

export default observer(LoginPage);