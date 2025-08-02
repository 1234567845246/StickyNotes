// 用于为 window.electronAPI 提供类型提示
import { ElectronAPI } from "../preload/preload_main";

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
