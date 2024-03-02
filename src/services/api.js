import axios from 'axios';

const api = axios.create({
  baseURL: 'https://reviver.cubecode.com.br/api/v1' 
  //baseURL: 'http://10.0.2.2/laravel-reviver/public/api/v1'
  //baseURL: 'http://192.168.100.5/laravel-reviver/public/api/v1'
});

export default api