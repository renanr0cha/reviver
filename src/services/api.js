import axios from 'axios';

const api = axios.create({
  baseURL: 'http://reviver.cubecode.com.br/api/v1' 
  //baseURL: 'http://10.0.2.2/laravel-reviver/public/api/v1'
});

export default api