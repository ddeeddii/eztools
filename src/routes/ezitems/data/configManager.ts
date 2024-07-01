import { persisted } from 'svelte-persisted-store'

export enum TemplateType {
  Vanilla, Repentogon
}

export interface Config {
  ExportTemplate: TemplateType,
  Minify: {Template: boolean, Data: boolean},

  AutocompleteThreshold: number,
  AutocompleteMaxResults: number,
  AllowInvalidSprite: boolean,
}

export const DefaultConfig: Config = {
  ExportTemplate: TemplateType.Vanilla,
  Minify: {Template: false, Data: true},
  AutocompleteThreshold: 0.3,
  AutocompleteMaxResults: 10,
  AllowInvalidSprite: false,
}

export const Config = persisted('config', DefaultConfig)

export function resetConfig(){
  Config.set(DefaultConfig)
}