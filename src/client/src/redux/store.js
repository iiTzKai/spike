import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage/';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import googleUser from './reducers/googleUser';
import imapUser from './reducers/imapUser';
import emailsHolder from './reducers/emails';
import showNav from './reducers/showNav';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  googleAuth: googleUser,
  imapAuth: imapUser,
  emailHolder: emailsHolder,
  navigation: showNav,
});

const persisteReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisteReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
