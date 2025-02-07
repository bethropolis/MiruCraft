import './style.css'
import "./lib/external/CryptoJS.min.js"
import "./lib/external/jsencrypt.min.js"
import "./lib/external/md5.min.js"

import App from './App.svelte'


const app = new App({
  target: document.getElementById('app')
})

export default app
