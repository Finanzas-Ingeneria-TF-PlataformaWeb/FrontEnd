<template>
  <div class="auth-wrapper flex align-items-center justify-content-center">
    <Card class="auth-card w-full sm:w-8 md:w-5 lg:w-3">
      <template #title>
        <div class="auth-title">
          <span class="auth-title-main">MiVivienda – Acceso</span>
          <span class="auth-title-sub">
            Accede al simulador de créditos de la inmobiliaria.
          </span>
        </div>
      </template>

      <template #content>
        <!-- Aquí se dibuja LoginView -->
        <RouterView />
      </template>
    </Card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #16a34a, #064e3b);
  padding: 1.5rem;
}

.auth-card {
  border-radius: 16px;
}

.auth-title {
  text-align: center;
}

.auth-title-main {
  display: block;
  font-weight: 600;
  font-size: 1.05rem;
  color: #111827;
}

.auth-title-sub {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6b7280;
}
</style>
