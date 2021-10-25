import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import { authentication } from '../../helpers/services/authentication';
import axios from 'axios';

import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from '../actions';

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
} from './actions';

import { adminRoot } from '../../constants/defaultValues';
import { setCurrentUser, getCurrentUser } from '../../helpers/Utils';

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password) =>
  await authentication
    .login(email, password)
    .then((loginUser) => ({loginUser}))
    .catch((error) => ({error}));

function* loginWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const {loginUser, error} = yield call(loginWithEmailPasswordAsync, email, password);
    console.log(loginUser);
    console.log(error);
    if (loginUser && loginUser.status === 200) {
      setCurrentUser(loginUser.data);
      setAuthToken(loginUser.data.user_api_hash);
      yield put(loginUserSuccess(loginUser.data));
      
      // if (loginUser.data.firstLogin) {
      //   history.push('/user/change-password');
      //   return;
      // }
      const cbUrl =
      history.location &&
      history.location.state &&
      history.location.state.from
        ? history.location.state.from
        : null;
      if (cbUrl) {
        history.push(cbUrl);
      } else {
        history.push(adminRoot);
      }
    } else {
      console.log(JSON.stringify(error))
      if (error.response.status === 401) {
        yield put(loginUserError('Invalid username / password.'));
      } else if(error.response.data.message){
        yield put(loginUserError(error.response.data.message));
      } else{
        yield put(loginUserError('Could not reach server, please try again later.'));
      }
    }
  } catch (error) {
    if(error.response && error.response.message){
      yield put(loginUserError(error.response.message));
    } else if(error.response && error.response.data && error.response.data.message){
      yield put(loginUserError(error.response.data.message));
    } else {
      yield put(loginUserError('Could not reach server, please try again later.'));
    }
  }
}

const setAuthToken = (token) => {
  axios.interceptors.request.use(function (config) {
    const authenticationHeader = token;
    if (authenticationHeader) {
      config.headers = authenticationHeader;
    } else {
      console.log('There is not token yet...');
    }
    return config;
  });
};

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (email, password) =>
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then((user) => user)
    .catch((error) => error);

function* registerWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const registerUser = yield call(
      registerWithEmailPasswordAsync,
      email,
      password
    );
    if (!registerUser.message) {
      const item = { uid: registerUser.user.uid };
      setCurrentUser(item);
      yield put(registerUserSuccess(item));

      history.push(adminRoot);
    } else {
      yield put(registerUserError(registerUser.message));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
  await auth
    .signOut()
    .then((user) => user)
    .catch((error) => error);
  history.push(adminRoot);
};

function* logout({ payload }) {
  const { history } = payload;
  setCurrentUser();
  yield call(logoutAsync, history);
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  return await auth
    .sendPasswordResetEmail(email)
    .then((user) => user)
    .catch((error) => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (!forgotPasswordStatus) {
      yield put(forgotPasswordSuccess('success'));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  return await auth
    .confirmPasswordReset(resetPasswordCode, newPassword)
    .then((user) => user)
    .catch((error) => error);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  try {
    const resetPasswordStatus = yield call(
      resetPasswordAsync,
      resetPasswordCode,
      newPassword
    );
    if (!resetPasswordStatus) {
      yield put(resetPasswordSuccess('success'));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
  ]);
}
