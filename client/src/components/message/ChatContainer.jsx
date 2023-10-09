import styles from '../../styles/ChatContainer.module.css';
import { useEffect, useState, useContext } from 'react';
import clipartIcon from '../../img/inputFile.png';
import { host, getMessages, addMessage } from '../../utils/router.js';
import api from '../../utils/axios';
import toastOptions from '../../utils/toast';
import { ToastContainer, toast } from 'react-toastify';
import { Context } from "../..";
import changeTimeFormat from '../../utils/changeTimeFormat';
import { observer } from 'mobx-react-lite';

const ChatContainer = ({ user }) => {

    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const { store, nm } = useContext(Context);

    useEffect(() => {
        api.get(getMessages, { params: { conversation_id: user.conversation_id } }).then(({data}) => setMessages([...data.reverse()])).catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        if(user.uuid === nm?.sender_id) {
            setMessages((prev) => [nm, ...prev])
        }
    }, [nm])

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
        formData.append('recipient_id', user.uuid);
        
        if(!file && !text) {
            toast.error('Невозможно создать пустой пост!', toastOptions);
            return;
        }
        
        try {
            const { data } = await api.post(`${addMessage}/${user.conversation_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            store.socket.send(JSON.stringify({
                type: 'newMessage',
                to: user.uuid,
                name: store.user.name,
                surname: store.user.surname,
                data: data[0]
            }));
            setFile(null);
            setText('');
            setMessages((prev) => [data[0], ...prev]);
        }  catch({ response: { data: { msg } } }) {
            toast.error(msg, toastOptions);
            setFile(null);
        }
    };

    return (
        <div>
            <div>
                <h3>{user.name} {user.surname}</h3>
                <hr/>
            </div>
            <div className={styles.chat_messages}>
                {messages.map((message, index) => (
                    <div className={styles.message} key={index}>
                        <div className={message.recipient_id === user.uuid ? styles.sended : styles.recieved}>
                            <div className={styles.content}>
                                {message?.text} 
                                <br/>
                                {message.type === 'image' && (
                                    <img className={styles.img_post} src={host + '/' + message.link} alt={''} />
                                )}
                                {message.type === 'video' && (
                                    <div>
                                        <video controls style={{width: '100%'}}>
                                        <source src={host + '/' + message.link} type="video/mp4" />
                                        </video>
                                    </div>
                                )}
                                {message.type === 'audio' && (
                                    <div>
                                        <audio controls>
                                        <source src={host + '/' + message.link} type="audio/mp3" />
                                        </audio>
                                    </div>
                                )}
                                <div style={{fontSize: 'small', float: 'right', marginTop: '5px'}}>{changeTimeFormat(message?.create_time)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <form className={styles.create_post} noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className={styles.form_item}>
                            <input className={styles.form_input} required type='text' value={text} onChange={handleTextChange}/>
                            <label className={styles.input_label}>Введите текст сообщения...</label>
                        </div>
                            
                        <div>
                            <input type="file" id="myFileInput" onChange={handleFileChange}/>
                            <label htmlFor="myFileInput">
                                <img className={styles.icon} src={clipartIcon} alt="Choose file"/>
                            </label>
                            <button type="submit">Отправить</button>
                        </div>
                        {file?.name && <div style={{gridColumnStart: 2, marginLeft: '2%'}}>{file?.name}</div>}
            </form> 
        </div>
    );
}

export default observer(ChatContainer);