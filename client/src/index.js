import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './containers/app/App';
import Store from './store/store';

export const store = new Store();

function Main() {
    const [rl, setRl] = useState(null);
    const [nm, setNm] = useState(null);

    return (
        <Context.Provider value={{store, rl, setRl, nm, setNm}}>
            <App />
        </Context.Provider>
    )
}

export const Context = createContext({
    store,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Main />
);