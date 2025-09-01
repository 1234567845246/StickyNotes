<template>
  <div class="loading-container">
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
    <div class="dot dot3"></div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: var(--content-background);
}
.dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 0 12px;
  animation: rotate-dot 1.2s linear infinite;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.dot1 {
  background: linear-gradient(135deg, #5e35b1, #3949ab);
  animation-delay: 0s;
}
.dot2 {
  background: linear-gradient(135deg, #f9aa33, #ff5d5d);
  animation-delay: 0.2s;
}
.dot3 {
  background: linear-gradient(135deg, #4fc3f7, #66bb6a);
  animation-delay: 0.4s;
}
@keyframes rotate-dot {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

:root {
  --content-background: var(--baseColor-gray0, #fff);
}
[data-theme="dark"] .loading-container {
  background: var(--content-background, #1a1a1a);
}
</style>
