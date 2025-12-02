<template>
  <div class="auth-wrapper flex flex-column align-items-center justify-content-center">

    <img
        src="@/assets/logo.svg"
        alt="Logo JBFRG"
        class="mb-4"
        style="width: 250px;"
    />

    <Card class="auth-card w-full sm:w-8 md:w-5 lg:w-3">
      <template #title>
        <div class="auth-title">
          <span class="auth-title-main">Bienvenido</span>
        </div>
      </template>

      <template #content>
        <RouterView />
      </template>
    </Card>
  </div>
</template>

<script setup>
// No necesitas importar nada extra si usas @/assets en el template directamente
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  /* Tu gradiente verde original se mantiene, perfecto para el logo blanco */
  background: linear-gradient(135deg, #16a34a, #064e3b);
  padding: 1.5rem;
}

.auth-card {
  border-radius: 16px;
  /* Opcional: una sombra un poco más fuerte para que destaque del fondo */
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.auth-title {
  text-align: center;
}

.auth-title-main {
  display: block;
  font-weight: 600;
  font-size: 1.5rem; /* Un poco más grande */
  color: #111827;
}

.auth-title-sub {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: #6b7280;
}
</style>