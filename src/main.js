import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './assets/main.css'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import Menubar from 'primevue/menubar'
import Sidebar from 'primevue/sidebar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import InputSwitch from 'primevue/inputswitch'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Lara
    }
})

app.use(ToastService)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Card', Card)
app.component('Toast', Toast)
app.component('Menubar', Menubar)
app.component('Sidebar', Sidebar)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dropdown', Dropdown)
app.component('Calendar', Calendar)
app.component('Checkbox', Checkbox)
app.component('InputSwitch', InputSwitch)

app.mount('#app')
