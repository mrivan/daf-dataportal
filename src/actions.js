import fetch from 'isomorphic-fetch'
import page from './data/dataset'
import det from './data/datasetdetail'
import { serviceurl } from './config/serviceurl.js'
import { login } from './helpers/auth'

export const REQUEST_DATASETS = 'REQUEST_DATASETS'
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS'
export const DELETE_DATASETS = 'DELETE_DATASETS'
export const SELECT_DATASET = 'SELECT_DATASET'
export const REQUEST_DATASET_DETAIL = 'REQUEST_DATASET_DETAIL'
export const RECEIVE_DATASET_DETAIL = 'RECEIVE_DATASET_DETAIL'
export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const REMOVE_LOGGED_USER = 'REMOVE_LOGGED_USER'
export const RECEIVE_ORGANIZATION = 'RECEIVE_ORGANIZATION'


function requestDatasets() {
  return {
    type: REQUEST_DATASETS
  }
}

function requestDatasetDetail(selectDataset) {
  return {
    type: REQUEST_DATASET_DETAIL
  }
}

function requestLogin() {
  return {
    type: REQUEST_LOGIN
  }
}

function receiveDataset(json) {
  console.log('receiveDataset');
  //This function creates an action that a reducer can handle 
  //Action are payload of information that sends data from the application to the store
  //Store doesn't have any other way to get data
  //Action are not responsible for update the state (only reducers) !!! 
  console.log('MODE: ' + process.env.NODE_ENV) 
  if(process.env.NODE_ENV=='development')
    return {
      type: RECEIVE_DATASETS,
      datasets: page,
      receivedAt: Date.now(),
      ope: 'RECEIVE_DATASETS'
  }
  else  
  return {
      type: RECEIVE_DATASETS,
      datasets: json,
      receivedAt: Date.now(),
      ope: 'RECEIVE_DATASETS'
  }
}

function receiveDatasetDetail(json) {
  console.log('receiveDatasetDetail');
  console.log('MODE: ' + process.env.NODE_ENV)
  if(process.env.NODE_ENV=='development') 
  return {
      type: RECEIVE_DATASET_DETAIL,
      dataset: det,
      receivedAt: Date.now(),
      ope: 'RECEIVE_DATASET_DETAIL'
  }
  else 
  return {
      type: RECEIVE_DATASET_DETAIL,
      dataset: json,
      receivedAt: Date.now(),
      ope: 'RECEIVE_DATASET_DETAIL'
  }
}


function removeLoggedUser() {
  console.log('removeLoggedUser');
  return {
      type: REMOVE_LOGGED_USER,
      receivedAt: Date.now(),
      ope: 'REMOVE_LOGGED_USER'
  }
}

function receiveLogin(response) {
  console.log('receiveLogin');
  console.log(response);
  
  return {
      type: RECEIVE_LOGIN,
      user: response,
      receivedAt: Date.now(),
      ope: 'RECEIVE_LOGIN'
  }
}

function receiveOrganization(response) {
  console.log('receiveOrganization');
  console.log(response);
  
  return {
      type: RECEIVE_ORGANIZATION,
      org: response,
      receivedAt: Date.now(),
      ope: 'RECEIVE_ORGANIZATION'
  }
}


function cleanDataset(json) {
  console.log('cleanDataset');
  //This function creates an action that a reducer can handle 
  return {
    type: DELETE_DATASETS,
    datasets: null,
    receivedAt: Date.now()
  }
}

function fetchDataset(query) {
  console.log('fetchDataset');
  var queryurl='';
  if(query)
    queryurl='&q='+query;
  console.log('queryurl: ' + queryurl);
  var url = 'http://' + serviceurl.DatasetBackend.Search.host + ':' + serviceurl.DatasetBackend.Search.port + serviceurl.DatasetBackend.Search.nameSearch + '?rows=20' + queryurl;
  console.log('url: ' + url);
  if(process.env.NODE_ENV=='development'){
    return dispatch => {dispatch(receiveDataset(null))}
  } else {
    return dispatch => {
      dispatch(requestDatasets())
      return fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receiveDataset(json)))
    }
  }
}

