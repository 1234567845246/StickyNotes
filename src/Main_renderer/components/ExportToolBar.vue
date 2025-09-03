<template>
    <DropdownToolbar :title="$t('export')" :visible="visible" :onChange="handleChange">
        <template #overlay>

            <ol class="md-editor-menu" role="menu">
                <li @click="exportmarkdown" class="md-editor-menu-item md-editor-menu-item-image" role="menuitem"
                    tabindex="0">
                    Markdown
                </li>
                <li @click="exporthtml" class="md-editor-menu-item md-editor-menu-item-image" role="menuitem"
                    tabindex="0">
                    HTML
                </li>
                <li @click="showPdfConfig" class="md-editor-menu-item md-editor-menu-item-image" role="menuitem"
                    tabindex="0">
                    PDF
                </li>
            </ol>

        </template>
        <svg t="1755068370317"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="11569"  class="lucide lucide-forward-icon md-editor-icon"  width="24" height="24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
                d="M469.333333 682.666667V42.666667c0-23.466667 19.2-42.666667 42.666667-42.666667s42.666667 19.2 42.666667 42.666667v640c0 23.466667-19.2 42.666667-42.666667 42.666666s-42.666667-19.2-42.666667-42.666666"
                fill="currentColor"  p-id="11570"></path>
            <path
                d="M226.210133 268.0576L481.826133 12.433067a42.7776 42.7776 0 0 1 60.330667 0c16.597333 16.597333 16.597333 43.776 0 60.330666L286.5408 328.388267a42.7776 42.7776 0 0 1-60.330667 0 42.7776 42.7776 0 0 1 0-60.330667"
                fill="currentColor"  p-id="11571"></path>
            <path
                d="M542.0544 12.4416l255.616 255.616a42.7776 42.7776 0 0 1 0 60.330667c-16.597333 16.605867-43.776 16.605867-60.330667 0L481.723733 72.789333a42.7776 42.7776 0 0 1 0-60.330666 42.7776 42.7776 0 0 1 60.330667 0M896 1024H128c-70.570667 0-128-57.429333-128-128V640c0-23.594667 19.072-42.666667 42.666667-42.666667s42.666667 19.072 42.666666 42.666667v256c0 23.552 19.114667 42.666667 42.666667 42.666667h768c23.552 0 42.666667-19.114667 42.666667-42.666667V640c0-23.594667 19.072-42.666667 42.666666-42.666667s42.666667 19.072 42.666667 42.666667v256c0 70.570667-57.429333 128-128 128"
                fill="currentColor" p-id="11572"></path>
        </svg>
    </DropdownToolbar>

    <!-- PDF 配置对话框 -->
    <CustomDialog v-model="showPdfDialog" v-model:title="pdfDialogTitle">
        <div class="content">
            <div class="grid_item adjoin-child-margins v-align-top">
                <label>{{ $t('pageSize') }}</label>
                <p>
                    <select class="select" v-model="pdfConfig.format">
                        <option value="a4">A4</option>
                        <option value="a3">A3</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                    </select>
                </p>
                
                <label>{{ $t('pageOrientation') }}</label>
                <p>
                    <CustomRadioGroup v-model="pdfConfig.orientation">
                        <CustomRadio value="portrait">{{ $t('portrait') }}</CustomRadio>
                        <CustomRadio value="landscape">{{ $t('landscape') }}</CustomRadio>
                    </CustomRadioGroup>
                </p>
                
                <label>{{ $t('margin') }} ({{ $t('mm') }})</label>
                <div class="margin-inputs">
                    <div class="margin-input">
                        <label>{{ $t('top') }}</label>
                        <IntegerInput v-model="pdfConfig.margin.top" :min="0" :max="50" />
                    </div>
                    <div class="margin-input">
                        <label>{{ $t('bottom') }}</label>
                        <IntegerInput v-model="pdfConfig.margin.bottom" :min="0" :max="50" />
                    </div>
                    <div class="margin-input">
                        <label>{{ $t('left') }}</label>
                        <IntegerInput v-model="pdfConfig.margin.left" :min="0" :max="50" />
                    </div>
                    <div class="margin-input">
                        <label>{{ $t('right') }}</label>
                        <IntegerInput v-model="pdfConfig.margin.right" :min="0" :max="50" />
                    </div>
                </div>
                
                <label>{{ $t('quality') }}</label>
                <p>
                    <input type="range" v-model.number="pdfConfig.image.quality" min="0.1" max="1" step="0.1">
                    <span style="margin-left: 10px; font-weight: bold;">{{ pdfConfig.image.quality.toFixed(1) }}</span>
                </p>
            </div>
        </div>
        
        <div class="buttons grid" style="grid-template-columns: minmax(min-content, auto) minmax(min-content, auto);">
            <div class="grid_item v-align-bottom h-align-left" style="grid-auto-flow: column">
                <!-- 左侧占位 -->
            </div>
            <div class="grid_item h-align-right v-align-bottom" style="grid-auto-flow: column">
                <button class="button primary_button" style="margin-left: 10px;" @click="exportPdfWithConfig">
                    {{ $t('exportPdf') }}
                </button>
                <button class="button" style="margin-left: 10px;" @click="closePdfDialog">
                    {{ $t('cancel') }}
                </button>
            </div>
        </div>
    </CustomDialog>

