import styles from '../../styles/Profile.module.css';
import { useState, useEffect, useContext } from 'react';
import clipartIcon from '../../img/inputFile.png';
import Posts from '../Posts';
import api from '../../utils/axios';
import { getUser, createPost } from '../../utils/router';
import { Context } from "../..";
import { ToastContainer, toast } from 'react-toastify';
import toastOptions from '../../utils/toast';
import 'react-toastify/dist/ReactToastify.css';
import edit from '../../img/edit.png';
import { host } from '../../utils/router'; 

const Profile = ({ handleLinkClick, profileId }) => {
    window.scrollTo({top: 0});
    const { store } = useContext(Context);
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getUserInfo(id) {
            try {
                const { data } = await api.get(getUser, { params: { id } });
                setUser(data.userData);
                setPosts(data.postData);
            } catch(err) {
                console.log('ошибка в getUser', err);
            }
        }
        profileId ? getUserInfo(profileId) : getUserInfo(store.user.id);
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    
    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', text);
        
        if(!file && !text) {
            toast.error('Невозможно создать пустой пост!', toastOptions);
            return;
        }
        try {
            const { data } = await api.post(createPost, formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            setFile(null);
            setText('');
            setPosts((prev) => [data[0], ...prev]);
        }  catch({ response: { data: { msg } } }) {
            toast.error(msg, toastOptions);
            setFile(null);
        }
    };

    return (
        <>
            {user ? (
                <>
                    <div className={styles.container}>
                        <img className={styles.logo} src={host + '/' + user.logo} alt="Logo" />
                        <div>
                            <h1 className={styles.title}>{user.name} {user.surname}</h1>
                            {!profileId && <img className={styles.edit} src={edit} alt="Edit" onClick={() => handleLinkClick('edit')}/>}
                            <hr className={styles.line} />
                            <p>Город: {user.city}</p>
                            <p>Друзья: {user.friends}</p>
                            <p>Подписчики: {user.followers}</p>
                            <p>Подписки: {user.subscriptions}</p>
                        </div>
                    </div>
                    
                    {!profileId &&  <form className={styles.create_post} noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className={styles.form_item}>
                            <input className={styles.form_input} required type='text' value={text} onChange={handleTextChange}/>
                            <label className={styles.input_label}>Введите текст записи...</label>
                        </div>
                            
                        <div>
                            <input type="file" id="myFileInput" onChange={handleFileChange}/>
                            <label htmlFor="myFileInput">
                                <img className={styles.icon} src={clipartIcon} alt="Choose file"/>
                            </label>
                            <button type="submit">Создать пост</button>
                        </div>
                        {file?.name && <div style={{gridColumnStart: 2, marginLeft: '2%'}}>{file?.name}</div>}
                    </form> }

                {posts.length? <Posts profileId={profileId} posts={posts} setPosts={setPosts}/> : <></>}
                </>
                ) : <div>Загрузка...</div>
            }
        </>
    )
}

export default Profile;