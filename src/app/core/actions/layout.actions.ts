import { Action } from "@ngrx/store";

import { createActionType } from "../shared/utils";


export const OPEN_SIDENAV = createActionType('LAYOUT_OPEN_SIDENAV');
export const CLOSE_SIDENAV = createActionType('LAYOUT_CLOSE_SIDENAV');

export class OpenSidenav implements Action {
  readonly type = OPEN_SIDENAV;
}

export class CloseSidenav implements Action {
  readonly type = CLOSE_SIDENAV;
}

export type Actions = 
  OpenSidenav
  | CloseSidenav;
