import {GameStatus as Status} from "db://assets/Scripts/types/status";

export enum Emoji {
    Smile,
    Victory,
    Sad,
    Timer,
    Exploding,
}

const Dict = {
    [Emoji.Smile]: "🙂",
    [Emoji.Victory]: "🎉",
    [Emoji.Timer]: "⌚",
    [Emoji.Sad]: "😞",
    [Emoji.Exploding]: "🤯",
}

export class EmojiDict {
    public static Find(e: Emoji) {
        return Dict[e] || Dict[Emoji.Exploding];
    }

    private static _status2emoji = {
        [Status.Running]: Emoji.Smile,
        [Status.Fail]: Emoji.Sad,
        [Status.Win]: Emoji.Victory,
    }

    public static FindByStatus(s: Status) {
        return Dict[this._status2emoji[s]] || Dict[Emoji.Exploding];
    }
}
