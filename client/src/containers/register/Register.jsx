import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../img/logo.png';
import styles from '../../styles/Register.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from "validator";
import toastOptions from '../../utils/toast.js';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import generateFingerprint from "../../utils/fingerprint";

function RegisterPage({ setFirstConnect }) {

    const { store } = useContext(Context);
	const navigate = useNavigate();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [values, setValues] = useState({
        name: "",
        surname: "",
        email: "danila8963100@gmail.com",
        city: "Витебск",
        password: "111",
        repeat_password: "111",
    });

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
        const { name, surname, email, password, repeat_password, city } = values;
        if (name === "" || surname === "" || email === "" || password === "" || repeat_password === "" || city === "") {
            toast.warn("Заполните все поля!", toastOptions);
            return false;
        } else if(!validator.isEmail(email)) {
            toast.error("Некорректный адрес почты!", toastOptions);
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
            const { name, surname, email, password, city } = values;
            try {
                await store.registration(name, surname, email, password, city, generateFingerprint());
                setFirstConnect(true);
                navigate('/main', { state: {msg: 'Подтвердите почту!' }});
            } catch({ response: { data: { msg } } }) {
                toast.error(msg, toastOptions);
            }
        }
    };
    
    return (
        
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <img className={styles.logo} src={Logo} alt="logo" />
                    <h1>Форма регистрации</h1>
                </div>
            <hr/>
            <form className={styles.form_register} action="" noValidate onSubmit={(event) => handleSubmit(event)}>
                <div className={styles.form_item}>
                    <input
                        value={values.name}
                        tabIndex="1"
                        className={styles.form_input}
                        required
                        autoFocus={true} 
                        type="text"
                        name="name"
                        onChange={(e) => handleChange(e)}
                    />
                    <label className={styles.input_label}>Имя</label>
                </div>
                <div className={styles.form_item}>
                    <input
                        value={values.email}
                        tabIndex="4"
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
                        value={values.surname}
                        tabIndex="2"
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
                        value={values.password}
                        tabIndex="5"
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
                        value={values.city}
                        tabIndex="3"
                        className={styles.form_input}
                        required
                        type="text"
                        name="city"
                        onChange={(e) => handleChange(e)}
                    />
                    <label className={styles.input_label}>Страна/Город</label>
                </div>
                <div className={styles.form_item}>
                    <input
                        value={values.repeat_password}
                        tabIndex="6"
                        className={styles.form_input}
                        required
                        type="password"
                        name="repeat_password"
                        onChange={(e) => handleChange(e)}
                    />
                    <label className={styles.input_label}>Повторный пароль</label>
                </div>
                <div className={styles.footer}>
                    <button className={styles.button}>Создать профиль</button>
                    <span>&#160;&#160;&#160;Уже есть профиль? <Link to="/login" className={styles.link}>Вход.</Link></span>
                </div>
            </form>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default observer(RegisterPage);