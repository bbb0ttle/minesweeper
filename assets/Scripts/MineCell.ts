import {_decorator, Color, Component, EventMouse, Graphics, Node, RichText} from 'cc';
import {CellState} from "db://assets/Scripts/types/cell";
import {Board} from "db://assets/Scripts/Board";
import {EventManager, MineEvent} from "db://assets/Scripts/Utils/Event";

const { ccclass, property } = _decorator;

@ccclass('MineCell')
export class MineCell extends Component {
    start() {
        this.initSubStateUI();
        this.initNormalCellUI();
        this.state = CellState.Normal;

        this.node.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event: EventMouse) {
        if (this._board.manager.isGameOver) {
            EventManager.emit(MineEvent.Restart, false);
            return;
        }

        if (this.isRevealed()) {
            return;
        }

        this._board.manager.tryStarTimer();

        if (event.getButton() === 0) {
            this.handleLeftClick();
            return;
        }

        if (event.getButton() === 2) {
            this.handleRightClick();
            return;
        }
    }

    public reveal() {
        if (this.hasMine) {
            this.state = CellState.Mine;
            return;
        }


        const count = this._board.getMineCount(this);
        // if around has no mine, set empty
        if (count === 0) {
            this.state = CellState.Empty;
            return;
        }

        this.setNumber(count);
    }

    public reset() {
        this.state = CellState.Normal;
        this.hasMine = false;
    }

    public attachToBoard(board: Board) {
        this._board = board;
    }

    private _col: number;
    private _row: number;

    public getCol() {
        return this._col;
    }

    public getRow() {
        return this._row;
    }

    public assignPosition(col: number, row: number) {
        this._col = col;
        this._row = row;
    }

    private _board: Board;

    public isRevealed() {
        return this.state === CellState.Number || this.state === CellState.Empty;
    }

    handleLeftClick() {
        if (this.hasMine) {
            this.state = CellState.Mine;
            EventManager.emit(MineEvent.GameOver, false);
            return
        }

        const count = this._board.getMineCount(this);

        if (count === 0) {
            this._board.autoReveal(this);
            this.state = CellState.Empty;
            return;
        }

        this.setNumber(count);

        if(this._board.isWin()) {
            EventManager.emit(MineEvent.GameOver, true);
        }

        return;

    }

    handleRightClick() {
        if (this.state === CellState.Flag) {
            this.state = CellState.Normal;
            return;
        }

        if (this.state === CellState.Normal) {
            this.state = CellState.Flag;
            return;
        }

        return;
    }

    private _state= CellState.Normal;
    public get state() {
        return this._state;
    }
    public set state(value) {
        this._state = value;
        this.changeStateUI(value);
    }

    public _hasMine = false;
    public get hasMine() {
        return this._hasMine;
    }
    public set hasMine(value) {
        this._hasMine = value;
    }

    public setNumber(number: number) {
        if (number === 0) {
            this.state = CellState.Empty;
            return;
        }

        const numNode = this.getSubStateUI(CellState.Number);
        const valNode = numNode.getChildByName("val")
        const richText = valNode.getComponent(RichText);

        // set number
        richText.string = number.toString();
        this.state = CellState.Number;
    }

    changeStateUI(state: CellState) {
        for (let key in this._stateUIDict) {
           this._stateUIDict[key].active = false;
        }

        this._stateUIDict[state].active = true;
    }

    private _stateUIDict = {
    }

    initSubStateUI() {
        this._stateUIDict[CellState.Normal] = this.node.getChildByName('normal');
        this._stateUIDict[CellState.Number] = this.node.getChildByName('number');
        this._stateUIDict[CellState.Mine] = this.node.getChildByName('bomb');
        this._stateUIDict[CellState.Flag] = this.node.getChildByName('flag');
        this._stateUIDict[CellState.Empty] = this.node.getChildByName('empty');
    }

    getSubStateUI(state: CellState): Node {
        return this._stateUIDict[state];
    }

    initNormalCellUI() {
        // stroke border
        const normalNode = this.getSubStateUI(CellState.Normal);

        let graphics = normalNode.getComponent(Graphics);

        graphics.lineWidth = 3;
        graphics.strokeColor = Color.BLACK;
        graphics.rect(-24, -24, 48, 48);
        Color.fromHEX(graphics.fillColor, "#111111");
        graphics.fill();
        // graphics.stroke();
    }

    update(deltaTime: number) {

    }
}


