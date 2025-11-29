<template>
  <div class="flex min-h-screen">
    <AppSidebar />

    <div class="flex flex-column flex-1">
      <AppHeader />
      <main class="p-4">
        <PageContainer>
          <router-view />
        </PageContainer>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import PageContainer from '@/components/common/PageContainer.vue'
</script>
