import { existsSync } from "fs";
import { join } from "path";
import { configManager } from "./Config";

/**
 * I18n class for handling internationalization in the application.
 * It loads translations from JSON files based on the selected language.
 */




 class I18n{
    private language: string;
    private translations: Record<string, string>;

    constructor(language: string = 'zh') {
        this.language = language;
        this.translations = {};
        this.loadTranslations();
    }

    private loadTranslations() {
        const localePath = join(__dirname, 'locales', `${this.language}.json`);
        if(existsSync(localePath)){
            try{
                this.translations = require(localePath);
            }catch (error) {
                this.translations = {};
                console.error(`Error loading translations for ${this.language}:`, error);
            }
        }
    }

    setLanguage(language: string) {
        this.language = language;
        this.loadTranslations();
    }
    t(key: string,params?:Record<string,string|number>): string {
        let str = this.translations[key] || key;
        if(params){
            Object.keys(params).forEach(k=>{
                str = str.replace(new RegExp(`{${k}}`, 'g'), params[k].toString());
            })
        }
        return str;
    }
    getLanguage(): string {
        return this.language;
    }
}


export let  i18n = new I18n(configManager.getConfig().language);