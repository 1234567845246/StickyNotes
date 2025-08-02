 // src/main/Config.ts
import {existsSync,readFileSync,writeFileSync} from 'fs'

import { defaultconfig, Config } from '../type'
import { app } from 'electron'
import { join } from 'path'

class ConfigManager {
  private configPath:string =join(app.getPath('userData'), 'config.json');
  private config: Config

  constructor() {
    this.config = this.readConfigFromFile()
  }

  private readConfigFromFile(): Config {
    try {
      if (existsSync(this.configPath)) {
        const raw = readFileSync(this.configPath, 'utf-8')
        return { ...defaultconfig, ...JSON.parse(raw) }
      }
    } catch (e) {
      console.error('读取配置失败:', e)
    }
    return { ...defaultconfig }
  }

  public getConfig(): Config {
    return this.config
  }

  public setConfig(newConfig: Partial<Config>) {
    this.config = { ...this.config, ...newConfig }
    this.saveConfigToFile()
  }

  public saveConfigToFile() {
    try {
      writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8')
    } catch (e) {
      console.error('保存配置失败:', e)
    }
  }

  public reload() {
    this.config = this.readConfigFromFile()
  }
}


export const configManager = new ConfigManager()