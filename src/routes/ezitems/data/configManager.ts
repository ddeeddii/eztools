import { persisted } from 'svelte-persisted-store'

export enum TemplateType {
  Vanilla, Repentogon, Legacy
}

export interface Config {
  ExportTemplate: TemplateType,
  Minify: {Template: boolean, Data: boolean},

  AutocompleteTreshold: number,
  AutocompleteMaxResults: number,
  AllowCustomItemOrigin: boolean,
  AllowInvalidSprite: boolean,
}

export const DefaultConfig: Config = {
  ExportTemplate: TemplateType.Vanilla,
  Minify: {Template: false, Data: true},
  AutocompleteTreshold: 0.3,
  AutocompleteMaxResults: 10,
  AllowCustomItemOrigin: false,
  AllowInvalidSprite: false,
}

export const Config = persisted('config', DefaultConfig)

export function resetConfig(){
  Config.set(DefaultConfig)
}