function fetchDatasetDetail(datasetname) {
  console.log('fetchDatasetDetail');
  //http://localhost:9000/dati-gov/v1/ckan/datasets/${this.props.params.post
  var url = 'http://' + serviceurl.DatasetBackend.Search.host + ':' + serviceurl.DatasetBackend.Search.port + serviceurl.DatasetBackend.Search.nameDetail + datasetname;
  console.log(url);
  if(process.env.NODE_ENV=='development'){
    return dispatch => {dispatch(receiveDatasetDetail(null))}
  } else {
    return dispatch => {
      dispatch(requestDatasetDetail())
      return fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receiveDatasetDetail(json)))
    }
  }
}

export function loadDatasets(query) {
  console.log('Load Dataset action');
  return (dispatch, getState) => {
      return dispatch(fetchDataset(query))
  }
 
}

export function unloadDatasets() {
  console.log('Unload Dataset action');
  return (dispatch, getState) => {
      return dispatch(cleanDataset())
  }
}

export function datasetDetail(datasetname) {
  console.log('Dataset Detail action');
  return (dispatch, getState) => {
      return dispatch(fetchDatasetDetail(datasetname))
  }
}

/*
export function loginAction(email, pw) {
  console.log("Called action loginAction");
    return dispatch => {
      dispatch(requestLogin())
      return login(email, pw)
        .then(response => dispatch(receiveLogin(response)))
    }
}
*/
export function loginAction(username, pw) {
  console.log("Called action loginAction");
  var url = 'http://localhost:9001/catalog-manager/v1/ckan/user/' + username;
  //var url = 'http://' + serviceurl.DatasetBackend.Search.host + ':' + serviceurl.DatasetBackend.Search.port + serviceurl.DatasetBackend.Search.nameDetail + datasetname;
  console.log(url);
  var toencode = username + ':' +pw;
  const encodedString = new Buffer(toencode).toString('base64');
  localStorage.setItem('encodedString', encodedString);
  localStorage.setItem('username', username);
  return dispatch => {
      dispatch(requestLogin())
      return fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + encodedString
          }
        })
        .then(response => response.json())
        .then(json => dispatch(receiveLogin(json)))
        //.then(addUserOrganization(username,encodedString))
  }
}

export function loginActionEncoded(username, encodedString) {
  console.log("Called action loginActionEncoded");
  var url = 'http://localhost:9001/catalog-manager/v1/ckan/user/' + username;
  //var url = 'http://' + serviceurl.DatasetBackend.Search.host + ':' + serviceurl.DatasetBackend.Search.port + serviceurl.DatasetBackend.Search.nameDetail + datasetname;
  console.log(url);
  localStorage.setItem('encodedString', encodedString);
  localStorage.setItem('username', username);
  return dispatch => {
      dispatch(requestLogin())
      return fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + encodedString
          }
        })
        .then(response => response.json())
        .then(json => dispatch(receiveLogin(json)))
  }
}

export function logout() {
  console.log("logout");
  localStorage.removeItem('encodedString');
  localStorage.removeItem('username');
  return dispatch => { dispatch(removeLoggedUser()) }
}

export function addUserOrganization(username, pw) {
  console.log("Called action loginActionEncoded");
  var url = 'http://localhost:9001/catalog-manager/v1/ckan/userOrganizations/' + username;
  //var url = 'http://' + serviceurl.DatasetBackend.Search.host + ':' + serviceurl.DatasetBackend.Search.port + serviceurl.DatasetBackend.Search.nameDetail + datasetname;
  console.log(url);
  var toencode = username + ':' +pw;
  const encodedString = new Buffer(toencode).toString('base64');
  localStorage.setItem('encodedString', encodedString);
  localStorage.setItem('username', username);
  return dispatch => {
      return fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + encodedString
          }
        })
        .then(response => response.json())
        .then(json => dispatch(receiveOrganization(json)))
  }
}

export function addUserOrganizationEncoded(username, encodedString) {
  console.log("Called action loginActionEncoded");
  var url = 'http://localhost:9001/catalog-manager/v1/ckan/userOrganizations/' + username;
  //var url = 'http://' + serviceurl.DatasetBackend.Search.host + ':' + serviceurl.DatasetBackend.Search.port + serviceurl.DatasetBackend.Search.nameDetail + datasetname;
  console.log(url);
  localStorage.setItem('encodedString', encodedString);
  localStorage.setItem('username', username);
  return dispatch => {
      return fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + encodedString
          }
        })
        .then(response => response.json())
        .then(json => dispatch(receiveOrganization(json)))
  }
}
