import { makeAutoObservable } from "mobx";
import api from "../utils/axios";
import axios from 'axios';
import { loginRoute, registerRoute, refreshRoute, logoutRoute, updateUser } from "../utils/router";

export default class Store {
    user = {};
    isAuth = false;
    isError = false;
    isFirstVisit = true;
    socket;
    activePage;
    activeDialog;   

    constructor() {
        makeAutoObservable(this);
    }

    setActivePage(page) {
        this.activePage = page; 
    }

    setActiveDialog(num) {
        this.activeDialog = num; 
    }
   
    setSocket(socket) {
        this.socket = socket; 
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setFirstVisit(bool) {
        this.isFirstVisit = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setError(bool) {
        this.isError = bool;
    }

    async login(email, password, fingerprint) {
        const { data } = await api.post(loginRoute, { email, password, fingerprint });
        localStorage.setItem('token', data.accessToken);
        this.setAuth(true);
        this.setUser(data.userData);
    }

    async registration(name, surname, email, password, city, fingerprint) {
        const { data } = await api.post(registerRoute, { name, surname, email, password, city, fingerprint });
        localStorage.setItem('token', data.accessToken);
        this.setAuth(true);
        this.setUser(data.userData);
    }

    async logout(fingerprint) {
        await api.post(logoutRoute, { fingerprint });
        localStorage.removeItem('token');
        this.setAuth(false);
        this.setUser({});
        this.countNewRelationship = 0;
        this.countNewFriends = 0;
        this.countNewFollowers = 0;
    }

    async checkAuth(fingerprint) {
        try {
            const { data } = await axios.post(refreshRoute, { fingerprint }, { withCredentials: true });
            localStorage.setItem('token', data.accessToken);
            this.setAuth(true);
            this.setUser(data.userData);
        } catch (err) {
            this.setError(true);
        }
    }

    async updateUser(formData) {
        const { data } = await api.put(updateUser, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        this.setUser(data);
    }
}