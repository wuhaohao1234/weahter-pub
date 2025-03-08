<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="w-full h-full"
  >
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" />
    <path d="M19.07 4.93l-1.41 1.41" />
    <path d="M12 6a6 6 0 0 0-6 6c0 7 3 9 3 9h6s3-2 3-9a6 6 0 0 0-6-6z" />
    <path d="M12 8a4 4 0 0 0-4 4c0 1 0 3 2 5s4 4 4 4 4-3 4-4a4 4 0 0 0-4-4z" />
  </svg>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'currentColor'
  }
})
</script> 