</template>


<script setup lang="ts">
import { DropdownToolbar } from 'md-editor-v3';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import html2pdf from 'html2pdf.js';
import CustomDialog from './CustomDialog.vue';
import CustomRadio from './CustomRadio.vue';
import CustomRadioGroup from './CustomRadioGroup.vue';
import IntegerInput from './IntegerInput.vue';

const { t } = useI18n();
const props = withDefaults(defineProps<{ 
    markdown: string, 
    html: string,
    theme?: string,
    previewTheme?: string,
    language?: string,
    codeTheme?: string,
    disabled?: boolean,
    showToolbarName?: boolean,
    insert?: Function
}>(), { 
    markdown: '', 
    html: '',
    theme: 'light',
    previewTheme: 'default',
    language: 'zh-CN',
    codeTheme: 'github',
    disabled: false,
    showToolbarName: false
})

const visible = ref<boolean>(false);
const showPdfDialog = ref<boolean>(false);

// PDF配置对话框标题
const pdfDialogTitle = computed(() => t('pdfConfig'));

// PDF配置选项
const pdfConfig = ref({
    margin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    },
    filename: 'note.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 ,useCORS:true},
    pagesPerCanvas: window.navigator.userAgent.includes('Chrome') ? 19 : 9,
   pagebreak: { mode: 'avoid-all', before: '#page2el' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    format: 'a4',
    orientation: 'portrait'
});

function handleChange(_visible: boolean) {
    visible.value = _visible;
}

// 显示PDF配置对话框
function showPdfConfig() {
    handleChange(false);
    showPdfDialog.value = true;
}

// 关闭PDF配置对话框
function closePdfDialog() {
    showPdfDialog.value = false;
}

// 使用配置导出PDF
function exportPdfWithConfig() {
    closePdfDialog();
    
    // 更新PDF配置
    const config = {
        filename: `note-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: pdfConfig.value.image,
        html2canvas: pdfConfig.value.html2canvas,
        jsPDF: {
            ...pdfConfig.value.jsPDF,
            format: pdfConfig.value.format,
            orientation: pdfConfig.value.orientation
        },
        // html2pdf.js 支持统一边距设置
        margin: [pdfConfig.value.margin.top, pdfConfig.value.margin.right, pdfConfig.value.margin.bottom, pdfConfig.value.margin.left]
    };
    
    // 创建临时DOM元素
    const element = document.createElement('div');
    element.innerHTML = props.html;
    element.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: none;
        padding: 20px;
    `;
    
    // 使用html2pdf导出
    html2pdf().set(config).from(element).save().then(() => {
    }).catch((error: any) => {
        console.error('PDF export failed:', error);
    });
}

function exportmarkdown() {
    handleChange(false);
    exportData({
        suggestedName: `note-${new Date().toISOString().slice(0, 10)}.md`,
        types: [{
            description: t('filterfile'),
            accept: {
                "text/markdown": ['.md', '.markdown', '.mdown']
            }
        }]
    }, props.markdown)
}

function exporthtml() {
    handleChange(false);
    exportData({
        suggestedName: `note-${new Date().toISOString().slice(0, 10)}.html`,
        types: [{
            description: t('filterfile1'),
            accept: {
                'text/html': ['.html']
            }
        }]
    },removeImageProtocol(props.html))
}

function removeImageProtocol(html:string){
     return html.replace(
        /<img([^>]*)src="image:\/\/([^"]+)"([^>]*)>/gi,
        (_, before, path, after) => {
          return `<img${before}src="${path}"${after}>`;
        }
      );
}

async function exportData(options: SaveFilePickerOptions, content: string) {
    try {
        const handle = await window.showSaveFilePicker(options);
        const writableStream = await handle.createWritable();
        await writableStream.write(content);
        await writableStream.close();
    } catch (err) {

    }
}

</script>

<style scoped>
/* 借鉴 ConfigPanel 的基础样式 */
.content {
    padding-right: 8px;
    overflow: auto;
}

.content label {
    line-height: 23px;
    display: block;
    font-weight: 600;
    color: var(--content-foreground);
    font-size: 14px;
}

.content p {
    margin: 0 0 5px;
}


.grid {
    contain: content;
    display: grid;
}

.h-align-left {
    justify-self: start;
}

.h-align-right {
    justify-self: end;
    text-align: right;
}

.v-align-bottom {
    align-content: end;
}

.v-align-top {
    align-content: start;
}

.adjoin-child-margins {
    display: block;
}

.adjoin-child-margins label {
    display: block;
    margin-top: 15px;
}

.buttons {
    padding-top: 12px;
    padding-right: 8px;
}

/* 边距输入样式 */
.margin-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 8px;
}

.margin-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.margin-input label {
    font-size: 12px;
    font-weight: 500;
    color: var(--content-foreground);
    margin-top: 0 !important;
}

/* 滑块样式优化 */
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    background: var(--select-border);
    outline: none;
    border-radius: 3px;
    margin: 8px 0;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--button-primary);
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--button-primary);
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .margin-inputs {
        grid-template-columns: 1fr;
    }
}
</style>