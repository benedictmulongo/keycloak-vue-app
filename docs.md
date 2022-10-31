First, you’ll need to define an additional ARG variable, which is only there to pass through the value to your environment variable:

ARG buildtime_variable=default_value # <- this one's new
ENV env_var_name=$buildtime_variable # we reference it directly
Almost done! Now, when you’re building your image you can override the default_value of “buildtime_variable” any time you like:

$ docker build --build-arg buildtime_variable=a_value # ... the rest of the build command is omitted
You can change the value each time you run docker build without editing the Dockerfile. The ARG variable “buildtime_variable” will be set to your dynamic value and the ENV variable “env_var_name” will be set to the fresh ARG value.


https://www.psimms.de/keycloak-integration-in-vuejs-3/



There is a (half) official example how to integrate keycloak in an vue2 app, but not for vue3. Since the Global API changed in vue3, the example cant be transpiled directly. Also there is no persist of the token and the refresh logic is "rudimentary" at the best.

I show you here a small example in typescript which I am using, which can be easily adpoted to js by removing the return types.

First, you need to define the options of your keycloak connection.

const initOptions = {
  realm: 'your_realm',
  clientId: 'your_client_id',
  url: 'https://some.host.com/auth/',
  resource: 'your_resource', //this is optional, depending on your keycloak config
  'public-client': true,
  'verify-token-audience': false
}
// the last 2 parameters depends on the way, you want keycloak to behave. For me, public-client was just fine
Because I want the user to authenticate at the first visit, I need to put it before the createApp(). I also want to keep it simple, so no periodically refresh logic for the token. When the user is unauthenticated, I want to redirect him to the keycloak login interface. This way, it will work even the browser tab is closed without the need for the user to authenticate again at revisiting. For this I used this function:

export async function authenticateAgainstKeycloak (): Promise<void> {
  const keycloak = Keycloak(initOptions)
  await keycloak.init({ onLoad: 'login-required' }).then((auth) => {
    if (!auth) {
      window.location.reload()
    } else {
      console.log('Authenticated')
    }
    
    if (keycloak.token) {
      window.localStorage.setItem('keycloakToken', keycloak.token)
    }
  })
  await router.push('/')
}
fneed
You can see at the bottom that I store the keycloak token in the localStorage. This way, I can access it easily in all my backend requests. Of course this is complety dependend on your application.

To redirect the user to keycloak after the backend returns a 403 (or a 401, depending on your backend), I use an axios interceptor (of course only possible if you use axios as your http- client).

axiosBackend.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  console.log(error)
  if (error.reponse.status === 403) {
    await authenticateAgainstKeycloak()
    return error
  }
  return error
})
The last thing to do is to hook this function into the creation Process of the app

function instantiateVueApp () {
  createApp(App)
    .use(router)
    .mount('#app')
}

if (!window.localStorage.getItem('keycloakToken')) {
  authenticateAgainstKeycloak().then(() => {
    instantiateVueApp()
  })
} else {
  instantiateVueApp()
}
main.js
If a tokes is already existing, the app is instantiated directly, if not, only after the user authenticated at keycloak.

Remarks
This implementation does not provide the best user experience because the user is redirected to keycloak after the failure of an request, loosing all his data and does not know why it failed. Keep that in ming if you integrate this.

But for my prototyping usecase this is more than enough and until now it works perfectly.