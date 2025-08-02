import { Theme } from '../../type'

let darkModeMediaQuery: MediaQueryList | null = null
let darkModeListener: ((event: MediaQueryListEvent) => void) | null = null

export function setTheme(theme: Theme) {
    if (!darkModeMediaQuery) {
        darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    }
    if (theme === 'system') {
        document.documentElement.setAttribute('data-theme', darkModeMediaQuery.matches ? 'dark' : 'light')
        window.electronAPI.setThemeSource('system')
        if (!darkModeListener) {
            darkModeListener = (event: MediaQueryListEvent) => {
                document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light')
            }
            darkModeMediaQuery.addEventListener('change', darkModeListener)
        }
    } else {
        document.documentElement.setAttribute('data-theme', theme)
        window.electronAPI.setThemeSource(theme)
        if (darkModeMediaQuery && darkModeListener) {
            darkModeMediaQuery.removeEventListener('change', darkModeListener)
            darkModeListener = null
        }
    }
}