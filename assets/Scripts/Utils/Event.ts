import { EventTarget } from 'cc';
const MineEventTarget = new EventTarget();

export enum MineEvent {
  GameOver = 'GameOver',
  RefreshGameStats = 'RefreshGameStats',
  Restart = 'Restart',
}

export class EventManager {
  public static emit(event: MineEvent, ...args: any[]) {
    MineEventTarget.emit(event, ...args);
  }

  public static on(event: MineEvent, callback: (...args: any[]) => void, target?: any) {
    MineEventTarget.on(event, callback, target);
  }

  public static off(event: MineEvent, callback?: (...args: any[]) => void, target?: any) {
    MineEventTarget.off(event, callback, target);
  }
}
