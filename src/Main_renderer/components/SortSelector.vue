<template>
  <div class="sort-selector">
    <div class="sort-dropdown">
      <button class="sort-button" @click="toggleDropdown">
        <span>{{ t('sort.title') }}: {{ currentSortLabel }}</span>
        <span class="dropdown-arrow" :class="{ open: showDropdown }">▼</span>
      </button>
      
      <div v-if="showDropdown" class="dropdown-menu">
        <div
          v-for="option in sortOptions"
          :key="option.value"
          class="dropdown-item"
          :class="{ active: modelValue === option.value }"
          @click="selectSort(option.value)"
        >
          <span>{{ option.label }}</span>
          <span v-if="modelValue === option.value" class="check-mark">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

export type SortType = 'updated-desc' | 'updated-asc' | 'created-desc' | 'created-asc' | 'title-asc' | 'title-desc';

const modelValue = defineModel<SortType>({ default: 'updated-desc' });

const showDropdown = ref(false);

const sortOptions = computed(() => [
  { value: 'updated-desc' as SortType, label: t('sort.updatedDesc') },
  { value: 'updated-asc' as SortType, label: t('sort.updatedAsc') },
  { value: 'created-desc' as SortType, label: t('sort.createdDesc') },
  { value: 'created-asc' as SortType, label: t('sort.createdAsc') },
  { value: 'title-asc' as SortType, label: t('sort.titleAsc') },
  { value: 'title-desc' as SortType, label: t('sort.titleDesc') },
]);

const currentSortLabel = computed(() => {
  const option = sortOptions.value.find(opt => opt.value === modelValue.value);
  return option?.label || sortOptions.value[0].label;
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function selectSort(value: SortType) {
  modelValue.value = value;
  showDropdown.value = false;
}

// 点击外部关闭下拉菜单
document.addEventListener('click', (e) => {
  const target = e.target as Element;
  if (!target.closest('.sort-dropdown')) {
    showDropdown.value = false;
  }
});
</script>

<style scoped>
.sort-selector {
  position: relative;
}

.sort-dropdown {
  position: relative;
}

.sort-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--input-background);
  border: 1px solid var(--baseColor-gray3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--baseColor-gray6);
  transition: all 0.2s;
}

.sort-button:hover {
  border-color: var(--baseColor-gray4);
  background: var(--baseColor-gray1);
}

.dropdown-arrow {
  transition: transform 0.2s;
  font-size: 0.8rem;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--input-background);
  border: 1px solid var(--baseColor-gray3);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background: var(--baseColor-gray1);
}

.dropdown-item.active {
  background: var(--baseColor-gray2);
  color: var(--baseColor-gray6);
  font-weight: 500;
}

.check-mark {
  color: #007bff;
  font-size: 0.9rem;
}
</style>