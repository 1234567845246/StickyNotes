import { ref,computed } from 'vue';
import { PathInfo } from '../../type';

// 文件比较逻辑组合函数
export function useFileCompare() {
  const leftPath = ref<PathInfo>({ path: '', type: null });
  const rightPath = ref<PathInfo>({ path: '', type: null });
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const type = ref<'file' | 'directory' | null>('directory');

  // 检查是否可以比较
  const canCompare = computed(() => {
    return leftPath.value.type && 
           rightPath.value.type && 
           leftPath.value.type === rightPath.value.type && 
           leftPath.value.path && 
           rightPath.value.path;
  });

  // 选择路径
  const selectPath = async (side: 'left' | 'right') => {
    try {
      const path = await window.electronAPI.openDialog({ 
        title: '选择文件或文件夹',
       type:type.value === 'directory' ? 'directory' : 'file'
      });
      
      if (path) {
        const type = await window.electronAPI.getPathType(path);
        
        if (side === 'left') {
          leftPath.value = { path, type };
        } else {
          rightPath.value = { path, type };
        }
      }
    } catch (err) {
      error.value = `选择路径出错: ${err instanceof Error ? err.message : String(err)}`;
    }
  };

  return {
    leftPath,
    rightPath,
    isLoading,
    error,
    canCompare,
    selectPath,
    type
  };
}