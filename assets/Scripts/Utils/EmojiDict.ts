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
}