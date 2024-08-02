export interface IRoute {
  path: string;
  action: () => Promise<void | HTMLElement>;
}
