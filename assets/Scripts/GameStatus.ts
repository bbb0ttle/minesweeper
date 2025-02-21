import { _decorator, Component, Node, RichText, Label } from 'cc';
import {GameStatus as Status} from "db://assets/Scripts/types/status";
import {Emoji, EmojiDict} from "db://assets/Scripts/Utils/EmojiDict";
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameStatus extends Component {
    start() {
        this._label = this.node.getChildByName("Label").getComponent(Label);
    }

    private _label: Label;

    private _status2emoji = {
        [Status.Running]: Emoji.Smile,
        [Status.Fail]: Emoji.Sad,
        [Status.Win]: Emoji.Victory,
    }

    public setStatus(s: Status) {
        this._label.string = EmojiDict.Find(this._status2emoji[s]);
    }

    update(deltaTime: number) {

    }
}


