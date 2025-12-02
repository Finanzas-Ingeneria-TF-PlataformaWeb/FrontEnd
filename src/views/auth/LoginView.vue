<template>
  <div class="card">
    <!-- Checkbox para modo "blind" (manos tapando ojos + mostrar/ocultar contraseña) -->
    <input
        v-model="blind"
        class="blind-check"
        type="checkbox"
        id="blind-input"
        name="blindcheck"
        hidden
    />

    <!-- Glow detrás del avatar -->
    <div class="card-glow"></div>

    <!-- Encabezado -->
    <header class="card-header">
      <h2 class="card-title">Inicia sesión</h2>
      <p class="card-subtitle">Accede a tu panel de administración</p>
    </header>

    <!-- Avatar del mono -->
    <label
        for="blind-input"
        class="avatar"
        :class="{
        'shake-anim': monkeyState === 'error',
        'success-anim': monkeyState === 'success'
      }"
        aria-label="Mostrar u ocultar contraseña"
    >
      <!-- Cara del mono -->
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 64 64"
          id="monkey"
      >
        <ellipse cx="53.7" cy="33" rx="8.3" ry="8.2" fill="#89664c" />
        <ellipse cx="53.7" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3" />
        <ellipse cx="10.2" cy="33" rx="8.2" ry="8.2" fill="#89664c" />
        <ellipse cx="10.2" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3" />

        <g fill="#89664c">
          <path
              d="m43.4 10.8c1.1-.6 1.9-.9 1.9-.9-3.2-1.1-6-1.8-8.5-2.1 1.3-1 2.1-1.3 2.1-1.3-20.4-2.9-30.1 9-30.1 19.5h46.4c-.7-7.4-4.8-12.4-11.8-15.2"
          />
          <path
              d="m55.3 27.6c0-9.7-10.4-17.6-23.3-17.6s-23.3 7.9-23.3 17.6c0 2.3.6 4.4 1.6 6.4-1 2-1.6 4.2-1.6 6.4 0 9.7 10.4 17.6 23.3 17.6s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4 1-2 1.6-4.2 1.6-6.4"
          />
        </g>

        <path
            d="m52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7-1.3 1.7-2.1 3.6-2.1 5.7 0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7 4.4-2.7 7.3-7 7.3-11.7"
            fill="#e0ac7e"
        />

        <!-- Nariz, boca y ojos (según estado) -->
        <g class="monkey-eye-nose">
          <!-- Nariz -->
          <path
              d="m35.1 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.6.1 1 1 1 2.1"
              fill="#3b302a"
          />
          <path
              d="m30.9 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.5.1 1 1 1 2.1"
              fill="#3b302a"
          />

          <!-- Boca según estado -->
          <path
              v-if="monkeyState === 'idle'"
              d="M 28 45 Q 32 48 36 45"
              fill="none"
              stroke="#3b302a"
              stroke-width="1.5"
              stroke-linecap="round"
              opacity="0.6"
          />
          <path
              v-else-if="monkeyState === 'error'"
              d="M 28 48 Q 32 44 36 48"
              fill="none"
              stroke="#3b302a"
              stroke-width="2"
              stroke-linecap="round"
          />
          <path
              v-else
              d="M 26 44 Q 32 52 38 44"
              fill="none"
              stroke="#3b302a"
              stroke-width="2.5"
              stroke-linecap="round"
          />

          <!-- Ojos normales -->
          <g v-if="monkeyState !== 'success'">
            <ellipse
                cx="40.7"
                cy="31.7"
                rx="3.5"
                ry="4.5"
                class="monkey-eye-r"
                fill="#3b302a"
            />
            <ellipse
                cx="23.3"
                cy="31.7"
                rx="3.5"
                ry="4.5"
                class="monkey-eye-l"
                fill="#3b302a"
            />
          </g>

          <!-- Ojos de dólar en éxito -->
          <g
              v-else
              fill="#16a34a"
              style="font-family: Arial, sans-serif; font-weight: 900; font-size: 14px;"
          >
            <text x="19" y="36">$</text>
            <text x="36.5" y="36">$</text>
          </g>
        </g>
      </svg>

      <!-- Manos -->
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 64 64"
          id="monkey-hands"
      >
        <path
            fill="#89664C"
            d="M9.4,32.5L2.1,61.9H14c-1.6-7.7,4-21,4-21L9.4,32.5z"
        />
        <path
            fill="#FFD6BB"
            d="M15.8,24.8c0,0,4.9-4.5,9.5-3.9c2.3,0.3-7.1,7.6-7.1,7.6s9.7-8.2,11.7-5.6c1.8,2.3-8.9,9.8-8.9,9.8
          s10-8.1,9.6-4.6c-0.3,3.8-7.9,12.8-12.5,13.8C11.5,43.2,6.3,39,9.8,24.4C11.6,17,13.3,25.2,15.8,24.8"
        />
        <path
            fill="#89664C"
            d="M54.8,32.5l7.3,29.4H50.2c1.6-7.7-4-21-4-21L54.8,32.5z"
        />
        <path
            fill="#FFD6BB"
            d="M48.4,24.8c0,0-4.9-4.5-9.5-3.9c-2.3,0.3,7.1,7.6,7.1,7.6s-9.7-8.2-11.7-5.6c-1.8,2.3,8.9,9.8,8.9,9.8
          s-10-8.1-9.7-4.6c0.4,3.8,8,12.8,12.6,13.8c6.6,1.3,11.8-2.9,8.3-17.5C52.6,17,50.9,25.2,48.4,24.8"
        />
      </svg>
    </label>

    <!-- Formulario -->
    <form class="form" @submit.prevent="handleSubmit">
      <div class="field-group">
        <label class="label_input" for="email-input">Usuario</label>
        <input
            spellcheck="false"
            class="input"
            type="email"
            name="email"
            id="email-input"
            v-model.trim="form.email"
            autocomplete="username"
            required
        />
      </div>

      <div class="field-group">
        <div class="frg_pss">
          <label class="label_input" for="password-input">Contraseña</label>
          <button
              type="button"
              class="link-button"
              @click.prevent="handleForgotPassword"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div class="password-wrapper">
          <input
              spellcheck="false"
              class="input"
              :type="blind ? 'password' : 'text'"
              name="password"
              id="password-input"
              v-model.trim="form.password"
              autocomplete="current-password"
              required
          />

          <label for="blind-input" class="blind_input">
            <span class="hide">Ocultar</span>
            <span class="show">Mostrar</span>
          </label>
        </div>
      </div>

      <button
          class="submit"
          type="submit"
          :disabled="loading || !form.email || !form.password"
      >
        <span v-if="!loading">Ingresar</span>
        <span v-else class="loading-inline">
          <span class="loading-dot"></span>
          Validando...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const form = ref({
  email: 'superadmin@demo.com',
  password: 'demo123'
})

