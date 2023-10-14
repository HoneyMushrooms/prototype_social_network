import styles from '../styles/Posts.module.css';
import { host } from '../utils/router'; 
import cross from '../img/cross.png';
import api from '../utils/axios';
import { deletePost } from '../utils/router';
import changeTimeFormat from '../utils/changeTimeFormat';
import Like from '../img/like.png';
import { setLike } from '../utils/router';
import { useContext } from 'react';
import { Context } from '..';

const Posts = ({ posts, setPosts, profileId, news, handleLinkClick }) => {
    const { store } = useContext(Context);
    
    const handleClick = async(id) => {
        try {
            await api.delete(deletePost + '/' + id);
            setPosts(prev => {
                const posts = prev.filter(e => e.id !== id);
                return [...posts];
            })
        } catch(err) {
            console.log('ошибка в deletePost');
        }
	};

    const handleClickLike = async(post_id) => {
        try {
            const { data } = await api.patch(setLike, {post_id, user_id: store.user.id});
            setPosts(prev => {
                const posts = prev.map(e => {
                    if(e.id === post_id) {
                        e.like = data.like;
                        e.flag = data.flag;
                    }
                    return e;
                });
                
                return [...posts];
            })
        } catch(err) {
            console.log('ошибка в setLike', err);
        }
	};

    return (
        <div>
            {posts.map((post) => (
            <div className={styles.container} key={post.id}>
                <h2>Пост&#160;</h2>
                {news &&<span onClick={() => handleLinkClick('other_profile', post.uuid)} className={styles.news}>от {post.name} {post.surname}</span>}
                <span className={styles.position}>
                    {changeTimeFormat(post.create_time)}
                    {!profileId && <img onClick={() => handleClick(post.id)} className={styles.icon} src={cross} alt='Cross'></img>}
                    <div className={styles.tooltip}>Удалить пост</div>
                </span>
                {post.type === 'image' && (
                <div>
                    <p>{post.text}</p>
                    <img className={styles.img_post} src={host + '/' + post.link} alt={''} />
                </div>
                )}
                {post.type === 'video' && (
                <div>
                    <p>{post.text}</p>
                    <video controls>
                    <source src={host + '/' + post.link} type="video/mp4" />
                    </video>
                </div>
                )}
                {post.type === 'audio' && (
                <div>
                    <p>{post.text}</p>
                    <audio controls>
                    <source src={host + '/' + post.link} type="audio/mp3" />
                    </audio>
                </div>
                )}
                {post.type === '' && post.text !== '' && <p>{post.text}</p>}
                <div style={{margin: '20px 0 0 20px'}}><span onClick={() => handleClickLike(post.id)} className={`${styles.like_num} ${post.flag ? styles.like_set : ''}`}>{post?.like || 0}<img className={styles.like_img} src={Like} alt="Like" /></span></div>
            </div>
            ))}
        </div>
    );
};
  
export default Posts;