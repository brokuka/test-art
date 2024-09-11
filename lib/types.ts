export interface Data {
  locale: string
  page_data: PageData
}

export interface PageData {
  childfree?: number[]
  tree: Tree[]
}

export interface Tree {
  id: number
  depth: number
  numchild: number
  locale: Locale
  path_to_top: PathToTop[]
  childs: Child[]
}

export interface Child extends Tree { }

export interface Locale {
  [key: string]: LocaleOptions
}

export interface LocaleOptions {
  id?: number
  cg_name?: string
  cg_description?: string
  cg_title?: string
  cg_slug?: string
  meta_description?: string
  meta_keywords?: string
}

export interface PathToTop extends Omit<Child, 'path_to_top'> { }