// true = contraseña oculta (manos arriba)
const blind = ref(true)
const loading = ref(false)

// 'idle' | 'error' | 'success'
const monkeyState = ref('idle')

const handleSubmit = async () => {
  if (!form.value.email || !form.value.password || loading.value) return

  loading.value = true
  monkeyState.value = 'idle' // reset visual

  try {
    await authStore.login(form.value)

    // ÉXITO → sonrisa grande + ojos de dólar + manos abajo
    monkeyState.value = 'success'
    blind.value = false

    toast.add({
      severity: 'success',
      summary: '¡Éxito!',
      detail: 'Credenciales correctas. Ingresando...',
      life: 2000
    })

    setTimeout(() => {
      router.push({ name: 'dashboard' })
    }, 1500)
  } catch (error) {
    // ERROR → shake y boca triste
    monkeyState.value = 'error'

    setTimeout(() => {
      monkeyState.value = 'idle'
    }, 1200)

    console.error('Login error:', error)
    toast.add({
      severity: 'error',
      summary: 'Error de acceso',
      detail:
          error?.response?.data?.message ||
          'Usuario o contraseña incorrectos.',
      life: 4000
    })
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  toast.add({
    severity: 'info',
    summary: 'Recuperar contraseña',
    detail: 'Función en desarrollo.',
    life: 3000
  })
}
</script>

<style scoped>
/* TARJETA BLANCA */
.card {
  --p-x: 2rem;
  --p-y: 2rem;
  --w-form: 420px;
  --input-px: 0.9rem;
  --input-py: 0.75rem;
  --submit-h: 48px;
  --blind-w: 78px;

  margin: 0 auto;
  width: 100%;
  max-width: var(--w-form);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: var(--p-y) var(--p-x);
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* GLOW DETRÁS DEL AVATAR */
.card-glow {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.4), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ENCABEZADO */
.card-header {
  position: relative;
  z-index: 2;
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.card-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

/* AVATAR MONO */
.avatar {
  --sz-avatar: 140px;
  position: relative;
  width: var(--sz-avatar);
  height: var(--sz-avatar);
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 0, #fefce8, #f3e8ff);
  border: 4px solid #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

/* ANIMACIÓN: ERROR */
.avatar.shake-anim {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  border-color: #ef4444;
  background: #fef2f2;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

/* ANIMACIÓN: ÉXITO */
.avatar.success-anim {
  border-color: #22c55e;
  background: #f0fdf4;
  animation: bounce 0.6s infinite alternate;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}

/* SVG INTERNOS */
.avatar svg {
  position: absolute;
  height: calc(var(--sz-avatar) - 20px);
  width: calc(var(--sz-avatar) - 20px);
  pointer-events: none;
  transform-origin: 50% 100%;
}

.avatar svg#monkey {
  z-index: 1;
}

.avatar svg#monkey-hands {
  z-index: 2;
  /* Posición inicial: abajo */
  transform: translateY(115%) rotateX(-20deg);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* PARPADEO (idle y error) */
.avatar:not(.success-anim) svg#monkey .monkey-eye-r,
.avatar:not(.success-anim) svg#monkey .monkey-eye-l {
  animation: blink 6s infinite;
  transform-origin: center;
}

@keyframes blink {
  0%,
  2%,
  4%,
  100% {
    ry: 4.5;
  }
  1%,
  3% {
    ry: 0.5;
  }
}

/* MANOS TAPANDO OJOS CUANDO BLIND = TRUE */
.blind-check:checked ~ .avatar svg#monkey-hands {
  transform: translateY(0) rotateX(0deg);
}

/* FORMULARIO */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.label_input {
  font-size: 0.9rem;
  color: #334155;
  font-weight: 600;
  margin-bottom: 0.35rem;
  display: block;
}

.input {
  width: 100%;
  padding: var(--input-py) var(--input-px);
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  color: #0f172a;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.input:focus {
  border-color: #16a34a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);
}

/* PASSWORD WRAPPER */
.password-wrapper {
  position: relative;
}

.input#password-input {
  padding-right: calc(var(--blind-w) + 1.5rem);
}

/* FORGOT PASSWORD */
.frg_pss {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link-button {
  background: none;
  border: none;
  color: #16a34a;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.link-button:hover {
  text-decoration: underline;
}

/* BOTÓN MOSTRAR/OCULTAR */
.blind_input {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  background: #fff;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.blind_input:hover {
  background: #f1f5f9;
  color: #334155;
}

/* Texto Mostrar/Ocultar */
.blind-check ~ .form .blind_input span.show {
  display: none;
}
.blind-check:checked ~ .form .blind_input span.show {
  display: block;
}
.blind-check:checked ~ .form .blind_input span.hide {
  display: none;
}

/* BOTÓN SUBMIT */
.submit {
  margin-top: 1rem;
  width: 100%;
  height: var(--submit-h);
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  transition: transform 0.1s, box-shadow 0.2s;
}

.submit:hover:enabled {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

/* LOADING */
.loading-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-dot {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Blind con type="text" */
.blind-check:checked ~ .form .input[type='text'] {
  -webkit-text-security: disc;
}

/* RESPONSIVE */
@media (max-width: 480px) {
  .card {
    padding: 1.5rem;
  }
  .avatar {
    --sz-avatar: 120px;
  }
}
</style>
