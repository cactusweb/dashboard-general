export interface AboutDTO {
  banner?: string;
  description: string;
  actions: AboutActionDTO[];
  seo?: AboutPageSeoDTO;
}

export interface AboutActionDTO {
  title: string;
  description?: string;
  button: AboutButtonDTO;
}

export interface AboutButtonDTO {
  link: string;
  text: string;
}

export interface AboutPageSeoDTO {
  preview?: string;
  description?: string;
}
