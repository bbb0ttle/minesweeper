import {_decorator, Component, Label} from 'cc';
import {Board} from "db://assets/Scripts/Board";
import {EventManager, MineEvent} from "db://assets/Scripts/Utils/Event";
import {GameStatus} from "db://assets/Scripts/types/status";
import {EmojiDict} from "db://assets/Scripts/Utils/EmojiDict";
import {Timer} from "db://assets/Scripts/Utils/Timer";

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  start() {
    EventManager.on(MineEvent.GameOver, this.gameOver, this);
    EventManager.on(MineEvent.RefreshGameStats, this.refreshGameStats);
    EventManager.on(MineEvent.Restart, this.restart, this);
  }

  private _isGameOver: boolean = false;
  public get isGameOver() {
    return this._isGameOver;
  }
  private _timer: Timer = new Timer();

  private changeStatusIcon(s: GameStatus) {
    if (this.status === null) {
      return;
    }

    this.status.string = EmojiDict.FindByStatus(s);
  }

  @property({ type: Board })
  public board: Board | null;

  @property({ type: Label })
  public status: Label | null;

  @property({ type: Label })
  public stats: Label | null;

  public refreshGameStats(stats: string) {
    if (this.stats === null) {
      return;
    }

    this.stats.string = stats;
  }

  public restart() {
    this.refreshGameStats("")
    this.changeStatusIcon(GameStatus.Running);
    this.board.reset();
    this._isGameOver = false;
  }

  public tryStarTimer() {
    this._timer.tryStart();
  }


  public gameOver(win: boolean) {
    this._isGameOver = true;
    this._timer.stop();
    this.changeStatusIcon(win ? GameStatus.Win : GameStatus.Fail);
    if (win) {
      this.refreshGameStats(this._timer.getSecStr());
    }
    this.board.revealAll();
  }

  onDestroy() {
    EventManager.off(MineEvent.GameOver, this.gameOver, this);
    EventManager.off(MineEvent.RefreshGameStats, this.refreshGameStats);
    EventManager.off(MineEvent.Restart, this.restart, this);
  }
}
