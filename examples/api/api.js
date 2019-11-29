import {post, get} from './hppts.js'

export const apiAddUser = params => post('/api/todoList/addUser', params);
export const apiGetCode = params => get('/api/todoList/verificationCode', params);
export const apiLogin = params => post('/api/todoList/userLogin', params);
export const apiupdateUser = params => post('/api/todoList/updateUser', params);
export const apigetUser = params => get('/api/todoList/getUser', params);
export const apigetThings = params => get('/api/todoList/getThings', params);
export const apigetoneThings = params => get('/api/todoList/getoneThings', params);
export const apiaddThing = params => post('/api/todoList/addThing', params);
export const apiupdateThing = params => post('/api/todoList/updateThing', params);
export const apideleteThing = params => post('/api/todoList/deleteThing', params);
