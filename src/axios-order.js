import axios from 'axios'

const instance = axios.create({
    baseURL: ''// base url of your database
})

export default instance