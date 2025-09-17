import { Theme } from '../../type'

type ThemeChangeCallback = (theme: 'light' | 'dark') => void;

class ThemeManager {
    private static instance: ThemeManager;
    private darkModeMediaQuery: MediaQueryList | null = null;
    private darkModeListener: ((event: MediaQueryListEvent) => void) | null = null;
    private themeChangeCallbacks: Set<ThemeChangeCallback> = new Set();
    private observer: MutationObserver;

    private constructor() {
        // 创建 MutationObserver 来监听 data-theme 属性变化
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const theme = document.body.getAttribute('data-theme') as 'light' | 'dark';
                    this.notifyThemeChange(theme);
                }
            }
        });

        // 开始观察 body 元素的属性变化
        this.observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    public static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    public onThemeChange(callback: ThemeChangeCallback): () => void {
        this.themeChangeCallbacks.add(callback);
        
        // 立即触发一次回调，传入当前主题
        const currentTheme = document.body.getAttribute('data-theme') as 'light' | 'dark';
        callback(currentTheme);

        // 返回取消订阅的函数
        return () => {
            this.themeChangeCallbacks.delete(callback);
        };
    }

    private notifyThemeChange(theme: 'light' | 'dark'): void {
        this.themeChangeCallbacks.forEach(callback => callback(theme));
    }

    public setTheme(theme: Theme): void {
        if (!this.darkModeMediaQuery) {
            this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        }
        
        if (theme === 'system') {
            const isDark = this.darkModeMediaQuery.matches;
            document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
            
            if (!this.darkModeListener) {
                this.darkModeListener = (event: MediaQueryListEvent) => {
                    document.body.setAttribute('data-theme', event.matches ? 'dark' : 'light');
                };
                this.darkModeMediaQuery.addEventListener('change', this.darkModeListener);
            }
        } else {
            document.body.setAttribute('data-theme', theme);
    
            if (this.darkModeMediaQuery && this.darkModeListener) {
                this.darkModeMediaQuery.removeEventListener('change', this.darkModeListener);
                this.darkModeListener = null;
            }
        }
        window.electronAPI.setThemeSource(theme);

        
    }
}

// 导出单例实例的方法
export const themeManager = ThemeManager.getInstance();

// 为了保持向后兼容，导出 setTheme 函数
export function setTheme(theme: Theme) {
    themeManager.setTheme(theme);
}