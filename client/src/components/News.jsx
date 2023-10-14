import Posts from "./Posts";
import { getNews } from "../utils/router";
import api from "../utils/axios";
import { useEffect, useState } from "react";
import styles from '../styles/News.module.css';

const News = ({ handleLinkClick }) => {

    const [news, setNews] = useState([]);
    const [request, setRequest] = useState(true);
    const [lastItemId, setLastItemId] = useState();
    const [stopFlag, setStopFlag] = useState(false);
 
    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return function () {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, [])

    useEffect(() => {
        async function getUserNews() {
            if(request) {
                try {
                    const { data } = await api.get(getNews, { params: { limit: 5, lastItem: lastItemId }});
                    setLastItemId(data.at(-1).id);
                    setNews((prev) => [...prev, ...data]);
                } catch (err) {
                    // console.log('ошибка в новостях', err);
                    setStopFlag(true);
                } finally {
                    setRequest(false);
                }
            }
        }

        getUserNews();
    }, [request])

    const scrollHandler = (e) => {
        if((e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) && !stopFlag) {
            setRequest(true);
        }
    }

    return ( 
        news.length ? <Posts posts={news} setPosts={setNews} news={true} profileId={true} handleLinkClick={handleLinkClick}/> : <h2 className={styles.news}>Тут будут новости</h2>
    )
} 

export default News;