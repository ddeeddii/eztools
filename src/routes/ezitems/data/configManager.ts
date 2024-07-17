import { persisted } from 'svelte-persisted-store'

export enum TemplateType {
  Vanilla, Repentogon
}

export interface Config {
  ExportTemplate: TemplateType,
  Minify: {Template: boolean},

  AutocompleteThreshold: number,
  AutocompleteMaxResults: number,
  AllowInvalidSprite: boolean,
  DevMode: {
    Enabled: boolean,
    ItemsToGenerate: number,
    UseDummyItems: boolean,
  },
}

export const DefaultConfig: Config = {
  ExportTemplate: TemplateType.Vanilla,
  Minify: {Template: false},
  AutocompleteThreshold: 0.3,
  AutocompleteMaxResults: 10,
  AllowInvalidSprite: false,
  DevMode: {
    Enabled: false,
    ItemsToGenerate: 1,
    UseDummyItems: true,
  },
}

export const Config = persisted('config', DefaultConfig)

export function resetConfig(){
  Config.set(DefaultConfig)
}